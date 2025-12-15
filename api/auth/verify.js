// /api/auth/verify.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-supabase-secret-key"
  );

  // 处理OPTIONS请求
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // 从请求体获取Secret Key
    const { secretKey } = req.body;

    if (!secretKey) {
      return res.status(400).json({ error: "Secret Key不能为空" });
    }

    // 检查是否使用了匿名密钥，匿名密钥不能用于管理后台
    if (
      secretKey === process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      secretKey === process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY
    ) {
      return res.status(401).json({ error: "匿名密钥不能用于管理后台" });
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
      return res.status(401).json({ error: "无效的Supabase Secret Key" });
    }

    // 如果查询成功，说明Secret Key有效
    return res
      .status(200)
      .json({ success: true, message: "Secret Key验证成功" });
  } catch (error) {
    // 返回详细的错误信息，便于调试
    console.error("验证Secret Key失败:", error);
    return res.status(500).json({
      error: "验证Secret Key失败",
      details: error.message,
    });
  }
}
