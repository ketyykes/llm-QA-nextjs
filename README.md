# 專案名稱 - llm-QA-nextjs


## 介紹

本專案是一個結合了 Next.js、LangChainJS、Tailwind CSS 等前沿技術，並透過 RAG、Memory Vector Store 和 Embedding 技術實現與 Google Gemini Pro 的互動。該系統旨在利用最新的 AI 和自然語言處理技術提供高效且精確的回答和資訊檢索功能。

## 目錄

- [TechStack](#techstack)
- [安裝指南](#安裝指南)
- [使用方法](#使用方法)
- [功能特性](#功能特性)
- [依賴項目](#依賴項目)
- [範例](#範例)


## TechStack

本專案使用的技術如下：

- **Next.js**: 使用 Next.js 來實現Server fetch 和與 LLM 的溝通。
- **LangChainJS**: LangChainJS 是一個專門用於整合大型語言模型，簡化了 AI 服務的連接和自然語言處理功能的開發。
- **Tailwind CSS**: Tailwind CSS 是一種Atomic CSS概念，通過直接在 HTML 元素中添加class，提供高度客製化的前端界面。
- **Remark**: Remark 是一個 Markdown 處理器，主要用於將 Markdown 文檔轉換為 HTML，便於在應用中渲染。
- **RAG (Retrieval-Augmented Generation)**: RAG 結合了檢索和生成的技術，先檢索相關資料，再基於這些資料生成更加準確且詳細的回答。
- **Memory Vector Store**: Memory Vector Store 是一種儲存向量的技術，便於快速檢索和處理大量數據，特別適用於自然語言處理。
- **Embedding**: 將文字轉換為數字向量形式，便於模型處理和分析。

## 安裝指南

### 需求環境

在開始之前，請確保您的系統已安裝以下工具：

- **Node.js**: 建議使用 [Node.js 版本 16 或更高版本](https://nodejs.org/)。
- **pnpm**: 本專案使用 [pnpm](https://pnpm.io/) 作為包管理器。您可以使用以下命令進行安裝：
  ```bash
  npm install -g pnpm
  ```
### 安裝步驟

1. clone 此專案：
   ```bash
   git clone https://github.com/ketyykes/llm-QA-nextjs
   cd llm-QA-nextjs
   ```

2. 安裝依賴項：
   ```bash
   pnpm install
   ```

3. 配置環境變數：

  建立.env檔案需要GOOGLE_API_KEY
  
  範例如下
  ```
  GOOGLE_API_KEY=你的API key
  ```


4. 啟動應用：
   ```bash
    pnpm run dev
   ```

## 使用方法

- 在開發環境中，運行命令 `npm run dev`，應用將在本地啟動。
- 透過網頁界面進行自然語言查詢，系統會基於 RAG 模型提供相關的回答。

## 功能特性

- 支持自然語言處理與問答。
- 可視化且響應式的前端設計，基於 Tailwind CSS。
- 高效的信息檢索與生成，依賴 RAG 和 Memory Vector Store。
- 靈活的架構，易於擴展和集成其他 LLM。

## 依賴項目

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [Next.js](https://nextjs.org/)
- [LangChainJS](https://langchain.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Remark](https://remark.js.org/)
- 其他詳見 `package.json` 文件。

## 範例

這裡可以展示一些主要的程式碼片段

```javascript
import path from "path";
import { promises as fs } from "fs";

import {
	GoogleGenerativeAIEmbeddings,
	ChatGoogleGenerativeAI,
	GoogleGenerativeAIChatInput,
} from "@langchain/google-genai";

import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { TaskType } from "@google/generative-ai";
import {
	RecursiveCharacterTextSplitter,
	RecursiveCharacterTextSplitterParams,
	SupportedTextSplitterLanguage,
} from "langchain/text_splitter";
import { PromptTemplate } from "@langchain/core/prompts";
import { formatDocumentsAsString } from "langchain/util/document";
import {
	RunnableSequence,
	RunnablePassthrough,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Document } from "@langchain/core/documents";
import { VectorStoreRetriever } from "@langchain/core/vectorstores";
import {
	BaseChatModel,
	BaseChatModelParams,
} from "@langchain/core/language_models/chat_models";

const ModelConfig: GoogleGenerativeAIChatInput = {
	modelName: "gemini-pro",
	temperature: 0.7,
	topK: 1,
	topP: 1,
	maxOutputTokens: 30000,
};
const promptTemplate = `"Please answer the question following these context.
If the question is related to the language of your input, please respond in that language. If you are unable to provide an answer in the relevant language, kindly inform the user to contact us via private message on the Facebook fan page of '好想工作室'"
1. Make sure you understand the content of the question clearly.
2. If the question is asked in Traditional Chinese, please respond in Traditional Chinese. Otherwise, respond in the language of the question.
3. If you're unsure how to answer in a specific language or the question is beyond your knowledge scope, politely inform the user, suggesting they contact us by phone for further assistance.
4. Provide our Facebook fan page 'www.facebook.com/GoodideasStudio' and encourage users to send a private message if needed.
5. Always remain respectful and patient to ensure the best user experience.
Question: {question}
Context:{context}
`;
// 生成並儲存嵌入式向量
export async function main(question: string) {
	const trainingData = await fs.readFile(
		path.resolve("src/app/info.md"),
		"utf8"
	);
	const splitter = createSplitter("markdown", {
		chunkSize: 500,
		chunkOverlap: 0,
		separators: [],
		keepSeparator: false,
	});
	const documents = await createDocumentsFromData(splitter, trainingData);
	const retriever = await createVectorRetriever(documents);
	const prompt = createPromptTemplate(promptTemplate);
	const model = createModel(ModelConfig);
	const chain = await createChain(retriever, prompt, model);
	const result = chain.invoke(question);
	return result;
}

// 建立分割器
function createSplitter(
	language: SupportedTextSplitterLanguage,
	option: Partial<RecursiveCharacterTextSplitterParams>
) {
	return RecursiveCharacterTextSplitter.fromLanguage(language, option);
}
// // 從數據建立文件
async function createDocumentsFromData(
	textSplitter: RecursiveCharacterTextSplitter,
	trainingText: string
) {
	return textSplitter.createDocuments([trainingText]);
}

// 建立向量檢索器
async function createVectorRetriever(
	documents: Document<Record<string, any>>[]
) {
	// 建立記憶體向量 Store
	// 參數為 documents 與 embedding model
	const vectorStore = await MemoryVectorStore.fromDocuments(
		documents,
		new GoogleGenerativeAIEmbeddings({
			modelName: "embedding-001",
			taskType: TaskType.RETRIEVAL_DOCUMENT,
			title: "Document title",
		})
	);
	return vectorStore.asRetriever();
}

// 建立提示模板
function createPromptTemplate(promptTemplate: string) {
	return PromptTemplate.fromTemplate(promptTemplate);
}

// 建立聊天模型
function createModel(GoogleModelConfig: BaseChatModelParams) {
	return new ChatGoogleGenerativeAI(GoogleModelConfig);
}

// 使用模型回答問題
async function createChain(
	retriever: VectorStoreRetriever<MemoryVectorStore>,
	prompt: PromptTemplate,
	model: BaseChatModel
) {
	const chain = RunnableSequence.from([
		{
			context: retriever.pipe(formatDocumentsAsString),
			question: new RunnablePassthrough(),
		},
		prompt,
		model,
		new StringOutputParser(),
	]);

	return chain;
}
```
