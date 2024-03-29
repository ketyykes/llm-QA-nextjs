/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/vaJ78y2IIfe
 */
"use client";

import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { remark } from "remark";
import html from "remark-html";

export function QA() {
	const [question, setQuestion] = useState<string>("");
	const [answer, setAnswer] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		const response = await POSTData(question);

		const result = await remark().use(html).process(response.answer);
		if (response) {
			setLoading(false);
			setAnswer(result.toString());
		}
	};

	async function POSTData(question: string) {
		try {
			const result = await fetch("/api/llm", {
				method: "POST",
				body: JSON.stringify({ question }),
			});
			const json = await result.json();
			console.log("result: ", json);
			return json;
		} catch (err) {
			console.log("err:", err);
		}
	}
	return (
		<form onSubmit={handleSubmit}>
			<Card className="w-96 max-w-full">
				<CardHeader className="space-y-1">
					<h2 className="text-lg font-bold">對於好想工作室有任何問題嗎</h2>
					<p className="text-sm leading-none text-gray-500">
						請輸入問題到下方的文字框中
					</p>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-2">
						<Label htmlFor="question">問題</Label>
						<Input
							id="question"
							type="text"
							value={question}
							onChange={(e) => {
								setQuestion(e.target.value);
							}}
						/>
					</div>
					<div className="grid gap-2">
						{loading ? (
							<div className="h-96 w-full">Loading...</div>
						) : (
							<div className="h-96 overflow-y-auto" id="answer">
								{answer && <div dangerouslySetInnerHTML={{ __html: answer }} />}
							</div>
						)}
					</div>
					<div className="flex justify-end gap-2">
						<Button type="submit">Submit</Button>
					</div>
				</CardContent>
			</Card>
		</form>
	);
}
