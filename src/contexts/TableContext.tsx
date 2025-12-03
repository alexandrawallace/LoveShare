import React, { createContext, useContext, useState } from "react";

// 创建上下文，用于在组件树中共享选中的表名和分类
interface TableContextType {
  selectedTable: string;
  setSelectedTable: (tableName: string, category?: string | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

// 自定义 Hook，方便子组件使用上下文
export const useTableContext = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
};

interface TableProviderProps {
  children: React.ReactNode;
}

export const TableProvider: React.FC<TableProviderProps> = ({ children }) => {
  // 选中的表名，默认为 home 作为主页
  const [selectedTable, setSelectedTable] = useState<string>("home");
  // 选中的分类，默认为 null
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 处理表选择
  const handleTableSelect = (
    tableName: string,
    category: string | null = null
  ) => {
    setSelectedTable(tableName);
    setSelectedCategory(category);
    // 不再在这里关闭菜单，由Sidebar组件根据设备类型决定是否关闭
  };

  return (
    <TableContext.Provider
      value={{
        selectedTable,
        setSelectedTable: handleTableSelect,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
