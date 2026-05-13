export async function GET(req) {
  const url = "https://passport.yandex.ru/pwl-yandex";

  const res = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      "accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-language": "ru-RU,ru;q=0.9,en;q=0.8",
      "cache-control": "no-cache",
    },
  });

  const html = await res.text();

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}