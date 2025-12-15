import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuthContext } from "../../contexts/AuthContext";

interface TableViewProps {
  tableData: any[];
  tableConfig: any;
  selectedTable: string;
  renderCellContent: (value: any, key: string) => React.ReactNode;
  onEdit?: (data: any) => void;
  onDelete?: (data: any) => void;
}

const TableView: React.FC<TableViewProps> = ({
  tableData,
  tableConfig,
  selectedTable,
  renderCellContent,
  onEdit,
  onDelete,
}) => {
  const { isAuthenticated } = useAuthContext();

  // 获取可见列
  const visibleColumns = Object.entries(
    tableConfig[selectedTable] || {}
  ).filter(
    ([key]) =>
      !import.meta.env.VITE_SUPABASE_TABLE_NOT_SHOW_COL.split(",")
        .map((s: string) => s.trim())
        .includes(key)
  );

  return (
    <TableContainer
      component={Paper}
      sx={{
        overflowX: "auto",
        borderRadius: 2,
        boxShadow: 2,
        "&:hover": {
          boxShadow: 3,
        },
        transition:
          "box-shadow var(--theme-transition-duration) ease, background-color var(--theme-transition-duration) ease",
      }}
    >
      <Table
        sx={{
          minWidth: "100%",
          tableLayout: "fixed",
        }}
        aria-label="data table"
      >
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "background.default",
              "& th": {
                borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
                transition:
                  "border-color var(--theme-transition-duration) ease, backgroundColor var(--theme-transition-duration) ease",
              },
              transition:
                "background-color var(--theme-transition-duration) ease",
            }}
          >
            {visibleColumns.map(([key, value]) => (
              <TableCell
                key={key}
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  minWidth: {
                    xs: "80px",
                    md: "100px",
                  },
                  maxWidth: {
                    xs: "200px",
                    md: "300px",
                  },
                  fontWeight: 600,
                  fontSize: {
                    xs: "0.8rem",
                    md: "0.9rem",
                  },
                  color: "text.primary",
                  padding: {
                    xs: "8px 12px",
                    md: "12px 16px",
                  },
                  backgroundColor: "background.paper",
                }}
              >
                {String(value)}
              </TableCell>
            ))}
            {isAuthenticated && (
              <TableCell
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  minWidth: "120px",
                  maxWidth: "120px",
                  fontWeight: 600,
                  fontSize: {
                    xs: "0.8rem",
                    md: "0.9rem",
                  },
                  color: "text.primary",
                  padding: {
                    xs: "8px 12px",
                    md: "12px 16px",
                  },
                  backgroundColor: "background.paper",
                  textAlign: "center",
                }}
              >
                操作
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow
              key={index}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.action.hover,
                },
                transition:
                  "background-color var(--theme-transition-duration) ease, border-color var(--theme-transition-duration) ease",
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              {visibleColumns.map(([key]) => (
                <TableCell
                  key={key}
                  component="th"
                  scope="row"
                  sx={{
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    minWidth: {
                      xs: "80px",
                      md: "100px",
                    },
                    maxWidth: {
                      xs: "200px",
                      md: "300px",
                    },
                    padding: {
                      xs: "8px 12px",
                      md: "12px 16px",
                    },
                    fontSize: {
                      xs: "0.8rem",
                      md: "0.9rem",
                    },
                    verticalAlign: "top",
                  }}
                >
                  {renderCellContent(row[key], key)}
                </TableCell>
              ))}
              {isAuthenticated && (
                <TableCell
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minWidth: "120px",
                    maxWidth: "120px",
                    padding: {
                      xs: "8px 12px",
                      md: "12px 16px",
                    },
                    fontSize: {
                      xs: "0.8rem",
                      md: "0.9rem",
                    },
                    verticalAlign: "middle",
                    textAlign: "center",
                  }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    {onEdit && (
                      <Tooltip title="编辑">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit(row)}
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
                          onClick={() => onDelete(row)}
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
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableView;
