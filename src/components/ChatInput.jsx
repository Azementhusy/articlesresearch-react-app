import React from 'react';
import { Box, TextField, Button } from '@mui/material';

const ChatInput = ({ inputValue, onChangeInput, onSend }) => {
    return (
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          maxWidth: '800px',
          margin: '16px 0',  // 添加上下间距
          backgroundColor: 'white',  // 背景色为白色
          borderRadius: '20px',  // 圆角样式
          padding: '8px 16px',  // 内边距
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}>

        <TextField
          fullWidth
          variant="outlined"
          value={inputValue}
          onChangeCapture={(e) => onChangeInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter'){
              onSend();
            }
          }}
          placeholder="Type a message..."
          sx={{
            backgroundColor: 'white',  // 输入框的背景色
            borderRadius: '15px',  // 输入框的圆角
            '& fieldset': {
              border: 'none'  // 移除默认边框
            },
          }}
        />

          <Button 
            variant="contained" 
            color="primary"
            onClick={onSend}
            sx={{
              marginLeft: 1,
              padding: '8px 16px',
              borderRadius: '50px',  // 按钮的圆角
              transition: 'transform 0.3s ease, background-color 0.3s ease',  // 动画效果
              '&:hover': {
                transform: 'scale(1.1)',  // 悬停时放大效果
                backgroundColor: 'secondary.main',
              },
            }}>
            Send
          </Button>
      </Box>
    );
  };
  
  export default ChatInput;