export async function POST(req) {
  try {
    const body = await req.json();

    const msg =
      body?.message?.text ||
      body?.edited_message?.text ||
      body?.channel_post?.text;

    const chatId =
      body?.message?.chat?.id ||
      body?.edited_message?.chat?.id ||
      body?.channel_post?.chat?.id;

    if (!chatId || !msg) {
      return Response.json({ ok: true });
    }

    let reply = "❌ Неверный JSON";

    try {
      const json = JSON.parse(msg);

      const numbers =
        json?.availableForAdd?.flatMap(item =>
          item?.numbersInfo?.map(n => n.number) || []
        ) || [];

      reply = numbers.length ? numbers.join("\n") : "Пусто";
    } catch {}

    await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply,
      }),
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: true });
  }
}