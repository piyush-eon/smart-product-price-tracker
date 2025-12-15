import FirecrawlApp from "@mendable/firecrawl-js";

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export async function scrapeProduct(url) {
  try {
    const result = await firecrawl.scrape(url, {
      formats: [
        {
          type: "json",
          schema: {
            type: "object",
            properties: {
              productName: { type: "string" },
              currentPrice: {
                type: ["number", "string", "null"],
              },
              currencyCode: {
                type: ["string", "null"],
              },
              productImageUrl: {
                type: ["string", "null"],
              },
            },
            required: ["productName"],
          },
          prompt: `
            Extract:
            - product name as "productName"
            - product price as "currentPrice"
            - currency code as "currencyCode"
            - product image URL as "productImageUrl"

            If price is not visible, return null for currentPrice.
          `,
        },
      ],
    });

    console.log("RAW FIRECRAWL RESULT:", result);

    // Firecrawl returns JSON data here
    const extractedData = result?.json;

    if (!extractedData?.productName) {
      throw new Error("No product data extracted");
    }

    return extractedData;
  } catch (error) {
    console.error("Firecrawl scrape error:", error);
    throw error;
  }
}
