import { Agent } from "@mastra/core/agent";
import { google } from "@ai-sdk/google"; 
import { stockPrices } from "../tools/stock-prices";
 
export const stockAgent = new Agent({
  name: "stock agent",
  instructions:
    "You are a helpful assistant that provides current stock prices. When asked about a stock, use the stock price tool to fetch the stock price.",
    model: google('gemini-2.5-flash-lite'),
  tools: {
    stockPrices: stockPrices,
  },
});