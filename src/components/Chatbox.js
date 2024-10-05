import React, {useState} from 'react';
import ChatInput from './ChatInput'
import ChatResponse from './ChatResponse';
import ChatMessages from './ChatMessages';


const Chatbot = () => {
    const [inputText, setInputText] = useState("");
    const [articles, setArticles] = useState([]);
    const [messages, setMessages] = useState([]);
    //const [chatResponse, setChatResponse] = useState("");
    const [loading, setLoading]=useState(false);
    
    // function handleChange(event){
    //     const newValue = event.target.value;
    //     setInputText(newValue);
    // }

    const handleSubmit = async (event) =>{
        event.preventDefault();

        if (!inputText.trim()) {
            setMessages("Please at least write something~");
            return;
        }

        const newMessages = [...messages, { sender: 'user', text: inputText }];
        setMessages(newMessages);

        setLoading(true);

        try {
            const gptResponse = await fetch('http://localhost:5000/api/generate',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ userQuery: inputText })
            });

            const data = await gptResponse.json();
            if(data.aticles){
                setArticles(data.articles);
                const botMessage = data.summary;
                setMessages([...newMessages, {sender:'bot',text:botMessage}]);
            } else {
                setMessages([...newMessages, { sender: 'bot', text: "Sorry, no articles found." }])
            }
        } catch (error){
            setMessages([...newMessages, { sender: 'bot', text: "An error occurred. Please try again." }]);
        }

        setInputText("");
        setLoading(false);
    };


    //         const generatedUrl = data.url;

    //         const apiResponse = await fetch(generatedUrl);
    //         if (apiResponse.ok){
    //             const data = await apiResponse.json();
    //             const extractedResults = data.results.map((result) => ({
    //                 doi: result.doi,
    //                 title: result.title,
    //                 publication_year: result.publication_year,
    //                 is_oa:result.primary_location ? result.primary_location.is_oa:false,
    //                 cited_by_count: result.cited_by_count || 0,
    //                 summary: result.description || "No Summary"
    //             }));
    //             setArticles(extractedResults);

    //             setChatResponse(data.summary);

    //         } else {
    //             console.error('Request to OpenAlex API failed', apiResponse.status);
    //             setChatResponse("Sorry, I couldn't retrieve the data from OpenAlex.")
    //         }
    //         setLoading(false)
    //     } catch (error) {
    //         setLoading(false);
    //         if (error.response && error.response.status === 404) {
    //             setChatResponse("Sorry, no results found for your query.");
    //         } else {
    //             setChatResponse("An unexpected error occurred. Please try again later.");
    //         }
    //         console.error('Error calling APIs:', error);
    //     }
    //     setInputText("")
    // };

    return (
        <div className="chatbox">
            <h1>Research Article Chatbot</h1>
            <ChatMessages messages={messages} />

            <ChatResponse articles={articles} />

            <ChatInput 
                inputText={inputText}
                handleChange={(e) => setInputText(e.target.value)}
                handleSubmit={handleSubmit}
            />
            {loading && <p>Loading...</p>}
        </div>

    );
};
  
export default Chatbot;