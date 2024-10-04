import React, {useState} from 'react';
import ChatInput from './ChatInput'
import ChatResponse from './ChatResponse';


const Chatbot = () => {
    const [inputText, setInputText] = useState("");
    const [articles, setArticles] = useState([]);
    const [chatResponse, setChatResponse] = useState("");
    
    function handleChange(event){
        const newValue = event.target.value;
        setInputText(newValue);
    }

    const handleSubmit = async (event) =>{
        event.preventDefault();

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
        } catch (error) {
            console.error('Error calling APIs:', error);
            setChatResponse("An error occurred. Please try again.");
        }
        setInputText("")
    };

    return (
      <div className="chatbox">
        <h1>Research Article Chatbot</h1>
        <ChatInput 
            inputText = {inputText}
            handleChange = {handleChange}
            handleSubmit = {handleSubmit}
        />

        <div>
            <h2>Chat Response:</h2>
            <p>{chatResponse || "No response yet"}</p>
        </div>
        <ChatResponse articles = {articles}/>
      </div>
    );
  };
  
  export default Chatbot;