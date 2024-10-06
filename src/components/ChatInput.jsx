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
          margin: '16px 0',
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '8px 16px',
          boxShadow: '2px 6px 10px rgba(0, 0, 0, 0.1)',
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
            backgroundColor: 'white',
            borderRadius: '15px',
            '& fieldset': {
              border: 'none'
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
              borderRadius: '50px',
              transition: 'transform 0.3s ease, background-color 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                backgroundColor: 'secondary.main',
              },
            }}>
            Send
          </Button>
      </Box>
    );
  };
  
  export default ChatInput;