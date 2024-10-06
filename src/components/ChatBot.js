import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      setMessages(prev => [...prev, { sender: 'user', type:'text', text: inputValue }]);
      setInputValue('');
  
      try {
        setIsTyping(true);
  
        const response = await axios.post('http://localhost:5000/api/fetch-json', { userQuery: inputValue });
        if (response.data.error) {
          setMessages(prev => [...prev, { sender: 'bot', text: response.data.error }]);
        } else {
          const {summary, articles} = response.data;

          setMessages(prev => [
            ...prev,
            { sender: 'bot', type: 'articles', data: articles },
            { sender: 'bot', type: 'text', text: summary }
          ]);
        }
      } catch (error) {
          setMessages(prev => [...prev, { sender: 'bot', type: 'text', text: 'A network error occurred. Please try again later.' }]);
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