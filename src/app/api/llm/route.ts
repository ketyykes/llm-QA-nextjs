import { NextRequest, NextResponse } from "next/server";
import { main } from "@/lib/llm";

export const runtime = "edge";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const result = await main(body.question);
	console.log("serverResult: ", result);
	return NextResponse.json({
		answer: result,
	});
}
