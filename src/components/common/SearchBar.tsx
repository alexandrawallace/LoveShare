import React, { useState, useCallback, useRef } from "react";
import { TextField, IconButton, InputAdornment, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  debounceDelay?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "搜索...",
  debounceDelay = 300,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debounceTimeoutRef = useRef<number | null>(null);

  // 防抖处理搜索输入变化
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);

      // 清除之前的防抖定时器
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // 设置新的防抖定时器
      debounceTimeoutRef.current = setTimeout(() => {
        onSearch(value);
      }, debounceDelay);
    },
    [onSearch, debounceDelay]
  );

  // 清除搜索
  const handleClear = useCallback(() => {
    setSearchTerm("");
    // 清除防抖定时器
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    onSearch("");
  }, [onSearch]);

  // 组件卸载时清除定时器
  React.useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Paper
      sx={{
        p: 1,
        borderRadius: 2,
        boxShadow: 1,
        backgroundColor: "background.paper",
        transition:
          "background-color var(--theme-transition-duration) ease, box-shadow var(--theme-transition-duration) ease",
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "text.secondary" }} />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={handleClear}
                edge="end"
                size="small"
              >
                <ClearIcon sx={{ color: "text.secondary" }} />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            borderRadius: 1.5,
            backgroundColor: "background.paper",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: (theme) => theme.palette.divider,
              transition: "border-color var(--theme-transition-duration) ease",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: (theme) => theme.palette.action.hover,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
            },
            transition:
              "background-color var(--theme-transition-duration) ease",
          },
        }}
        sx={{
          "& .MuiInputBase-input": {
            fontSize: "0.95rem",
            py: 1.25,
            px: 1,
          },
        }}
      />
    </Paper>
  );
};

export default SearchBar;
