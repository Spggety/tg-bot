export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  const proxyUrl = "http://modeler_3xguEX:IUQRZfWzUyPv@192.121.87.135:13438";
  try {
    const res = await fetch("https://api.scraperapi.com/?api_key=8a1ae09bba8bc87e55c9d15366e8ef69&url=https://passport.yandex.ru/pwl-yandex", {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const html = await res.text();

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    });

  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500 }
    );

  } finally {
    clearTimeout(timeout);
  }
}