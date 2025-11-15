import { useState } from 'react';
import './ArticleDisplay.css';

export default function ArticleDisplay({ article, topics, onReset }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(article);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert markdown links to clickable links and format paragraphs
  const formatArticle = (text) => {
    // First, split by double line breaks to get paragraphs
    let paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    // If no paragraphs found (no double line breaks), try single line breaks
    if (paragraphs.length === 1 && text.includes('\n')) {
      paragraphs = text.split(/\n/).filter(p => p.trim().length > 0);
    }
    
    // If still only one paragraph, try to split by sentence patterns for better formatting
    if (paragraphs.length === 1) {
      const longParagraph = paragraphs[0];
      // Split by sentence endings followed by space and capital letter (rough paragraph detection)
      const sentenceSplit = longParagraph.match(/[^.!?]+[.!?]+(?:\s+[A-ZА-Я])?/g);
      if (sentenceSplit && sentenceSplit.length > 6) {
        // Group sentences into paragraphs of 3-4 sentences
        const sentencesPerPara = 3;
        paragraphs = [];
        for (let i = 0; i < sentenceSplit.length; i += sentencesPerPara) {
          paragraphs.push(sentenceSplit.slice(i, i + sentencesPerPara).join(' ').trim());
        }
      }
    }
    
    return paragraphs.map((paragraph, paraIndex) => {
      const linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(paragraph)) !== null) {
        // Add text before the link
        if (match.index > lastIndex) {
          const textBefore = paragraph.substring(lastIndex, match.index).trim();
          if (textBefore) {
            parts.push({
              type: 'text',
              content: textBefore + ' '
            });
          }
        }
        // Add the link
        parts.push({
          type: 'link',
          text: match[1],
          url: match[2]
        });
        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < paragraph.length) {
        const textAfter = paragraph.substring(lastIndex).trim();
        if (textAfter) {
          parts.push({
            type: 'text',
            content: ' ' + textAfter
          });
        }
      }

      return {
        type: 'paragraph',
        index: paraIndex,
        parts: parts.length > 0 ? parts : [{ type: 'text', content: paragraph.trim() }]
      };
    });
  };

  const formattedContent = formatArticle(article);

  return (
    <div className="article-display-container">
      <div className="article-header">
        <h2>Ваша персонализированная статья</h2>
        <div className="article-actions">
          <button 
            onClick={handleCopy} 
            className="copy-button"
            title="Копировать статью"
          >
            {copied ? '✓ Скопировано!' : '📋 Копировать'}
          </button>
          <button 
            onClick={onReset} 
            className="reset-button"
            title="Создать новую статью"
          >
            ✨ Новая статья
          </button>
        </div>
      </div>

      <div className="article-content">
        {formattedContent.map((paragraph, paraIndex) => (
          <p key={paraIndex} className="article-paragraph">
            {paragraph.parts.map((part, partIndex) => {
              if (part.type === 'link') {
                return (
                  <a
                    key={partIndex}
                    href={part.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="article-link"
                  >
                    {part.text}
                  </a>
                );
              }
              return <span key={partIndex}>{part.content}</span>;
            })}
          </p>
        ))}
      </div>

      {topics && topics.length > 0 && (
        <div className="topics-section">
          <h3>Интересные темы</h3>
          <div className="topics-grid">
            {topics.map((topic, index) => (
              <a
                key={index}
                href={topic.url}
                target="_blank"
                rel="noopener noreferrer"
                className="topic-card"
              >
                <span className="topic-icon">🔗</span>
                <span className="topic-title">{topic.title}</span>
                <span className="topic-arrow">→</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

