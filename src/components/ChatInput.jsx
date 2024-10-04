import React from 'react';
import { TextField, Button } from '@mui/material';

const ChatInput = ({ inputText, handleChange, handleSubmit }) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <TextField
          label="Ask me about research articles..."
          variant="outlined"
          fullWidth
          value={inputText}
          onChange={handleChange}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    );
  };
  
  export default ChatInput;