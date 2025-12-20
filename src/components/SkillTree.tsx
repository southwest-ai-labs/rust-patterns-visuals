
import React, { useMemo } from 'react';
import { CURRICULUM } from '../constants';
import { UserProgress } from '../types';

interface SkillTreeProps {
  progress: UserProgress;
  onSelectLesson: (id: string) => void;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ progress, onSelectLesson }) => {
  const completedSet = new Set(progress.history.filter(h => h.type === 'lesson').map(h => h.itemId));

  const layout = useMemo(() => {
      const nodes: any[] = [];
      const edges: any[] = [];
      const columnWidth = 200;
      const rowHeight = 120;
      const startX = 100;
      const startY = 50;

      CURRICULUM.tracks.forEach((track, colIdx) => {
          track.lessons.forEach((lesson, rowIdx) => {
              const x = startX + (colIdx * columnWidth);
              const y = startY + (rowIdx * rowHeight) + (colIdx % 2 === 0 ? 0 : 60); 
              
              const isCompleted = completedSet.has(lesson.id);
              let isLocked = false;
              if (rowIdx > 0 && !completedSet.has(track.lessons[rowIdx - 1].id)) isLocked = true;

              nodes.push({
                  id: lesson.id,
                  x,
                  y,
                  title: lesson.title,
                  difficulty: lesson.difficulty,
                  status: isCompleted ? 'completed' : isLocked ? 'locked' : 'available',
                  trackId: track.id
              });

              if (rowIdx > 0) {
                  const prevId = track.lessons[rowIdx - 1].id;
                  const prevNode = nodes.find(n => n.id === prevId);
                  if (prevNode) {
                      edges.push({ x1: prevNode.x, y1: prevNode.y, x2: x, y2: y, status: isCompleted ? 'active' : 'dim' });
                  }
              }
          });
      });

      return { nodes, edges };
  }, [completedSet]);

  const getStatusColor = (status: string, difficulty: string) => {
      if (status === 'locked') return '#334155';
      if (status === 'completed') return '#10b981';
      switch(difficulty) {
          case 'Beginner': return '#3b82f6';
          case 'Intermediate': return '#f59e0b';
          case 'Rustacean': return '#ef4444';
          default: return '#cbd5e1';
      }
  };

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-3xl relative overflow-hidden h-[600px]">
        <div className="absolute top-4 left-6 z-10 pointer-events-none">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Neural Map</h3>
            <p className="text-[10px] text-slate-500 font-mono">CURRICULUM_DEPENDENCY_GRAPH</p>
        </div>
        
        {/* Scrollable Container with Touch Scrolling support */}
        <div className="w-full h-full overflow-auto custom-scrollbar touch-pan-x touch-pan-y">
            <div className="min-w-[1200px] min-h-[800px] p-10">
                <svg width="100%" height="100%" className="overflow-visible">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
                        </marker>
                        <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                        </marker>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    {layout.edges.map((edge, i) => (
                        <line 
                            key={i}
                            x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2}
                            stroke={edge.status === 'active' ? '#10b981' : '#334155'}
                            strokeWidth="2"
                            markerEnd={`url(#arrowhead${edge.status === 'active' ? '-active' : ''})`}
                            strokeDasharray={edge.status === 'dim' ? '5,5' : 'none'}
                            className="transition-all duration-500"
                        />
                    ))}

                    {layout.nodes.map((node) => (
                        <g 
                            key={node.id} 
                            transform={`translate(${node.x},${node.y})`} 
                            onClick={() => node.status !== 'locked' && onSelectLesson(node.id)}
                            className={`cursor-pointer transition-all duration-300 ${node.status === 'locked' ? 'opacity-50' : 'hover:scale-110'}`}
                        >
                            <path 
                                d="M0 -25 L22 -12 L22 13 L0 26 L-22 13 L-22 -12 Z" 
                                fill={node.status === 'locked' ? '#0f172a' : '#1e293b'}
                                stroke={getStatusColor(node.status, node.difficulty)}
                                strokeWidth={node.status === 'completed' ? 3 : 2}
                                filter={node.status === 'available' ? 'url(#glow)' : ''}
                            />
                            
                            {node.status === 'completed' && (
                                <text x="0" y="5" textAnchor="middle" fontSize="14" fill="#10b981">✓</text>
                            )}
                            {node.status === 'locked' && (
                                <text x="0" y="5" textAnchor="middle" fontSize="12" fill="#475569">🔒</text>
                            )}

                            <foreignObject x="-60" y="35" width="120" height="50">
                                <div className={`text-[9px] text-center font-bold uppercase leading-tight ${node.status === 'completed' ? 'text-emerald-400' : 'text-slate-400'}`}>
                                    {node.title}
                                </div>
                            </foreignObject>
                        </g>
                    ))}
                </svg>
            </div>
        </div>
        
        {/* Mobile Scroll Hint */}
        <div className="absolute bottom-4 right-4 bg-slate-900/80 px-3 py-1 rounded-full text-[9px] text-slate-400 font-mono pointer-events-none md:hidden">
            Drag to pan ↔
        </div>
    </div>
  );
};
