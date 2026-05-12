import { extractNumbers } from "@/lib/parseNumbers";

export async function POST(req) {
  const body = await req.json();

  const message = body?.message?.text;
  const chatId = body?.message?.chat?.id;

  if (!message) {
    return Response.json({ ok: true });
  }

  let reply = "❌ Неверный формат";

  try {
    const json = JSON.parse(message);

    const numbers =
      json?.availableForAdd?.flatMap(item =>
        item?.numbersInfo?.map(n => n.number) || []
      ) || [];

    reply = numbers.length ? numbers.join("\n") : "Пусто";
  } catch (e) {
    reply = "❌ Отправь корректный JSON";
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