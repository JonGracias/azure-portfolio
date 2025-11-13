export const revalidate = 3600;

import { NextResponse } from "next/server";
import { fetchRepos } from "@/lib/github";

export async function GET() {
  try {
    const repos = await fetchRepos();
    return NextResponse.json(repos);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
