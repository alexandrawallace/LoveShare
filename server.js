import express from "express";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

// 加载环境变量
dotenv.config({
  path: [".env.local", ".env", ".env.development", ".env.production"],
});

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.static(join(__dirname, "dist")));

// 从请求头获取Secret Key的辅助函数
const getSecretKeyFromHeader = (req) => {
  return (
    req.headers["x-supabase-secret-key"] ||
    req.headers["authorization"]?.replace("Bearer ", "")
  );
};

// 验证Supabase Secret Key的API端点
app.post("/api/auth/verify", async (req, res) => {
  try {
    // 从请求体获取Secret Key
    const { secretKey } = req.body;

    if (!secretKey) {
      return res.status(400).json({
        error: "Secret Key不能为空",
      });
    }

    // 检查是否使用了匿名密钥，匿名密钥不能用于管理后台
    if (
      secretKey === process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      secretKey === process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY
    ) {
      return res.status(401).json({
        error: "匿名密钥不能用于管理后台",
      });
    }

    // 尝试使用提供的Secret Key创建Supabase客户端并连接到数据库
    const supabaseUrl =
      process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    if (!supabaseUrl) {
      return res.status(500).json({ error: "Missing Supabase URL" });
    }

    const supabase = createClient(supabaseUrl, secretKey);

    // 尝试执行一个简单的查询来验证连接
    const { error } = await supabase
      .from("navigation")
      .select("id")
      .limit(1)
      .single();

    if (error) {
      // 如果查询失败，说明Secret Key无效
      return res.status(401).json({
        error: "无效的Supabase Secret Key",
      });
    }

    // 如果查询成功，说明Secret Key有效
    return res.status(200).json({
      success: true,
      message: "Secret Key验证成功",
    });
  } catch (error) {
    // 返回详细的错误信息，便于调试
    console.error("验证Secret Key失败:", error);
    return res.status(500).json({
      error: "验证Secret Key失败",
      details: error.message,
    });
  }
});

// 数据操作的API端点
app.all("/api/data/:table", async (req, res) => {
  console.log(
    `Received ${req.method} request to /api/data/${req.params.table}`
  );
  console.log("Request headers:", req.headers);
  console.log("Request body:", req.body);

  try {
    // 从URL参数获取table参数
    const tableName = req.params.table;
    console.log("Table name:", tableName);

    // 从请求头获取Secret Key
    const secretKey = getSecretKeyFromHeader(req);
    console.log("Secret key from header:", secretKey ? "******" : "Missing");

    if (!secretKey) {
      console.error("Missing Secret Key");
      return res.status(401).json({ error: "Missing Secret Key" });
    }

    // 检查是否使用了匿名密钥，匿名密钥不能用于管理后台
    if (
      secretKey === process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      secretKey === process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY
    ) {
      console.error("Anonymous key used for management");
      return res.status(401).json({ error: "匿名密钥不能用于管理后台" });
    }

    // 创建Supabase客户端
    const supabaseUrl =
      process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    console.log("Supabase URL:", supabaseUrl);

    if (!supabaseUrl) {
      console.error("Missing Supabase URL");
      return res.status(500).json({ error: "Missing Supabase URL" });
    }

    console.log("Creating Supabase client...");
    const supabase = createClient(supabaseUrl, secretKey);
    console.log("Supabase client created successfully");

    // 处理GET请求 - 获取数据
    if (req.method === "GET") {
      console.log("Handling GET request");
      // 从查询参数获取id（可选）
      const id = req.query.id;
      console.log("GET request id:", id);

      let query = supabase.from(tableName).select("*");

      if (id) {
        query = query.eq("id", id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("GET request error:", error);
        throw error;
      }

      console.log("GET request success:", data);
      return res.status(200).json(data);
    }

    // 处理POST请求 - 添加数据
    if (req.method === "POST") {
      console.log("Handling POST request");
      let data = req.body;
      
      if (!data || typeof data !== "object") {
        console.error("Invalid POST data:", data);
        return res.status(400).json({ error: "Invalid data" });
      }
      
      // 过滤掉空值字段，只提交有值的字段
      const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});
      
      console.log("Filtered POST data:", filteredData);
      
      const { data: insertedData, error } = await supabase
        .from(tableName)
        .insert([filteredData]);
      
      if (error) {
        console.error("POST request error:", error);
        throw error;
      }
      
      console.log("POST request success:", insertedData);
      return res.status(201).json(insertedData ? insertedData[0] : { success: true });
    }

    // 处理PUT请求 - 更新数据
    if (req.method === "PUT") {
      console.log("Handling PUT request");
      const { id, ...data } = req.body;
      console.log("PUT request id:", id);
      console.log("PUT request data:", data);

      if (!id) {
        console.error("Missing id for PUT request");
        return res.status(400).json({ error: "Missing id" });
      }

      if (!data || typeof data !== "object") {
        console.error("Invalid PUT data:", data);
        return res.status(400).json({ error: "Invalid data" });
      }

      const { data: updatedData, error } = await supabase
        .from(tableName)
        .update(data)
        .eq("id", id)
        .select();

      if (error) {
        console.error("PUT request error:", error);
        throw error;
      }

      console.log("PUT request success:", updatedData[0]);
      return res.status(200).json(updatedData[0]);
    }

    // 处理DELETE请求 - 删除数据
    if (req.method === "DELETE") {
      console.log("Handling DELETE request");
      const { id } = req.body;
      console.log("DELETE request id:", id);

      if (!id) {
        console.error("Missing id for DELETE request");
        return res.status(400).json({ error: "Missing id" });
      }

      const { error } = await supabase.from(tableName).delete().eq("id", id);

      if (error) {
        console.error("DELETE request error:", error);
        throw error;
      }

      console.log("DELETE request success");
      return res.status(200).json({ success: true });
    }

    // 如果请求方法不支持
    console.error("Method Not Allowed:", req.method);
    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("数据操作失败:", error);
    return res.status(500).json({
      error: "操作失败",
      details: error.message,
      stack: error.stack,
    });
  }
});

// 所有其他请求都返回index.html
app.use((req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints are available at http://localhost:${PORT}/api`);
});
