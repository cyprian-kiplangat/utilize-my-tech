import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderMarkdown = (text: string) => {
    // Split content into lines for processing
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let currentIndex = 0;

    while (currentIndex < lines.length) {
      const line = lines[currentIndex];
      
      // Skip empty lines
      if (line.trim() === '') {
        currentIndex++;
        continue;
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={currentIndex} className="text-lg font-semibold text-blue-400 mt-4 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={currentIndex} className="text-xl font-bold text-blue-300 mt-6 mb-3">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={currentIndex} className="text-2xl font-bold text-white mt-6 mb-4">
            {line.replace('# ', '')}
          </h1>
        );
      }
      // Code blocks
      else if (line.startsWith('```')) {
        const language = line.replace('```', '').trim();
        const codeLines: string[] = [];
        currentIndex++;
        
        while (currentIndex < lines.length && !lines[currentIndex].startsWith('```')) {
          codeLines.push(lines[currentIndex]);
          currentIndex++;
        }
        
        elements.push(
          <div key={currentIndex} className="my-4">
            {language && (
              <div className="bg-slate-700 px-3 py-1 text-xs text-slate-300 rounded-t-lg border-b border-slate-600">
                {language}
              </div>
            )}
            <pre className={`bg-slate-800 p-4 ${language ? 'rounded-b-lg' : 'rounded-lg'} overflow-x-auto border border-slate-700`}>
              <code className="text-green-400 text-sm font-mono">
                {codeLines.join('\n')}
              </code>
            </pre>
          </div>
        );
      }
      // Unordered lists
      else if (line.match(/^[\s]*[-*+]\s/)) {
        const listItems: string[] = [];
        let listIndex = currentIndex;
        
        while (listIndex < lines.length && lines[listIndex].match(/^[\s]*[-*+]\s/)) {
          listItems.push(lines[listIndex].replace(/^[\s]*[-*+]\s/, ''));
          listIndex++;
        }
        
        elements.push(
          <ul key={currentIndex} className="list-disc list-inside space-y-1 my-3 text-slate-300">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        );
        
        currentIndex = listIndex - 1;
      }
      // Ordered lists
      else if (line.match(/^[\s]*\d+\.\s/)) {
        const listItems: string[] = [];
        let listIndex = currentIndex;
        
        while (listIndex < lines.length && lines[listIndex].match(/^[\s]*\d+\.\s/)) {
          listItems.push(lines[listIndex].replace(/^[\s]*\d+\.\s/, ''));
          listIndex++;
        }
        
        elements.push(
          <ol key={currentIndex} className="list-decimal list-inside space-y-1 my-3 text-slate-300">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ol>
        );
        
        currentIndex = listIndex - 1;
      }
      // Blockquotes
      else if (line.startsWith('> ')) {
        const quoteLines: string[] = [];
        let quoteIndex = currentIndex;
        
        while (quoteIndex < lines.length && lines[quoteIndex].startsWith('> ')) {
          quoteLines.push(lines[quoteIndex].replace('> ', ''));
          quoteIndex++;
        }
        
        elements.push(
          <blockquote key={currentIndex} className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-slate-800/50 rounded-r-lg">
            <div className="text-slate-300 italic">
              {quoteLines.map((quoteLine, idx) => (
                <p key={idx} className="leading-relaxed">
                  {renderInlineMarkdown(quoteLine)}
                </p>
              ))}
            </div>
          </blockquote>
        );
        
        currentIndex = quoteIndex - 1;
      }
      // Regular paragraphs
      else {
        elements.push(
          <p key={currentIndex} className="text-slate-300 leading-relaxed my-2">
            {renderInlineMarkdown(line)}
          </p>
        );
      }
      
      currentIndex++;
    }

    return elements;
  };

  const renderInlineMarkdown = (text: string) => {
    // Handle inline code first to avoid conflicts
    let result = text.replace(/`([^`]+)`/g, '<code class="bg-slate-700 px-2 py-1 rounded text-green-400 text-sm font-mono">$1</code>');
    
    // Bold text
    result = result.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
    
    // Italic text
    result = result.replace(/\*([^*]+)\*/g, '<em class="italic text-slate-200">$1</em>');
    
    // Links
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline transition-colors duration-200">$1</a>');
    
    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  return (
    <div className="prose prose-invert max-w-none">
      {renderMarkdown(content)}
    </div>
  );
};