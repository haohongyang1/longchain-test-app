import {  PromptTemplate,OpenAI } from 'langchain'; 
import start1 from './src/start1'
import start3 from './src/start3'
import start4 from './src/start4'
import start5 from './src/start5'
import start6 from './src/start6'
import toolsTextRun from './src/toolsText'
export default function Home() {
  
  const start2 = async() => {
    const model = new OpenAI({openAIApiKey:process.env.OPENAI_API_KEY });
    const template = '为{restaurantType}餐厅起一个好的名字。';
    const promptA = new PromptTemplate({ template, inputVariables: ['restaurantType'] });
    const formattedPrompt = await promptA.format({
        restaurantType: '四川菜',
    });
     // formattedPrompt: 为四川菜餐厅起一个好的名字。
     // 继续将处理好的prompt传给模型生成结果
    const resB = await model.call(formattedPrompt);
    console.log("resB====", resB);
  }
  const start = async () => {
    toolsTextRun()
  }
  start6()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    </main>
  )
}


