import React from "react";
import {
  Paper,
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  useTheme,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface NavigationCardViewProps {
  tableData: any[];
  tableConfig: any;
  selectedTable: string;
  renderCellContent: (value: any, key: string) => React.ReactNode;
}

const NavigationCardView: React.FC<NavigationCardViewProps> = ({
  tableData,
}) => {
  const theme = useTheme();
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
              "background-color var(--theme-transition-duration) cubic-bezier(0.4, 0, 0.2, 1)",
            border: `1px solid ${theme.palette.divider}`,

            backgroundColor: "background.paper",
            backdropFilter: "blur(10px)",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: theme.shadows[5],
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          {/* Small尺寸布局：图标 title 访问 详细 */}
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

              {/* 标题 */}
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
                  }}
                >
                  {row.title || "无标题"}
                </Typography>
              </Box>

              {/* 按钮组 */}
              <Box
                sx={{
                  display: "flex", // 修正居中方式（display: center 是错误写法）
                  justifyContent: "center", // 按钮组水平居中
                  alignItems: "center", // 按钮组垂直居中（可选）
                  gap: 0.2,
                }}
              >
                {/* 访问按钮 - 正方形小尺寸 + Icon 居中 */}
                <Button
                  variant="contained"
                  color="primary"
                  size="small" // 强制使用内置小尺寸（覆盖cardConfig）
                  startIcon={<OpenInNewIcon fontSize="small" />}
                  href={row.to_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    borderRadius: 1.5,
                    textTransform: "none",
                    fontWeight: 600,
                    // 核心：设置宽高相等（正方形）+ 小尺寸
                    width: 32, // 正方形宽度（可根据需求调整：28/32/36）
                    height: 32, // 正方形高度（和宽度一致）
                    padding: 0, // 清空默认内边距，避免Icon偏移
                    boxShadow: 1,
                    // 强制Icon居中（关键）
                    "& .MuiButton-startIcon": {
                      margin: 0, // 清空Icon默认的左右边距
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    },
                    // 隐藏文字（如果按钮只有Icon）
                    "& .MuiButton-label": {
                      justifyContent: "center", // 标签整体居中
                    },
                  }}
                ></Button>

                {/* 详细按钮 - 同样式保持统一 */}
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<VisibilityIcon fontSize="small" />}
                  sx={{
                    borderRadius: 1.5,
                    textTransform: "none",
                    fontWeight: 600,
                    // 正方形小尺寸
                    width: 32,
                    height: 32,
                    padding: 0,
                    borderWidth: 2,
                    // Icon居中
                    "& .MuiButton-startIcon": {
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    },
                    "& .MuiButton-label": {
                      justifyContent: "center",
                    },
                  }}
                ></Button>
              </Box>
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

                {/* Medium尺寸：按钮在标题旁边 */}
                {cardSize === "medium" && (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {/* 访问按钮 */}
                    <Button
                      variant="contained"
                      color="primary"
                      size={cardConfig.buttonSize}
                      startIcon={<OpenInNewIcon fontSize="small" />}
                      href={row.to_link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        borderRadius: 1.5,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize:
                          cardConfig.buttonSize === "small"
                            ? "0.8rem"
                            : "0.9rem",
                        py: cardConfig.buttonSize === "small" ? 1 : 1.25,
                        boxShadow: 1,
                        // Icon居中
                        "& .MuiButton-startIcon": {
                          margin: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        },
                        "& .MuiButton-label": {
                          justifyContent: "center",
                        },
                      }}
                    ></Button>

                    {/* 详细按钮 */}
                    <Button
                      variant="outlined"
                      color="primary"
                      size={cardConfig.buttonSize}
                      startIcon={<VisibilityIcon fontSize="small" />}
                      sx={{
                        borderRadius: 1.5,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize:
                          cardConfig.buttonSize === "small"
                            ? "0.8rem"
                            : "0.9rem",
                        py: cardConfig.buttonSize === "small" ? 1 : 1.25,
                        borderWidth: 2,
                        // Icon居中
                        "& .MuiButton-startIcon": {
                          margin: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        },
                        "& .MuiButton-label": {
                          justifyContent: "center",
                        },
                      }}
                    ></Button>
                  </Box>
                )}
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

              {/* Large尺寸：按钮在底部 */}
              {cardSize === "large" && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    justifyContent: "flex-start",
                    mt: "auto",
                    pt: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    transition:
                      "border-color var(--theme-transition-duration) ease",
                  }}
                >
                  {/* 访问按钮 */}
                  <Button
                    variant="contained"
                    color="primary"
                    size={cardConfig.buttonSize}
                    startIcon={<OpenInNewIcon fontSize="small" />}
                    href={row.to_link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      flex: 1,
                      borderRadius: 1.5,
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize:
                        cardConfig.buttonSize === "small" ? "0.8rem" : "0.9rem",
                      py: cardConfig.buttonSize === "small" ? 1 : 1.25,
                      boxShadow: 1,
                      transition:
                        "box-shadow 0.2s ease, transform 0.2s ease, background-color var(--theme-transition-duration) ease",
                      "&:hover": {
                        boxShadow: 3,
                        transform: "translateY(-1px)",
                        // Icon居中
                        "& .MuiButton-startIcon": {
                          margin: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        },
                        "& .MuiButton-label": {
                          justifyContent: "center",
                        },
                      },
                    }}
                  >
                    访问
                  </Button>

                  {/* 详细按钮 */}
                  <Button
                    variant="outlined"
                    color="primary"
                    size={cardConfig.buttonSize}
                    startIcon={<VisibilityIcon fontSize="small" />}
                    sx={{
                      borderRadius: 1.5,
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize:
                        cardConfig.buttonSize === "small" ? "0.8rem" : "0.9rem",
                      py: cardConfig.buttonSize === "small" ? 1 : 1.25,
                      borderWidth: 2,
                      transition:
                        "border-color var(--theme-transition-duration) ease, background-color var(--theme-transition-duration) ease, transform 0.2s ease",
                      "&:hover": {
                        borderWidth: 2,
                        backgroundColor: theme.palette.primary.main + "15",
                        transform: "translateY(-1px)",
                        // Icon居中
                        "& .MuiButton-startIcon": {
                          margin: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        },
                        "& .MuiButton-label": {
                          justifyContent: "center",
                        },
                      },
                    }}
                  >
                    详细
                  </Button>
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
