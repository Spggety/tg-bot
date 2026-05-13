export async function GET() {
  const API_KEY = "8a1ae09bba8bc87e55c9d15366e8ef69";
  const session = "1"; // важно: фиксируем сессию

  // 1. Получаем HTML + cookies в ОДНОЙ сессии
  const pageRes = await fetch(
    `https://api.scraperapi.com/?api_key=${API_KEY}&url=${encodeURIComponent(
      "https://passport.yandex.ru/pwl-yandex/auth/add"
    )}&device_type=mobile&render=false&session_number=${session}`,
    {
      method: "GET",
    }
  );

  const html = await pageRes.text();

  // cookies из ответа ScraperAPI
  const setCookie = pageRes.headers.get("set-cookie") || "";

  // 2. Достаём CSRF
  const match = html.match(/window\.__CSRF__\s*=\s*"([^"]+)"/);

  if (!match) {
    return Response.json(
      { error: "CSRF not found" },
      { status: 500 }
    );
  }

  const csrf = match[1].csfr;

//   // 3. Делаем API запрос в ТОЙ ЖЕ сессии
//   const apiRes = await fetch(
//     `https://api.scraperapi.com/?api_key=${API_KEY}&url=${encodeURIComponent(
//       "https://passport.yandex.ru/pwl-yandex/api/passport/suggest/check_availability"
//     )}&session_number=${session}`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "x-csrf-token": csrf,
//         Cookie: setCookie, // 🔥 ключевой момент
//       },
//       body: JSON.stringify({
//         phone_number: "+79502514756",
//       }),
//     }
//   );

//   const data = await apiRes.text();

  return Response.json({
    csrf,
    // data: JSON.parse(data),
  });
}