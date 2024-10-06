import React from 'react';
import MessageBubble from './MessageBubble';
import CreateLists from './CreateLists';

const MessageList = ({ messages }) => {
  return (
    <div>
    {messages.map((message, index) => {
      if (message.type === 'text') {
        return (
          <MessageBubble key={index} sender={message.sender} text={message.text} />
        );
      } else if (message.type === 'articles') {
        return (
          <div key={index} className={`message ${message.sender}`}>
            {message.data.map((item, idx) => (
              <CreateLists
                key={idx}
                title={item.title}
                doi={item.doi}
                publication_year={item.publication_year}
                cited_by_count={item.cited_by_count}
                is_oa={item.is_oa ? 'Yes' : 'No'}
                abstract={item.abstract}
              />
            ))}
          </div>
        );
      } else {
        return null;
      }
    })}
  </div>
  );
};

export default MessageList;