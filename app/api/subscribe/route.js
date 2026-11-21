import { NextResponse } from "next/server";

// Portfolio-wide email list (Supabase putdbipfchuocbjlacgy) via plain REST.
export async function POST(req) {
  const body = await req.json();
  const email = body?.email;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "A valid email is required" },
      { status: 400 }
    );
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    console.error("subscribe: missing SUPABASE_URL/SUPABASE_SERVICE_KEY env");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const res = await fetch(`${url}/rest/v1/email_subscribers?on_conflict=email`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({ email: email.trim().toLowerCase(), source: body?.source || "biblesays" }),
  });

  if (!res.ok && res.status !== 409) {
    console.error("subscribe: supabase insert failed", res.status);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }

  return NextResponse.json({});
}
