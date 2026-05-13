export async function POST(req) {
  try {
    const body = await req.json();

    const msg =
      body?.message?.text ||
      body?.edited_message?.text ||
      body?.channel_post?.text ||
      body?.callback_query?.data ||
      body?.message?.caption;

    const chatId =
      body?.message?.chat?.id ||
      body?.edited_message?.chat?.id ||
      body?.channel_post?.chat?.id ||
      body?.callback_query?.message?.chat?.id;

    console.log("UPDATE:", JSON.stringify(body, null, 2));

    if (!chatId) {
      return Response.json({ ok: true });
    }

    // =========================
    // /start
    // =========================
    if (msg?.startsWith("/start")) {
      await sendMessage(chatId, "👋 Отправь текст или JSON с номерами");
      return Response.json({ ok: true });
    }

    if (!msg) {
      return Response.json({ ok: true });
    }

    let numbers = [];

    // =========================
    // JSON parse
    // =========================
    try {
      const json = JSON.parse(msg);

      numbers =
        json?.availableForAdd?.flatMap(
          (item) => item?.numbersInfo?.map((n) => n.number) || [],
        ) || [];
    } catch {
      // regex fallback
      const matches = msg.match(/\b\d{10,15}\b/g);
      if (matches) numbers = matches;
    }

    if (!numbers.length) {
      await sendMessage(chatId, "❌ Номера не найдены");
      return Response.json({ ok: true });
    }

    // =========================
    // CHECK FUNCTION (ВАШ API)
    // =========================

    let cachedCsrf = null;
    let csrfExpiresAt = 0;

    async function getCsrf() {
      const res = await fetch(
        "https://api.scraperapi.com/?api_key=8a1ae09bba8bc87e55c9d15366e8ef69&url=https://passport.yandex.ru/pwl-yandex",
        {
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "accept-language": "ru",
          },
          method: "GET",
        },
      );

      const html = await res.text();

      // 🔥 достаём CSRF
      const match = html.match(/window\.__CSRF__\s*=\s*"([^"]+)"/);

      if (!match) {
        return { error: "CSRF not found" }
      }

      const csrf = match[1];

      return Response.json(csrf);
    }
    const csrf = await getCsrf();
    async function checkNumber(number) {
      try {
        const res = await fetch(
          "https://passport.yandex.ru/pwl-yandex/api/passport/suggest/check_availability",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-csrf-token": csrf,
            },
            body: JSON.stringify({ phone_number: `+7${number}` }),
          },
        );

        const data = await res.json();

        return {
          number,
          status: res.status,
          ok: res.ok,
          response: data, // 👈 ПОЛНЫЙ ОТВЕТ
        };
      } catch (err) {
        return {
          number,
          status: 500,
          ok: false,
          response: {
            error: err.message,
          },
        };
      }
    }

    // =========================
    // parallel check
    // =========================
    const results = await Promise.all(numbers.map(checkNumber));

    const reply = results
      .map((r) => {
        return (
          `Т ${csrf}\n` +
          `📱 ${r.number}\n` +
          `📊 status: ${r.status}\n` +
          `✅ ok: ${r.ok}\n` +
          `📦 response:\n` +
          `${JSON.stringify(r.response, null, 2)}`
        );
      })
      .join("\n\n----------------\n\n");

    await sendMessage(chatId, reply);

    return Response.json({ ok: true });
  } catch (err) {
    console.error("ERROR:", err);
    return Response.json({ ok: false });
  }
}

// =========================
// helper
// =========================
async function sendMessage(chatId, text) {
  return fetch(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    },
  );
}
