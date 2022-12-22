import {Configuration, OpenAIApi} from "openai";
import dotenv from 'dotenv'
dotenv.config();
import fetch from 'node-fetch'
// const query = 'benefits of ghee'

// document.getElementById('get-my-answer').addEventListener('click', async () =>{
//     const prompt = document.getElementById('message').innerHTML ;
//     console.log(prompt);
//     console.log(await openAICall(prompt));
// })

const configuration = new Configuration({
    organization: "org-uzqmwt05wbaGv7p65g22JNKV",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.listEngines();
const query = 'benefits of ghee';

export async function openAICall(prompt) {
    console.log('function called')
    const response = await fetch("https://api.openai.com/v1/completions", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            'model': 'text-davinci-003',
            'prompt': `${prompt}`,
            'max_tokens': 2048,
            'temperature': 0.75
        })
    })
    const responseJSON = await response.json();
    const mainData = responseJSON.choices[0].text.trim();
    // console.log(mainData)
    return (mainData) ;
}
// openAICall(query);