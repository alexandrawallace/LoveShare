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
          avatarSize: 48,
          titleFontSize: "1.1rem",
          abstractLines: 2,
          abstractFontSize: "0.9rem",
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
          xs: "1fr",
          sm: `repeat(auto-fill, minmax(${cardConfig.gridColumnMinWidth}, 1fr))`,
          md: `repeat(auto-fill, minmax(${cardConfig.gridColumnMinWidth}, 1fr))`,
        },
        gap: 3,
        justifyContent: "center",
        padding: 2,
      }}
    >
      {tableData.map((row, index) => (
        <Paper
          key={row.id || index}
          sx={{
            p: cardConfig.padding,
            height: "100%",
            display: "flex",
            flexDirection: "column",
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
          {/* 顶部：图标 + 标题 + 分类 */}
          <Box
            sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}
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

          {/* 摘要内容 */}
          <Box sx={{ mb: 3, flex: 1 }}>
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

          {/* 底部按钮 */}
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              justifyContent: "flex-start",
              mt: "auto",
              pt: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              transition: "border-color var(--theme-transition-duration) ease",
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
                },
              }}
            >
              详细
            </Button>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default NavigationCardView;
