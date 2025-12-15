import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuthContext } from "../../contexts/AuthContext";

interface DataEditorProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedTable: string;
  initialData?: any;
}

const DataEditor: React.FC<DataEditorProps> = ({
  open,
  onClose,
  onSuccess,
  selectedTable,
  initialData,
}) => {
  const { secretKey } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<any>({});
  const [tableConfig, setTableConfig] = useState<any>({});

  // 从环境变量获取表格配置
  useEffect(() => {
    if (selectedTable) {
      const tableDic = JSON.parse(
        import.meta.env.VITE_SUPABASE_TABLE_DIC || "{}"
      );
      setTableConfig(tableDic[selectedTable] || {});
    }
  }, [selectedTable]);

  // 初始化表单数据
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // 清空表单
      const emptyData: any = {};
      Object.keys(tableConfig).forEach((key) => {
        if (key !== "show_name") {
          emptyData[key] = "";
        }
      });
      setFormData(emptyData);
    }
  }, [initialData, tableConfig]);

  // 处理表单字段变化
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // 提交表单
  const handleSubmit = async () => {
    if (!secretKey) {
      setError("认证信息丢失，请重新登录");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let url = `/api/data/${selectedTable}`;
      let method = initialData ? "PUT" : "POST";
      let body = initialData ? { ...formData, id: initialData.id } : formData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-supabase-secret-key": secretKey,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.details || "操作失败");
      }

      // 成功，关闭弹窗并触发刷新
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "操作失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // 取消操作
  const handleCancel = () => {
    onClose();
    // 清空表单数据，准备下一次打开
    setFormData({});
    setError("");
  };

  // 过滤掉show_name字段，只显示需要编辑的字段
  const editableFields = Object.entries(tableConfig).filter(
    ([key]) => key !== "show_name"
  );

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
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
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: (theme) => theme.palette.primary.main,
          color: "white",
          fontWeight: 600,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {initialData ? "编辑数据" : "添加数据"}
        </Typography>
        <IconButton
          onClick={handleCancel}
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {loading && initialData && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        )}
        {!loading && (
          <Box sx={{ py: 2 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                },
                gap: 3,
              }}
            >
              {editableFields.map(([key, label]: [string, any]) => (
                <Box key={key}>
                  <TextField
                    fullWidth
                    label={label}
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
                    variant="outlined"
                    multiline={key === "article" || key === "abstract"}
                    rows={key === "article" ? 6 : 2}
                    sx={{
                      mb: 2,
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCancel} variant="outlined" disabled={loading}>
          取消
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "处理中..." : initialData ? "保存" : "添加"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DataEditor;
