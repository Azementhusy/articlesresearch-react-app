import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import CreateLists from './CreateLists';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      setMessages(prev => [...prev, { sender: 'user', text: inputValue }]);
      setInputValue('');
  
      try {
        setIsTyping(true);
  
        const response = await axios.post('http://localhost:5000/api/fetch-json', { userQuery: inputValue });
        if (response.data.error) {
          setMessages(prev => [...prev, { sender: 'bot', text: response.data.error }]);
        } else {
          const {summary, articles} = response.data;

          const articleCards = articles.map((item, index) => (
            <CreateLists
              key={index}
              title={item.title}
              doi={item.doi}
              publication_year={item.publication_year}
              cited_by_count={item.cited_by_count}
              is_oa={item.is_oa ? 'Yes' : 'No'}
              abstract={item.abstract}
            />
          ));

          setMessages(prev => [...prev, { sender: 'bot', text: articleCards }]);

          setMessages(prev => [...prev, { sender: 'bot', text: summary }]);
        }
      } catch (error) {
          setMessages(prev => [...prev, { sender: 'bot', text: 'A network error occurred. Please try again later.' }]);
      } finally {
          setIsTyping(false);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box className="container">
      <Typography variant="h5" className="header">
        Let's find the article together
      </Typography>
        
      <Box className = "message-container">
        <MessageList messages={messages} />
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </Box>

      <Box className="input-container">
        <ChatInput
          className="input-box"
          inputValue={inputValue}
          onChangeInput={setInputValue}
          onSend={handleSendMessage}
        />
      </Box>

    </Box>
  );
};

export default ChatBot;