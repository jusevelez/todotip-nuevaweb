import type { NextRequest } from "next/server";
import { PREVIEW_ROBOTS } from "@/lib/site-env";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const dynamic = "force-dynamic";

function clientIp(request: NextRequest): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  return realIp || undefined;
}

const NOINDEX = { "X-Robots-Tag": PREVIEW_ROBOTS };

function forbidden() {
  return new Response("forbidden", { status: 403, headers: NOINDEX });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  if (!formData) return forbidden();

  const token = formData.get("cf-turnstile-response");
  const verified = await verifyTurnstileToken(token, clientIp(request));
  if (!verified) return forbidden();

  // Existing handler: accept the POST. No mail/CRM (out of Spin scope).
  return Response.json(
    {
      ok: true,
      message: "Recibimos tu solicitud.",
    },
    { headers: NOINDEX },
  );
}
