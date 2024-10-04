import React from 'react';
import CreateLists from './CreateLists';

const ChatResponse = ({ articles }) => {
  return (
    <div>
      <h2>Response:</h2>
      {articles.length > 0 ? (
        articles.map((article, index) => (
          <CreateLists
            key={index}
            title={article.title}
            doi={article.doi}
            publication_year={article.publication_year}
            cited_by_count={article.cited_by_count}
            is_oa={article.is_oa ? "Yes" : "No"}
            summary={article.summary}
          />
        ))
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default ChatResponse;