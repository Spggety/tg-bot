export async function GET(req) {
  const target =
    "https://passport.yandex.ru/pwl-yandex";

  const res = await fetch(target, {
    headers: {
      "user-agent":
        req.headers.get("user-agent") || "",
    },
  });

  const html = await res.text();

  return new Response(html, {
    status: res.status,
    headers: {
      "content-type": "text/html",
    },
  });
}