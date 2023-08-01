import { OpenAI } from "langchain/llms/openai";
import { APIChain } from "langchain/chains";
/**
 * 从接口文档中返回信息；
 * 喂给他数据，让他分析，得出答案返回给我
 */
// Open-Meteo是一个免费开源的天气接口，OPEN_METEO_DOCS为它的接口文档详细描述
const OPEN_METEO_DOCS = `BASE URL: https://api.openai.com/v1/completions

API Documentation
The API endpoint /v1/forecast accepts a geographical coordinate, a list of weather variables and responds with a JSON hourly weather forecast for 7 days. Time always starts at 0:00 today and contains 168 hours. All URL parameters are listed below:

Parameter	Format	Required	Default	Description
latitude, longitude	Floating point	Yes		Geographical WGS84 coordinate of the location
hourly	String array	No		A list of weather variables which should be returned. Values can be comma separated, or multiple &hourly= parameter in the URL can be used.
daily	String array	No		A list of daily weather variable aggregations which should be returned. Values can be comma separated, or multiple &daily= parameter in the URL can be used. If daily weather variables are specified, parameter timezone is required.
current_weather	Bool	No	false	Include current weather conditions in the JSON output.
temperature_unit	String	No	celsius	If fahrenheit is set, all temperature values are converted to Fahrenheit.
windspeed_unit	String	No	kmh	Other wind speed speed units: ms, mph and kn
precipitation_unit	String	No	mm	Other precipitation amount units: inch
timeformat	String	No	iso8601	If format unixtime is selected, all time values are returned in UNIX epoch time in seconds. Please note that all timestamp are in GMT+0! For daily values with unix timestamps, please apply utc_offset_seconds again to get the correct date.
timezone	String	No	GMT	If timezone is set, all timestamps are returned as local-time and data is returned starting at 00:00 local-time. Any time zone name from the time zone database is supported. If auto is set as a time zone, the coordinates will be automatically resolved to the local time zone.
past_days	Integer (0-2)	No	0	If past_days is set, yesterday or the day before yesterday data are also returned.
start_date
end_date	String (yyyy-mm-dd)	No		The time interval to get weather data. A day must be specified as an ISO8601 date (e.g. 2022-06-30).
models	String array	No	auto	Manually select one or more weather models. Per default, the best suitable weather models will be combined.

Variable	Valid time	Unit	Description
temperature_2m	Instant	°C (°F)	Air temperature at 2 meters above ground
snowfall	Preceding hour sum	cm (inch)	Snowfall amount of the preceding hour in centimeters. For the water equivalent in millimeter, divide by 7. E.g. 7 cm snow = 10 mm precipitation water equivalent
rain	Preceding hour sum	mm (inch)	Rain from large scale weather systems of the preceding hour in millimeter
showers	Preceding hour sum	mm (inch)	Showers from convective precipitation in millimeters from the preceding hour
weathercode	Instant	WMO code	Weather condition as a numeric code. Follow WMO weather interpretation codes. See table below for details.
snow_depth	Instant	meters	Snow depth on the ground
freezinglevel_height	Instant	meters	Altitude above sea level of the 0°C level
visibility	Instant	meters	Viewing distance in meters. Influenced by low clouds, humidity and aerosols. Maximum visibility is approximately 24 km.`;

const run = async function () {
    try{
        
      const model = new OpenAI({openAIApiKey:process.env.OPENAI_API_KEY }); // 记得在环境变量中配置你的OpenAI Key
      // 使用APIChain，
      const chain = APIChain.fromLLMAndAPIDocs(model, OPEN_METEO_DOCS, {
        headers: {
          // These headers will be used for API requests made by the chain.
        },
      });
    
      const res = await chain.call({
        question:
          "上海今天天气怎么样",
      });
      // The weather in Shanghai today is 33.2°C with a weather code of 1.
      // 成功通过调用外部接口取得了完全真实的天气信息
      console.log({ res });
    }catch(e) {
        console.log("测试===",e);
    }
}

export default run