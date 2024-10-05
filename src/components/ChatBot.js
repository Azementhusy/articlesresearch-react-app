import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', text: inputValue }
      ]);
      setInputValue('');

      // 模拟机器人生成回复
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: 'This is a simulated bot reply.' }
        ]);
        setIsTyping(false);
      }, 1000); // 延迟模拟机器人回复
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior:'smooth'});
  }
  useEffect(()=> {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        overflow:'hidden',
        justifyContent: 'flex-start',
        backgroundColor: '#f5f5f5',
      }}>

        <Typography 
            variant="h5" 
            sx={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                padding: '16px',
                backgroundColor: 'white',
                height: '64px',
                textAlign: 'center',
                zIndex: 1000,  // 确保标题在最上层
                boxSizing: 'border-box',
            }}>
                
            Chat with AI Assistant
        </Typography>
        
        <Box
            sx={{
                position: 'absolute',
                top: '64px',
                bottom: '100px',
                left: 0,
                right: 0,
                maxWidth: '60%' ,  // 设置最大宽度
                margin: '0 auto',   // 消息区域居中
                overflowY: 'auto',
                padding: '16px',
                boxSizing: 'border-box',
                backgroundColor: '#f5f5f5',
                
            }}>

            <MessageList messages={messages} />
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
        </Box>

        {/* 输入框 */}
        <Box
            sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100px',
            backgroundColor: '#f5f5f5',
            padding: '2px',
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 1000,
            }}>

            <ChatInput
                inputValue={inputValue}
                onChangeInput={setInputValue}
                onSend={handleSendMessage}
                sx={{
                    width: '100%', // 输入框占满页面宽度
                    textAlign: 'center',
                    alignItems: 'center',
                }}
            />
        </Box>

    </Box>
  );
};

export default ChatBot;