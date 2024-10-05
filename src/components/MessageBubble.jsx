import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';

const fadeInUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    } to {
        opacity: 1;
        transform: translateY(0);
    }
`;


const MessageBubble = ({ sender, text }) => {
  const isUser = sender === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 1,
        animation: `${fadeInUp} 0.5s ease` 
      }}
    >
      <Paper
        sx={{
          padding: 1,
          backgroundColor: isUser ? 'primary.main' : 'grey.300',
          color: isUser ? 'white' : 'black',
          borderRadius: '10px',
          maxWidth: '60%',
          animation: `${fadeInUp} 0.5s ease`
        }}
      >
        <Typography variant="body1">{text}</Typography>
      </Paper>
    </Box>
  );
};

export default MessageBubble;