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

    console.log("UPDATE RECEIVED:", JSON.stringify(body, null, 2));
    console.log("MSG:", msg);
    console.log("CHAT:", chatId);

    if (!chatId) {
      return Response.json({ ok: true });
    }

    // =========================
    // 🔹 /START обработка
    // =========================
    if (msg === "/start") {
      await fetch(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "👋 Привет! Отправь текст или JSON — я вытащу номера.",
          }),
        }
      );

      return Response.json({ ok: true });
    }

    if (!msg) {
      return Response.json({ ok: true });
    }

    let numbers = [];

    // =========================
    // 1️⃣ ПЫТАЕМСЯ JSON
    // =========================
    try {
      const json = JSON.parse(msg);

      numbers =
        json?.availableForAdd?.flatMap(
          (item) => item?.numbersInfo?.map((n) => n.number) || []
        ) || [];
    } catch {
      // =========================
      // 2️⃣ FALLBACK REGEX
      // =========================
      const matches = msg.match(/\b\d{10,15}\b/g);
      if (matches) numbers = matches;
    }

    const reply =
      numbers.length > 0 ? numbers.join("\n") : "❌ Номера не найдены";

    await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: reply,
        }),
      }
    );

    return Response.json({ ok: true });
  } catch (err) {
    console.error("ERROR:", err);
    return Response.json({ ok: false });
  }
}