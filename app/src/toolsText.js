import { FaissStore } from 'langchain/vectorstores/faiss';
import { OpenAI } from "langchain/llms/openai";
import { MarkdownTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { VectorStoreQATool } from 'langchain/tools';
// import { Calculator } from './CalculatorTool'
import { Calculator } from "langchain/tools/calculator";

import { initializeAgentExecutorWithOptions } from 'langchain/agents'
const run = async function () {
    try {

        // 创建向量数据库
        const docText = `
        2023年普通高等学校招生全国统一考试7日开考。据教育部统计，今年全国有1291万考生报名参考，比去年增加98万人，再创历史新高。从已公布的2023年高考报名人数看，多地较去年报名人数有所增加。如湖南高考报名人数达68.4万人，比上年增加2.9万人；四川省报考人数超过80万，两省报名人数均创历史新高。教育部会同国家教育统一考试工作部际联席会议成员单位，统筹谋划，周密部署，指导各地精心做好考试组织和考生服务工作。记者了解到，各地考点考场已“严阵以待”。安徽铜陵10个考点442个考场准备工作已就绪，一些考点在不同位置安放了布局图并有专人引导讲解，对行动不便的考生还开放了电梯便捷通道，配备专人全程服务。广州市越秀区6000余位考生将走入9个考点200余个考场，各考点设置“暖心服务点”，配置部分衣物、药品、饮用水、文具等，为考生提供服务。今年是实施新冠“乙类乙管”后的首次高考，教育部提示考生，建议继续做好个人防护，当好自身健康第一责任人，考前尽量减少聚集和流动，不去人员密集场所。多地发布了考场防疫的提示信息。北京市教育考试院发布提示，考生应做好自我健康监测，如出现发热、咳嗽等不适症状应及时向报名单位（所在中学）报告。广西柳州考生进入考场就座后可以自主决定是否佩戴口罩，但考生要自备口罩，在进入考点、考场前自觉佩戴口罩；考试结束后，考生应立即佩戴口罩，有序离开考场。多地发布高考考前提示和考场规则，表示今年将加强高考安检。北京、江西、湖南长沙等地考生考前需经过两次安检，手机、智能手表、智能手环等电子设备禁止带入考点。教育部提示，考生的衣着要符合当地考试机构的相关要求，建议不佩戴含有金属成分的手镯、项链、发夹等佩饰物品。除省级招生考试机构规定的考试用品外，其他物品不要带入考场。进入考点时，要听从工作人员的安排，有序排队，保持一定间隔，手机最好在赴考前提前存放好，也可在进入考点前交给带队老师及家长，或按照考点规定要求存放。
        `
        // MarkdownTextSplitter是一个Text Splitters的实现，用来快速对markdown或者纯文本分段。
        const splitter = new MarkdownTextSplitter({
            chunkSize: 100, // 一个块中最大的token数量
            chunkOverlap: 50, // 相邻块之间重叠字符的数量。默认值为200个Token。块和块之间添加重叠的文本有助于模型获取更多上下文信息
        });
        // 将上下文向量化
        const output = await splitter.splitText(docText);
        const embedding = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }) // 使用OpenAI的embedding模型
        const vectorStore = await FaissStore.fromTexts(output, {}, embedding);
        const llmA = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY }); // 记得在环境变量中配置你的OpenAI Key
        // langchain内置的VectorStoreQATool没有提供prompt，这里手动提供
        const vecToolName = 'vector-search';
        const vecToolDescription = '一种知识搜索工具，用于从大量信息中提取所需信息。如果无法直接获得有用信息，请尝试将其分解。';
        const tools = [
            // 向量搜索工具
            new VectorStoreQATool(vecToolName, vecToolDescription, {
                llm: llmA,
                vectorStore,
            }),
            // 计算器工具
            new Calculator(),
        ];
        // 创建agent执行器
        const executor = await initializeAgentExecutorWithOptions(tools, llmA, {
            agentType: 'zero-shot-react-description',
            verbose: true,
        });

        // 用户提问
        const input = '湖南高考报名人数加上四川省高考报名人数的结果';
        // 结果: 湖南高考报名人数加上四川省高考报名人数的结果为148.4万人。
        const result = await executor.call({ input });
        console.log("result===", result);
    } catch (e) {
        console.log("error===", e);
    }
}
export default run