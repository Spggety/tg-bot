export async function GET() {
  const pageRes = await fetch(
    "https://api.scraperapi.com/?api_key=8a1ae09bba8bc87e55c9d15366e8ef69&url=https://passport.yandex.ru/pwl-yandex"
  );

  const html = await pageRes.text();

  const match = html.match(/window\.__CSRF__\s*=\s*"([^"]+)"/);

  if (!match) {
    return Response.json(
      { error: "CSRF not found" },
      { status: 500 }
    );
  }

  const csrf = match[1];

  const apiRes = await fetch(
    "https://passport.yandex.ru/pwl-yandex/api/passport/suggest/check_availability",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrf,
      },
      body: JSON.stringify({ phone_number: "+79502514756" }),
    }
  );

  const data = await apiRes.json();

  return Response.json(data);
}