import Link from "next/link";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import UserNav from "./UserNav";

export default async function AppHeader() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("users")
      .select("full_name, avatar_url, email")
      .eq("id", user.id)
      .single();
    profile = {
      full_name:
        data?.full_name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0],
      email: data?.email || user.email,
      avatar_url: data?.avatar_url || user.user_metadata?.avatar_url || null,
    };
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        background: "#fff",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <nav style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link
            href="/"
            style={{ fontWeight: 700, fontSize: 18, color: "#1677ff" }}
          >
            Invoice
          </Link>
          <Link href="/" style={{ color: "#555" }}>
            Trang chủ
          </Link>
          <Link href="/invoices" style={{ color: "#555" }}>
            Invoices
          </Link>
        </nav>

        <UserNav user={user} profile={profile} />
      </div>
    </header>
  );
}
