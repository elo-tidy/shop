export function jsonResponse(
  data: unknown,
  headers: HeadersInit,
  status = 200,
) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

export function errorResponse(
  message: string,
  headers: HeadersInit,
  status = 400,
) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}
