import React from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages }) => {
  return (
    <div>
      {messages.map((message, index) => (
        <MessageBubble key={index} sender={message.sender} text={message.text} />
      ))}
    </div>
  );
};

export default MessageList;