import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";
// (tuỳ chọn) tắt cache nếu cần
// export const revalidate = 0;

export async function GET() {
  // 1) Lấy cookieStore ngay đầu hàm
  const cookieStore = cookies();
  // 2) Truyền vào client bằng hàm trả về cookieStore
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 400 });
  }
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ auth_user: user, profile: data });
}

export async function PATCH(req) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 400 });
  }
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const patch = await req.json();
  delete patch.id;
  delete patch.email;

  // Nếu có sửa nick_name, normalize về lowercase theo quy ước của hệ thống
  if (typeof patch.nick_name === "string") {
    patch.nick_name = patch.nick_name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_.-]/g, "");
  }

  const { data, error } = await supabase
    .from("users")
    .update(patch)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}
