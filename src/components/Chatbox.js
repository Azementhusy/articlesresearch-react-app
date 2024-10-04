import React, {useState} from 'react';
import ChatInput from './ChatInput'
import ChatResponse from './ChatResponse';
import {Box, Grid} from '@mui/material';


const Chatbot = () => {
    const [inputText, setInputText] = useState("");
    const [articles, setArticles] = useState([]);
    const [chatResponse, setChatResponse] = useState("");
    const [loading, setLoading]=useState(false);
    
    function handleChange(event){
        const newValue = event.target.value;
        setInputText(newValue);
    }

    const handleSubmit = async (event) =>{
        event.preventDefault();

        if (inputText.trim().length === 0) {
            setChatResponse("Please at least write something~");
            return;
        }

        setLoading(true);

        try {
            const gptResponse = await fetch('http://localhost:5000/api/generate',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ userQuery: inputText })
            });

            const data = await gptResponse.json();
            const generatedUrl = data.url;

            const apiResponse = await fetch(generatedUrl);
            if (apiResponse.ok){
                const data = await apiResponse.json();
                const extractedResults = data.results.map((result) => ({
                    doi: result.doi,
                    title: result.title,
                    publication_year: result.publication_year,
                    is_oa:result.primary_location ? result.primary_location.is_oa:false,
                    cited_by_count: result.cited_by_count || 0,
                    summary: result.description || "No Summary"
                }));
                setArticles(extractedResults);

                setChatResponse(data.summary);

            } else {
                console.error('Request to OpenAlex API failed', apiResponse.status);
                setChatResponse("Sorry, I couldn't retrieve the data from OpenAlex.")
            }
            setLoading(false)
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.status === 404) {
                setChatResponse("Sorry, no results found for your query.");
            } else {
                setChatResponse("An unexpected error occurred. Please try again later.");
            }
            console.error('Error calling APIs:', error);
        }
        setInputText("")
    };

    return (
      <Box className="chatbox" p={3}>
        <h1>Research Article Chatbot</h1>
        <ChatInput 
            inputText = {inputText}
            handleChange = {handleChange}
            handleSubmit = {handleSubmit}
        />

        <Box mt={2}>
            <h2>Chat Response:</h2>
            {loading? <p>Loading...</p> : <p>{chatResponse || "No response yet"}</p>}
        </Box>

        <Grid container spacing={2} mt={3}>
            <ChatResponse articles = {articles}/>
        </Grid>
      </Box>
    );
};
  
export default Chatbot;