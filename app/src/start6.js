/**
 * 通过 Google 搜索并返回答案
 * 来让我们的 OpenAI api 联网搜索，并返回答案给我们
 */

import { SerpAPI } from "langchain/tools";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { OpenAI } from "langchain/llms/openai";

const run = async function () {
    try {
        const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY });
        console.log("start6 run");
        const tools = [
            new SerpAPI(process.env.SERPAPI_API_KEY, {

                location: "Austin,Texas,United States",

                hl: "en",

                gl: "us",

            })
        ];
        const executor = await initializeAgentExecutorWithOptions(tools, model, {
            agentType: "zero-shot-react-description",
        });
        const result = await executor.call({ input: "What's the date today? What great events have taken place today in history?" });
        console.log("result===", result);
    } catch (e) {
        console.log("错误信息==", e);
    }
}
export default run 