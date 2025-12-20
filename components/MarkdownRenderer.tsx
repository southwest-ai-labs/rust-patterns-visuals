import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { MermaidDiagram } from './MermaidDiagram';

interface MarkdownRendererProps {
  content: string;
}

declare global {
  interface Window {
    Prism: any;
  }
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  
  // Trigger Prism syntax highlighting whenever content changes
  useEffect(() => {
    if (window.Prism) {
      window.Prism.highlightAll();
    }
  }, [content]);

  return (
    <div className="markdown-content">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            // Handle Mermaid diagrams
            if (!inline && language === 'mermaid') {
              // Ensure children is a string before passing to Mermaid
              const chartContent = String(children).replace(/\n$/, '');
              return <MermaidDiagram chart={chartContent} />;
            }

            // Standard code blocks (Prism will handle the highlighting via className)
            return !inline && match ? (
              <div className="relative group">
                 <div className="absolute right-2 top-2 text-xs text-slate-500 uppercase font-mono select-none">{language}</div>
                 <pre className={className}>
                    <code className={className} {...props}>
                        {children}
                    </code>
                 </pre>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          blockquote({ node, children, ...props }: any) {
            // Check if this is a "Gem" / Pro Tip
            // We look for the 💎 emoji or "Pro Tip" string in the children
            let isGem = false;
            
            // Helper to extract text recursively
            const extractText = (nodes: React.ReactNode): string => {
                let text = '';
                React.Children.forEach(nodes, (child) => {
                    if (typeof child === 'string') {
                        text += child;
                    } else if (typeof child === 'number') {
                        text += String(child);
                    } else if (child && typeof child === 'object' && 'props' in child) {
                        // Safe recursive extraction
                        const element = child as React.ReactElement<any>;
                         if (element.props && element.props.children) {
                            text += extractText(element.props.children);
                        }
                    }
                });
                return text;
            };

            const fullText = extractText(children);
            
            if (fullText.includes('💎') || fullText.includes('Pro Tip')) {
                isGem = true;
            }

            if (isGem) {
                return (
                    <div className="gem-block">
                        <div className="gem-icon">💎</div>
                        <span className="gem-title">The Rustacean Gem</span>
                        {children}
                    </div>
                );
            }

            return <blockquote className="border-l-4 border-slate-600 pl-4 italic text-slate-400 my-6 bg-slate-800/30 p-4 rounded-r" {...props}>{children}</blockquote>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};