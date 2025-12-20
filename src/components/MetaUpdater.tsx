
import React, { useEffect } from 'react';

interface MetaUpdaterProps {
  title: string;
  description?: string;
  image?: string;
}

export const MetaUpdater: React.FC<MetaUpdaterProps> = ({ 
  title, 
  description = "Interactive learning platform for Senior Rust Engineers.", 
  image = "https://rust-patterns.app/og-image.png" 
}) => {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = `${title} | Rust.Hub`;
    document.title = fullTitle;

    // 2. Helper to update meta tags safely
    const setMeta = (selector: string, value: string) => {
        let el = document.querySelector(selector);
        if (!el) {
            // Create if missing (simplified for client-side mainly)
            el = document.createElement('meta');
            const parts = selector.split('['); // simple parse 'name="foo"'
            if (parts.length > 1) {
                const attr = parts[1].split('=');
                const key = attr[0];
                const val = attr[1].replace(']', '').replace(/"/g, '');
                el.setAttribute(key, val);
                document.head.appendChild(el);
            }
        }
        el.setAttribute('content', value);
    };

    // 3. Update Standard Meta
    setMeta('meta[name="description"]', description);

    // 4. Update Open Graph (Facebook/LinkedIn)
    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:image"]', image);
    setMeta('meta[property="og:url"]', window.location.href);

    // 5. Update Twitter
    setMeta('meta[property="twitter:title"]', fullTitle);
    setMeta('meta[property="twitter:description"]', description);
    setMeta('meta[property="twitter:image"]', image);

  }, [title, description, image]);

  return null; // Headless component
};
