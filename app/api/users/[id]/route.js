import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Nếu là chính chủ: xem được
  if (params.id === user.id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  }

  // Nếu là super_admin: xem được mọi user (RLS cũng cho phép)
  const { data: me } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  if (me?.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", params.id)
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function PATCH(req, { params }) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const patch = await req.json();
  // Không cho đổi id/email trực tiếp qua API
  delete patch.id;
  delete patch.email;

  // Nếu sửa người khác -> phải là super_admin
  if (params.id !== user.id) {
    const { data: me } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    if (me?.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }
  // RLS sẽ:
  // - cho chính chủ update (trigger chặn field nhạy cảm)
  // - cho super_admin update bất kỳ row

  const { data, error } = await supabase
    .from("users")
    .update(patch)
    .eq("id", params.id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
