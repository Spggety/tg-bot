import { chromium } from "playwright-core";
import chromium from "@sparticuz/chromium-min";

export async function GET() {
  let browser = null;

  try {
    browser = await chromium.launch({
      args: chromium.args,
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
    return new Response(
      JSON.stringify({
        error: e.message,
      }),
      { status: 500 }
    );

  } finally {
    if (browser) await browser.close();
  }
}