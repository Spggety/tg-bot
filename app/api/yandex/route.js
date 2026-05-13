export async function GET() {
  const res = await fetch(
    "https://api.scraperapi.com/?api_key=8a1ae09bba8bc87e55c9d15366e8ef69&url=https://passport.yandex.ru/pwl-yandex",
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "accept-language": "ru",
      },
      method: "GET",
    }
  );

  const html = await res.text();

  // 🔥 достаём CSRF
  const match = html.match(/window\.__CSRF__\s*=\s*"([^"]+)"/);

  if (!match) {
    return Response.json(
      { error: "CSRF not found" },
      { status: 500 }
    );
  }

  const csrf = match[1];


  const res = await fetch(
          "https://passport.yandex.ru/pwl-yandex/api/passport/suggest/check_availability",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-csrf-token": csrf,
            },
            body: JSON.stringify({ phone_number: `+79502514756` }),
          },
        );

        const data = await res.json();

  return data
}