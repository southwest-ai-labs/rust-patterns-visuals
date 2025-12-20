import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    mermaid: any;
  }
}

interface MermaidDiagramProps {
  chart: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const renderChart = async () => {
      if (!window.mermaid) {
        // Retry if script hasn't loaded yet
        setTimeout(renderChart, 500);
        return;
      }

      try {
        window.mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          fontFamily: 'Inter',
        });

        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await window.mermaid.render(id, chart);
        setSvg(svg);
        setError(false);
      } catch (e) {
        console.error('Mermaid render error:', e);
        setError(true);
      }
    };

    renderChart();
  }, [chart]);

  if (error) return <div className="text-red-400 text-sm p-4 border border-red-900 rounded bg-red-900/20">Failed to render diagram</div>;

  return (
    <div 
      ref={ref}
      className="mermaid-container flex justify-center p-6 my-6 bg-slate-800/50 rounded-lg border border-slate-700 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};
