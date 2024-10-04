import express from 'express';
import axios from 'axios';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const PORT = process.env.PORT || 5000;


app.post('/api/generate', async (req,res) =>{
    const {userQuery}=req.body;

    try {
        console.log('Received user query:',userQuery);
        //check user's input

        const gptResponse = await openai.chat.completions.create({
            model:"gpt-4o-mini",
            messages:[
                {role:"system", content: "You are a helpful assistant."  },
                { role: "user", content: `Generate a fully functional OpenAlex API URL based on the following user query: "${userQuery}". Use the following filters where applicable: 'search' for text search (e.g., 'search:keyword'), 'publication_year' for publication year (e.g., 'publication_year:2021'), 'cited_by_count_sum' for citation count (e.g., 'cited_by_count_sum:>100'), and 'is_oa' for open access status (e.g., 'is_oa:true'). Combine multiple filters with commas. Ensure the URL is formatted as 'https://api.openalex.org/works?filter=...'. Output only the URL, enclosed in triple backticks as a code block, and nothing else.` },
            ],
            max_tokens: 300
        });
        console.log('GPT response received:', gptResponse);
        //check GPT's response
     
        
        const fullResponse = gptResponse.choices[0].message.content;
        const codeBlockMatch = fullResponse.match(/```(.*?)```/s);
        const extractedContent = codeBlockMatch ? codeBlockMatch[1].trim() : fullResponse;
        const urlMatch = extractedContent.match(/https:\/\/api\.openalex\.org\/works\?filter=[^\s'"]+/);
        const generatedUrl = urlMatch ? urlMatch[0] : null;

        //console.log('Full GPT response content:', fullResponse);
        //get full response from GPT

        if(!generatedUrl){
            throw new Error('Could not extract a valid URL from the GPT response.');
        }
        console.log('Generated OpenAlex URL:', generatedUrl)
        //check the url send to Alex

        const apiResponse = await axios.get(generatedUrl);
        const extractedResults = apiResponse.data.results;
        console.log('OpenAlex API response received:', extractedResults); 
        //check the infromation from Alex

        const titlesAndYears = extractedResults.map(article => `${article.title} (published in ${article.publication_year})`).join("; ");
        const summaryPrompt = `I found ${extractedResults.length} articles on "${userQuery}".Summarize the key findings from the following articles: ${titlesAndYears}.`;
        const summaryResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: summaryPrompt }
        ],
          max_tokens: 200,
        });
        const summary = summaryResponse.choices[0].message.content.trim();
        console.log('Summary generated:', summaryResponse); 
        //check summary

        res.json({ url: generatedUrl, summary});
    } catch (error){
        if(error.response){
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        }
        console.error('Error generating response:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

app.listen(PORT,()=> {
    console.log(`Server is runing on port ${PORT}`);
});