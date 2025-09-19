import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// MCP bilgisi
const mcpMeta = {
  name: "coinglass-server",
  description: "CoinGlass verilerini ChatGPT'ye açan MCP sunucusu",
  version: "1.0.0"
};

// CoinGlass fiyatları
app.get("/mcp/tools/coinglass/market", async (req, res) => {
  try {
    const response = await fetch("https://open-api.coinglass.com/public/v2/spot_exchange_rate", {
      headers: {
        "accept": "application/json",
        "coinglassSecret": process.env.COINGLASS_API_KEY
      }
    });

    const data = await response.json();
    res.json({
      type: "mcp/tool-response",
      tool: "coinglass-market",
      data: data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ChatGPT için manifest
app.get("/mcp/manifest.json", (req, res) => {
  res.json(mcpMeta);
});

app.listen(PORT, () => {
  console.log(`✅ MCP sunucusu ${PORT} portunda çalışıyor`);
});
