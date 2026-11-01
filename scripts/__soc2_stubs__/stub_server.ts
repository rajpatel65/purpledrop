// Minimal stand-in for https://deno.land/std@0.168.0/http/server.ts
// Collects function handlers into HANDLERS in import order.
export const HANDLERS: Array<(req: Request) => Promise<Response>> = [];

export function serve(handler: (req: Request) => Promise<Response>) {
  HANDLERS.push(handler);
}
