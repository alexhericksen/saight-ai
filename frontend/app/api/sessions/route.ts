import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const { tool, duration, tag } = data;

  const { error } = await supabase.from("sessions").insert([
    {
      tool,
      duration,
      tag
    }
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Session saved" }, { status: 200 });
}
