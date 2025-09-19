import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function isEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(str).toLowerCase());
}

export async function POST(req) {
  const supabase = createRouteHandlerClient({ cookies });
  const { identifier, password, email } = await req.json();

  const account = (identifier || email || "").trim();
  if (!account || !password) {
    return NextResponse.json(
      { error: "Vui lòng nhập đủ thông tin" },
      { status: 400 }
    );
  }

  let emailToLogin = null;

  if (isEmail(account)) {
    emailToLogin = account.toLowerCase();
  } else {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
      return NextResponse.json(
        { error: "Server xảy ra lỗi, vui lòng quay lại sau" },
        { status: 500 }
      );
    }
    const supabaseAdmin = createClient(url, serviceKey);

    const { data, error } = await supabaseAdmin
      .from("users")
      .select("email, blocked")
      .eq("nick_name", account)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json(
        { error: "Không tìm thấy user với nick_name này" },
        { status: 404 }
      );
    }
    if (Number(data.blocked ?? 0) > 0) {
      return NextResponse.json(
        { error: "Tài khoản đã bị khoá" },
        { status: 403 }
      );
    }
    emailToLogin = String(data.email || "").toLowerCase();
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailToLogin,
    password,
  });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ user: data.user, session: data.session });
}
