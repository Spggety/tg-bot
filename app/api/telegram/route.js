export async function POST(req) {
  const body = await req.json();

  const chatId = body?.message?.chat?.id;
  const text = body?.message?.text;

  if (!chatId) {
    return Response.json({ ok: true });
  }

  let reply = "❌ Отправь JSON";

  try {
    const json = JSON.parse(text);

    const numbers =
      json?.availableForAdd?.flatMap(item =>
        item?.numbersInfo?.map(n => n.number) || []
      ) || [];

    reply = numbers.length ? numbers.join("\n") : "Пусто";
  } catch (e) {
    reply = "❌ Неверный JSON";
  }

  await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: reply,
    }),
  });

  return Response.json({ ok: true });
}