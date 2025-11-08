// app/api/github/starred/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const token = (await cookies()).get("gh_token")?.value;
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");

    if (!owner || !repo) {
      return NextResponse.json(
        { authed: false, starred: false, error: "Missing owner or repo" },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json({ authed: false, starred: false });
    }

    // GitHub: 204 = starred, 404 = not starred
    const gh = await fetch(`https://api.github.com/user/starred/${owner}/${repo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "nextjs-star",
      },
      cache: "no-store",
      next: { revalidate: 0 },
    });

    return NextResponse.json({
      authed: true,
      starred: gh.status === 204,
    });
    } catch (error: any) {
    console.error("GitHub API error:", error);
    return Response.json({ authed: false, starred: false, error: error.message || "Network error" }, { status: 500 });
  }
}
