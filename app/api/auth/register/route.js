import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const supabase = createRouteHandlerClient({ cookies });
  const { email, password, nick_name, avatar_url } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email và password là bắt buộc" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nick_name,
        avatar_url,
        role: email.includes("nguyendangvinh") ? "super_admin" : "user",
      },
    },
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({
    user: data.user,
    session: data.session,
    message: data.session
      ? "Đăng ký và đăng nhập thành công"
      : "Đăng ký thành công",
  });
}
