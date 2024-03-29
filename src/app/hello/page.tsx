"use client";
import { Button } from "@/components/ui/button";
export default function Hello() {
	async function getData() {
		try {
			const result = await fetch("/api/llm", {
				method: "GET",
			});
			const json = await result.json();
			console.log("result: ", json);
		} catch (err) {
			console.log("err:", err);
		}
	}

	return (
		<div>
			<Button className="w-[400px] mt-2" variant="outline" onClick={getData}>
				按鈕
			</Button>
		</div>
	);
}
