import { createServer } from "@modelcontextprotocol/server-http";
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { fetch } from "undici";

const SERVER_NAME = "coinglass-mcp";
const SERVER_VERSION = "1.0.0";

// CoinGlass'tan fiyatları çeken tool
const coinglassMarketTool = {
  name: "coinglass-market",
  description: "CoinGlass spot fiyatlarını getirir.",
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  async invoke() {
    const apiKey = process.env.COINGLASS_API_KEY;
    if (!apiKey) {
      return { content: [{ type: "text", text: "COINGLASS_API_KEY yok" }] };
    }

    const resp = await fetch("https://open-api.coinglass.com/public/v2/spot_exchange_rate", {
      headers: {
        "accept": "application/json",
        "coinglassSecret": apiKey
      }
    });

    const data = await resp.json();
    return { content: [{ type: "json", json: data }] };
  }
};

// MCP server başlat
const port = process.env.PORT || 3000;
createServer(
  {
    name: SERVER_NAME,
    version: SERVER_VERSION,
    tools: [coinglassMarketTool]
  },
  { port: Number(port) }
).then(() => {
  console.log(`✅ MCP server ${port} portunda çalışıyor`);
});
