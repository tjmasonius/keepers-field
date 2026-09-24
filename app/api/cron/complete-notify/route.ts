import {NextRequest, NextResponse} from "next/server";
import {createAdminClient} from "@/lib/supabase/admin";
import {listPendingCompleteNotifies, notifyVisitComplete} from "@/lib/complete-notify";

export const runtime = "nodejs";
export const maxDuration = 120;
export const dynamic = "force-dynamic";

function authorized(req: NextRequest): boolean {
  const secret = (process.env.CRON_SECRET || "").trim();
  if (!secret) return false;
  const auth = (req.headers.get("authorization") || "").trim();
  if (auth === `Bearer ${secret}`) return true;
  const header = (req.headers.get("x-cron-secret") || "").trim();
  return header === secret;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ok: false, error: "unauthorized"}, {status: 401});
  }
  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ok: false, error: "missing service role"}, {status: 500});
  }

  const pending = await listPendingCompleteNotifies(admin, {limit: 8});
  const results: {submissionId: string; posted: boolean; skipped: boolean; error?: string}[] = [];

  for (const submissionId of pending) {
    try {
      const result = await notifyVisitComplete({supabase: admin, submissionId});
      results.push({
        submissionId,
        posted: result.posted,
        skipped: result.skipped,
        error: result.error,
      });
    } catch (err) {
      results.push({
        submissionId,
        posted: false,
        skipped: false,
        error: err instanceof Error ? err.message : "notify failed",
      });
    }
  }

  return NextResponse.json({
    ok: true,
    checked: pending.length,
    posted: results.filter((r) => r.posted).length,
    results,
  });
}

export async function POST(req: NextRequest) {
  return GET(req);
}
