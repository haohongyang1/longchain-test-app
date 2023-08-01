import {  OpenAI } from 'langchain'; 
/**
 * 完成一次基础问答
 */
const run =async function () {
    try{
        console.log("开始",process.env.OPENAI_API_KEY);
        
        const model = new OpenAI({openAIApiKey:process.env.OPENAI_API_KEY }); // 记得在环境变量中配置你的OpenAI Key
        const resA = await model.call('为一个披萨饼餐厅起一个好的名字。');
        console.log("resA====结果===", resA);
      }catch(e) {
        console.log("error info==", e)
      }
}
export default run