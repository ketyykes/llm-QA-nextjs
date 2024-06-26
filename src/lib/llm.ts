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
