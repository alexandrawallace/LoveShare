import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Box,
  Typography,
  Avatar,
  Chip,
  useTheme,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuthContext } from "../../contexts/AuthContext";

interface NavigationCardViewProps {
  tableData: any[];
  tableConfig: any;
  selectedTable: string;
  renderCellContent: (value: any, key: string) => React.ReactNode;
  onEdit?: (data: any) => void;
  onDelete?: (data: any) => void;
}

const NavigationCardView: React.FC<NavigationCardViewProps> = ({
  tableData,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  // 读取环境变量，默认为中号
  const cardSize = import.meta.env.VITE_NAVIGATION_CARD_SIZE || "medium";

  // 定义卡片配置类型
  interface CardConfig {
    gridColumnMinWidth: string;
    padding: number;
    avatarSize: number;
    titleFontSize: string;
    abstractLines: number;
    abstractFontSize: string;
    buttonSize: "small" | "medium" | "large";
  }

  // 根据卡片尺寸确定样式配置
  const getCardConfig = (): CardConfig => {
    switch (cardSize) {
      case "small": // 小
        return {
          gridColumnMinWidth: "280px",
          padding: 1.5,
          avatarSize: 40,
          titleFontSize: "0.95rem",
          abstractLines: 0,
          abstractFontSize: "0.85rem",
          buttonSize: "small",
        };
      case "large": // 大
        return {
          gridColumnMinWidth: "450px",
          padding: 3.5,
          avatarSize: 80,
          titleFontSize: "1.4rem",
          abstractLines: 4,
          abstractFontSize: "1rem",
          buttonSize: "medium",
        };
      default: // 中
        return {
          gridColumnMinWidth: "350px",
          padding: 2,
          avatarSize: 64,
          titleFontSize: "1.25rem",
          abstractLines: 3,
          abstractFontSize: "0.95rem",
          buttonSize: "medium",
        };
    }
  };

  const cardConfig = getCardConfig();

  // 处理卡片点击
  const handleCardClick = (row: any) => {
    if (row.to_article === false) {
      // 跳转到外部链接，新窗口打开
      window.open(row.to_link || "#", "_blank", "noopener noreferrer");
    } else {
      // 跳转到文章页面，使用slug作为路径参数
      navigate(`/article/${row.slug || "test"}`);
    }
  };

  // 阻止事件冒泡
  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    callback();
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: `repeat(auto-fill, minmax(${Math.min(
            parseInt(cardConfig.gridColumnMinWidth),
            280
          )}px, 1fr))`,
          sm: `repeat(auto-fill, minmax(${Math.min(
            parseInt(cardConfig.gridColumnMinWidth),
            320
          )}px, 1fr))`,
          md: `repeat(auto-fill, minmax(${cardConfig.gridColumnMinWidth}, 1fr))`,
        },
        gap: {
          xs: 2,
          md: 3,
        },
        justifyContent: "center",
        padding: {
          xs: 1,
          md: 2,
        },
      }}
    >
      {tableData.map((row, index) => (
        <Paper
          key={row.id || index}
          sx={{
            p: {
              xs: Math.max(cardConfig.padding - 0.5, 1),
              md: cardConfig.padding,
            },
            height: "100%",
            display: "flex",
            flexDirection: cardSize === "small" ? "row" : "column",
            borderRadius: 2.5,
            boxShadow: theme.shadows[3],
            transition:
              "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), " +
              "box-shadow var(--theme-transition-duration) cubic-bezier(0.4, 0, 0.2, 1), " +
              "border-color var(--theme-transition-duration) cubic-bezier(0.4, 0, 0.2, 1), " +
              "background-color var(--theme-transition-duration) cubic-bezier(0.4, 0, 0.2, 1), " +
              "cursor var(--theme-transition-duration) cubic-bezier(0.4, 0, 0.2, 1)",
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: "background.paper",
            backdropFilter: "blur(10px)",
            cursor: "pointer",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: theme.shadows[5],
              borderColor: theme.palette.primary.main,
            },
          }}
          onClick={() => handleCardClick(row)}
        >
          {/* Small尺寸布局：图标 title + 摘要 */}
          {cardSize === "small" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                width: "100%",
              }}
            >
              {/* 图标 */}
              <Avatar
                src={row.img || undefined}
                alt={row.title}
                sx={{
                  width: cardConfig.avatarSize,
                  height: cardConfig.avatarSize,
                  borderRadius: 1.5,
                  boxShadow: 2,
                  bgcolor: theme.palette.primary.light,
                  border: `2px solid ${theme.palette.background.paper}`,
                }}
              >
                {!row.img && row.title?.charAt(0)?.toUpperCase()}
              </Avatar>

              {/* 标题和摘要 */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: cardConfig.titleFontSize,
                    lineHeight: 1.3,
                    color: "text.primary",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    mb: 0.25,
                  }}
                >
                  {row.title || "无标题"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.75rem",
                    lineHeight: 1.3,
                    color: "text.secondary",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {row.abstract || "无摘要"}
                </Typography>
              </Box>

              {/* 操作按钮 */}
              {isAuthenticated && (
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  {onEdit && (
                    <Tooltip title="编辑">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => handleButtonClick(e, () => onEdit(row))}
                        sx={{
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {onDelete && (
                    <Tooltip title="删除">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) =>
                          handleButtonClick(e, () => onDelete(row))
                        }
                        sx={{
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              )}
            </Box>
          )}

          {/* Medium和Large尺寸布局 */}
          {(cardSize === "medium" || cardSize === "large") && (
            <>
              {/* 顶部：图标 + 标题 + 分类 */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  mb: cardSize === "medium" ? 1 : 2,
                }}
              >
                {/* 图标 */}
                <Avatar
                  src={row.img || undefined}
                  alt={row.title}
                  sx={{
                    width: cardConfig.avatarSize,
                    height: cardConfig.avatarSize,
                    borderRadius: 1.5,
                    boxShadow: 2,
                    bgcolor: theme.palette.primary.light,
                    border: `2px solid ${theme.palette.background.paper}`,
                    transition:
                      "transform 0.3s ease, background-color var(--theme-transition-duration) ease, border-color var(--theme-transition-duration) ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {!row.img && row.title?.charAt(0)?.toUpperCase()}
                </Avatar>

                {/* 标题和分类 */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: cardConfig.titleFontSize,
                      lineHeight: 1.3,
                      color: "text.primary",
                      mb: 0.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {row.title || "无标题"}
                  </Typography>

                  {row.obj && (
                    <Chip
                      label={row.obj}
                      size="small"
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: "white",
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        height: 22,
                      }}
                    />
                  )}
                </Box>
              </Box>

              {/* 摘要内容 - Medium和Large都显示 */}
              <Box sx={{ mb: cardSize === "large" ? 3 : 2, flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: cardConfig.abstractFontSize,
                    lineHeight: 1.6,
                    color: "text.secondary",
                    textAlign: "justify",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: cardConfig.abstractLines,
                    WebkitBoxOrient: "vertical",
                    transition: "color var(--theme-transition-duration) ease",
                  }}
                >
                  {row.abstract || "无摘要"}
                </Typography>
              </Box>

              {/* 操作按钮 */}
              {isAuthenticated && (
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                >
                  {onEdit && (
                    <Tooltip title="编辑">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => handleButtonClick(e, () => onEdit(row))}
                        sx={{
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {onDelete && (
                    <Tooltip title="删除">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) =>
                          handleButtonClick(e, () => onDelete(row))
                        }
                        sx={{
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              )}
            </>
          )}
        </Paper>
      ))}
    </Box>
  );
};

export default NavigationCardView;
