export async function GET() {
  const res = await fetch(
    "https://passport.yandex.ru/pwl-yandex/auth/add?...",
    {
      redirect: "manual",
      headers: {
        cookie: "...",
        referer: "https://passport.yandex.ru/",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/148 Safari/537.36",
      },
    }
  );

  return Response.json({
    status: res.status,
    headers: Object.fromEntries(res.headers),
    text: await res.text(),
  });
}