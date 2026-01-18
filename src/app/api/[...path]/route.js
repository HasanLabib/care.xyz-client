const BACKEND = "https://server-psi-lake-59.vercel.app";

async function proxy(req, { params }) {
  const url = new URL(req.url);
  const path = (params.path || []).join("/");
  const target = `${BACKEND}/${path}${url.search}`;

  const headers = new Headers();
  req.headers.forEach((v, k) => {
    if (k.toLowerCase() === "host") return;
    headers.set(k, v);
  });
  const cookie = req.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);

  const body =
    req.method === "GET" || req.method === "HEAD" ? undefined : await req.text();

  const res = await fetch(target, {
    method: req.method,
    headers,
    body,
    redirect: "manual",
  });

  const outHeaders = new Headers();
  res.headers.forEach((v, k) => {
    if (k.toLowerCase() === "content-encoding") return;
    if (k.toLowerCase() === "transfer-encoding") return;
    outHeaders.set(k, v);
  });

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) outHeaders.set("set-cookie", setCookie);

  return new Response(res.body, { status: res.status, headers: outHeaders });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;

