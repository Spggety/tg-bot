import { chromium as playwrightChromium } from "playwright-core";
import chromium from "@sparticuz/chromium";

export const runtime = "nodejs";

export async function GET() {
  let browser;

  try {
    browser = await playwrightChromium.launch({
      args: [
        ...chromium.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.goto("https://example.com", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    const html = await page.content();

    return new Response(html, {
      headers: { "content-type": "text/html" },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
    });

  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}