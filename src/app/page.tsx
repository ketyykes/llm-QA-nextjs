import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
	return (
		<main className="flex justify-center items-center min-h-screen">
			<div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
				<h2 className="text-2xl font-semibold text-gray-800 mb-4">
					Stack 概覽
				</h2>
				<p className="mb-4 text-gray-600">以下是選用的技術：</p>
				<dl className="space-y-4">
					<div>
						<dt className="text-lg font-medium text-gray-900">Next.js</dt>
						<dd className="text-gray-600">
							使用 Next.js 的 Server fetch 與 LLM 進行溝通。
						</dd>
					</div>
					<div>
						<dt className="text-lg font-medium text-gray-900">LangChainJS </dt>
						<dd className="text-gray-600">
							LangChainJS 是一個讓開發者易於在應用中整合大型語言模型的
							JavaScript 庫，支持豐富的自然語言處理功能，簡化了與 AI
							服務的連接。
						</dd>
					</div>
					<div>
						<dt className="text-lg font-medium text-gray-900">Tailwind CSS</dt>
						<dd className="text-gray-600">
							Tailwind CSS 是一種高度客製化的 CSS
							框架，它使用工具類方法來加速前端開發。透過直接在 HTML
							元素中添加預定義的類別，開發者可以快速構建出獨特且響應式的界面。
						</dd>
					</div>
					<div>
						<dt className="text-lg font-medium text-gray-900">Remark</dt>
						<dd className="text-gray-600">
							Remark 作為 Markdown 處理器，主要用途是將 Markdown 文檔轉換為
							HTML。
						</dd>
					</div>
				</dl>
				<h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-16">
					採用了 RAG (Retrieval-Augmented Generation)、Memory Vectors Store 和
					Embedding 技術來實現與 Google Gemini Pro 的互動。
				</h2>
				<p className="mb-4 text-gray-600">以下是這些技術的條列式介紹：</p>
				<dl className="space-y-4">
					<div>
						<dt className="text-lg font-medium text-gray-900">RAG</dt>
						<dd className="text-gray-600">
							RAG (Retrieval-Augmented Generation): RAG
							是一種結合了檢索和生成能力的技術，旨在提高語言模型回答問題的準確性和深度。通過先檢索相關信息，然後基於這些信息生成回答，RAG
							能夠提供比傳統語言模型更加準確和細緻的輸出。
						</dd>
					</div>
					<div>
						<dt className="text-lg font-medium text-gray-900">
							Memory Vector Store
						</dt>
						<dd className="text-gray-600">
							採用了一種名為向量儲存的技術，主要轉化向量儲存在記憶體當中，這是一種專門為了快速處理和檢索大量數據而設計的解決方案。它能將文本信息轉化為向量形式，這樣就能在數據海洋中迅速找到與查詢最相關的信息。
						</dd>
					</div>
					<div>
						<dt className="text-lg font-medium text-gray-900">Embedding</dt>
						<dd className="text-gray-600">
							在這個系統中用於將文字信息轉換為能夠被機器學習模型處理的數字表示形式。
						</dd>
					</div>
					<div className="flex justify-center">
						<Button
							className="w-[200px] mt-2 mx-auto text-white "
							variant="outline"
							asChild
						>
							<Link href="/question"> 去問答系統</Link>
						</Button>
					</div>
				</dl>
			</div>
		</main>
	);
}
