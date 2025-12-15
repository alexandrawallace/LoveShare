import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton as MuiIconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import GitHubIcon from "@mui/icons-material/GitHub";
import SettingsIcon from "@mui/icons-material/Settings";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useAuthContext } from "../../contexts/AuthContext";

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
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, secretKey, authenticate, logout } = useAuthContext();

  const handleOpen = () => {
    setOpen(true);
    setError("");
  };

  const handleClose = () => {
    setOpen(false);
    setKey("");
    setError("");
  };

  const handleSubmit = async () => {
    if (!key.trim()) {
      setError("请输入密钥");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const success = await authenticate(key);
      if (success) {
        handleClose();
      } else {
        setError("密钥错误，请重新输入");
      }
    } catch (err) {
      setError("认证失败，请检查网络连接或密钥");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

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

        {/* GitHub链接 */}
        <Tooltip title="GitHub仓库">
          <IconButton
            href="https://github.com/GalokPeng/LoveShare"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            sx={{
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.action.hover,
                transform: "scale(1.1)",
              },
            }}
          >
            <GitHubIcon />
          </IconButton>
        </Tooltip>

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

        {/* 设置按钮 */}
        <Tooltip title={isAuthenticated ? "管理认证" : "设置"}>
          <IconButton
            onClick={handleOpen}
            color="inherit"
            sx={{
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.action.hover,
                transform: "scale(1.1)",
              },
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* 认证弹窗 */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {isAuthenticated ? (
            <>
              <LockOpenIcon color="success" />
              <Typography variant="h6">已认证</Typography>
            </>
          ) : (
            <>
              <LockIcon color="error" />
              <Typography variant="h6">Supabase 认证</Typography>
            </>
          )}
        </DialogTitle>
        <DialogContent>
          {isAuthenticated ? (
            <Box sx={{ py: 2 }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                您已成功认证，可以进行数据管理操作。
              </Alert>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                当前使用的密钥：{secretKey?.substring(0, 10)}...
              </Typography>
            </Box>
          ) : (
            <Box sx={{ py: 2 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <TextField
                autoFocus
                margin="dense"
                label="Secret Key"
                type="password"
                fullWidth
                variant="outlined"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="输入 Supabase Secret Key"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <MuiIconButton
                        aria-label="toggle password visibility"
                        disabled
                      >
                        <LockIcon />
                      </MuiIconButton>
                    </InputAdornment>
                  ),
                }}
                disabled={loading}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {isAuthenticated ? (
            <>
              <Button onClick={handleClose} variant="outlined">
                关闭
              </Button>
              <Button onClick={handleLogout} variant="contained" color="error">
                退出认证
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleClose}
                variant="outlined"
                disabled={loading}
              >
                取消
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={loading || !key.trim()}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? "验证中..." : "确认"}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Header;
