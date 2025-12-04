// 使用CommonJS模块语法，兼容Vercel Node.js运行时
const fetch = require("node-fetch");

module.exports = async function handler(req, res) {
  // 设置CORS头
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 处理OPTIONS请求
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // 同时支持带VITE_前缀和不带VITE_前缀的环境变量，以兼容本地开发和Vercel生产环境
    const apiBaseUrl =
      process.env.VITE_FILMTELEVISION_API_BASE_URL ||
      process.env.FILMTELEVISION_API_BASE_URL;
    const apiPath =
      process.env.VITE_FILMTELEVISION_API_PATH ||
      process.env.FILMTELEVISION_API_PATH;

    // 检查环境变量是否设置
    if (!apiBaseUrl || !apiPath) {
      console.error("Missing environment variables:", {
        VITE_FILMTELEVISION_API_BASE_URL:
          process.env.VITE_FILMTELEVISION_API_BASE_URL,
        FILMTELEVISION_API_BASE_URL: process.env.FILMTELEVISION_API_BASE_URL,
        VITE_FILMTELEVISION_API_PATH: process.env.VITE_FILMTELEVISION_API_PATH,
        FILMTELEVISION_API_PATH: process.env.FILMTELEVISION_API_PATH,
      });
      return res.status(500).json({ error: "Missing environment variables" });
    }

    // 从req.query获取path参数（Vercel动态路由会将[...path]解析为req.query.path）
    let path = req.query.path || "";
    if (Array.isArray(path)) {
      path = path.join("/");
    }

    // 构建查询字符串
    const queryString = req.url.split("?")[1] || "";

    // 构建完整的API URL
    const fullUrl = `${apiBaseUrl}${apiPath}${path ? `/${path}` : ""}${
      queryString ? `?${queryString}` : ""
    }`;

    console.log("Forwarding request to:", fullUrl);

    // 转发请求到目标API
    const response = await fetch(fullUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        // 可以添加其他必要的 headers
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    // 获取响应数据
    const data = await response.json();

    // 返回响应
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
