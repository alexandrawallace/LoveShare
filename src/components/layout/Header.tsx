import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  toggleDarkMode,
  toggleMenu,
}) => {
  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: "background.paper",
        zIndex: 11,
        boxShadow: (theme) => theme.shadows[1],
        position: "sticky",
        top: 0,
      }}
    >
      {/* 左侧：系统名称 */}
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{
          fontWeight: 600,
          color: "primary.main",
        }}
      >
        {import.meta.env.VITE_SYSTEM_NAME || "LoveShare"}
      </Typography>

      {/* 右侧：菜单开关和暗黑模式切换 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* 菜单开关按钮 - 仅移动端显示 */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleMenu}
            edge="start"
            sx={{
              "&:hover": {
                backgroundColor: (theme) => theme.palette.action.hover,
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* 暗黑模式切换 - 太阳/月亮图标 */}
        <Tooltip title={isDarkMode ? "切换到浅色模式" : "切换到暗黑模式"}>
          <IconButton
            onClick={toggleDarkMode}
            color="inherit"
            sx={{
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.action.hover,
                transform: "scale(1.1)",
              },
            }}
          >
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Header;
