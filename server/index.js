import express from 'express';
import axios from 'axios';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/fetch-json', async (req, res) => {
    //get the input from our user
    const {userQuery}=req.body;
    console.log('Received user query:', userQuery);
    console.log('Received req.body:', req.body);
    console.log('Received user query:', userQuery);

    try {
        //first, use GPT to get URL
        let gptGeneratedUrl;
        try {
            const gptResponse = await openai.chat.completions.create({
                model:"gpt-4o-mini",
                messages:[
                    { role:"system", content: "You are an assistant that generates OpenAlex API URLs based on user queries. Use only the following filters: 'publication_year', 'cited_by_count', 'is_oa', and 'default.search'."  },
                    { role: "user", content: `Generate a fully functional OpenAlex API URL based on the following user query: "${userQuery}". Use the following filters where applicable: 'default.search' for text search (e.g., 'default.search:keyword'), 'publication_year' for publication year (e.g., 'publication_year:2021'), 'cited_by_count' for citation count (e.g., 'cited_by_count:>100'), and 'is_oa' for open access status (e.g., 'is_oa:true'). Combine multiple filters with commas. Ensure the URL is formatted as 'https://api.openalex.org/works?filter=...'. Output only the URL, and nothing else.` },
                ],
                max_tokens: 100
            });
            const fullResponse = gptResponse.choices[0].message.content;
            const urlMatch = fullResponse.match(/https:\/\/api\.openalex\.org\/works\?filter=[^\s'"]+/);
            gptGeneratedUrl = urlMatch ? urlMatch[0] : null;
            console.log('GPT response received:', fullResponse, gptGeneratedUrl);

            
            if(!gptGeneratedUrl){
                throw new Error('Could not extract a valid URL from the GPT response.');
            }
        } catch (error){
            console.error('Error generating URL with GPT:', error.response ? error.response.data : error.message);
            return res.status(500).json({ error: "It looks like there's something wrong with the request I sent to OpenAlex. Could you please tell me again?" });
        }

        //second, use url to get Alex data
        let filteredAlexResults;
        try {
            const alexResponse = await axios.get(gptGeneratedUrl);
            const alexResults = alexResponse.data.results;

            if (!alexResults || alexResults.length === 0) {
                throw new Error('No results found from OpenAlex API.');
            }

            filteredAlexResults = alexResults.map(item =>({
                doi:item.doi,
                title:item.display_name,
                publication_year:item.publication_year,
                is_oa:item.open_access?.is_oa || false,
                cited_by_count:item.cited_by_count || 0,
                abstract: item.abstract_inverted_index
                    ? Object.keys(item.abstract_inverted_index).join(' ')
                    : 'No abstract available', 
            }));
        } catch (error){
            console.error('Error fetching data from OpenAlex:', error.response ? error.response.data : error.message);
            return res.status(500).json({ error: "It looks like there's something wrong with the data OpenAlex returned to me. Could you please tell me again?" });
        }

        //third, use GPT to get summary
        let summary;
        try {
            const totalArticles = filteredAlexResults.length;
            const publicationYears = filteredAlexResults.map(article => article.publication_year);
            const minYear = Math.min(...publicationYears);
            const maxYear = Math.max(...publicationYears);
            const openAccessCount = filteredAlexResults.filter(article => article.is_oa).length;
            const summaryPrompt = `Based on the user's query "${userQuery}", I found ${totalArticles} articles published between ${minYear} and ${maxYear}. Among them, ${openAccessCount} are open access. Please write a summary from my perspective to summarize my search results for users. Don't say anything else. `;
            console.log('Filtered Alex Results:', filteredAlexResults);

            const summaryResponse = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: summaryPrompt }
                ],
            max_tokens: 150,
            });
            summary = summaryResponse.choices[0].message.content.trim();
            console.log('Summary generated:', summaryResponse); 
        } catch (error) {
            console.error('Error generating summary with GPT:', error.response ? error.response.data : error.message);
            summary = "These are the search results.";
        }

        res.json({
            articles: filteredAlexResults,
            summary,
        });

    } catch (error) {
        console.error('Unexpected error occurred:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
});

app.listen(PORT,()=> {
    console.log(`Server is runing on port ${PORT}`);
});