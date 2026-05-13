export async function GET() {
  const res = await fetch("https://passport.yandex.ru/pwl-yandex", {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "ru",
      "cache-control": "max-age=0",
      priority: "u=0, i",
      "sec-ch-prefers-color-scheme": "light",
      "sec-ch-ua":
        '"Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
    },
    body: null,
    method: "GET",
  });
  const html = await res.text();

  return new Response(html, {
    status: res.status,
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}
