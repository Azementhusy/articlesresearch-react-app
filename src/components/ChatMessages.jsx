import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import {Slide} from '@mui/material';

const ChatBubble = ({ sender, message }) => {
    
    const isUser = sender === 'user';
    return (
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
            <Paper 
                style={{ 
                    alignSelf: isUser ? 'flex-end' : 'flex-start', 
                    backgroundColor: isUser ? '#1976d2' : '#ffffff', 
                    color: isUser ? '#fff' : '#000', 
                    padding: '10px', 
                    borderRadius: '15px', 
                    marginBottom: '10px',
                    maxWidth: '80%',
                }}>


                <Typography variant="body1">
                    {message}
                </Typography>
            </Paper>
        </Slide>
    );
};

const ChatMessages = ({ messages }) => {
    return (
        <List>
            {messages.map((msg, index) => (
                <ListItem key={index}>
                    <ChatBubble sender={msg.sender} message={msg.text} />
                </ListItem>
            ))}
        </List>
    );
};

export default ChatMessages;