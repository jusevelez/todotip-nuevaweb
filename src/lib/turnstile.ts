import { TURNSTILE_CONTACT_ACTION } from "@/lib/turnstile-public";

type SiteverifyResult = {
  success?: unknown;
  action?: unknown;
  hostname?: unknown;
};

function expectedHostnames(): Set<string> {
  return new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean),
  );
}

/**
 * Canonical siteverify. Call only from the server.
 * Returns false on any failure; does not throw and does not log secrets.
 */
export async function verifyTurnstileToken(
  token: unknown,
  clientIp: string | undefined,
): Promise<boolean> {
  const expectedAction = TURNSTILE_CONTACT_ACTION;
  const secret = process.env.TURNSTILE_SECRET;
  const hostnames = expectedHostnames();

  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > 2048 ||
    hostnames.size === 0 ||
    typeof secret !== "string" ||
    secret.length === 0
  ) {
    return false;
  }

  let result: SiteverifyResult;
  try {
    const body = new URLSearchParams({
      secret,
      response: token,
    });
    if (clientIp) body.set("remoteip", clientIp);

    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(10_000),
      body,
    });
    if (!r.ok) throw new Error("siteverify failed");
    result = (await r.json()) as SiteverifyResult;
  } catch {
    return false;
  }

  return (
    result.success === true &&
    result.action === expectedAction &&
    typeof result.hostname === "string" &&
    hostnames.has(result.hostname)
  );
}
