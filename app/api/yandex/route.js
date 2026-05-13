import { chromium } from "playwright";
import chromiumPkg from "@sparticuz/chromium-min";

export const runtime = "nodejs";

export async function GET() {
  let browser;

  try {
    browser = await chromium.launch({
      args: [
        ...chromiumPkg.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
      executablePath: await chromiumPkg.executablePath(),
      headless: chromiumPkg.headless,
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
    if (browser) await browser.close().catch(() => {});
  }
}