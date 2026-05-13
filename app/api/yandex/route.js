import { chromium } from "playwright-core";
import chromiumPkg from "@sparticuz/chromium";

export async function GET() {
  const browser = await chromium.launch({
    args: chromiumPkg.args,
    executablePath: await chromiumPkg.executablePath(),
    headless: chromiumPkg.headless,
  });

  const page = await browser.newPage();

  await page.goto("https://passport.yandex.ru/pwl-yandex", {
    waitUntil: "networkidle",
  });

  const html = await page.content();

  await browser.close();

  return new Response(html, {
    headers: { "content-type": "text/html" },
  });
}