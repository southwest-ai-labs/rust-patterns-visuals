
import React from 'react';
import { MermaidDiagram } from './MermaidDiagram';
import { T } from '../hooks/useChromeTranslation';

interface Blueprint {
    id: string;
    title: string;
    chart: string;
}

const BLUEPRINTS: Blueprint[] = [
    {
        id: 'web_stack',
        title: 'Modern Web Service Stack',
        chart: `
graph TD
    User([HTTP Client]) --> Axum[Axum Framework]
    Axum --> Tower[Tower Middleware]
    Tower --> Hyper[Hyper HTTP/2 Engine]
    Hyper --> Tokio[Tokio Async Runtime]
    Axum -.-> Serde[Serde JSON]
    Axum -.-> SQLx[SQLx DB]
    
    style Axum fill:#f97316,color:#fff
    style Tokio fill:#0ea5e9,color:#fff
    style User fill:#334155,color:#fff
        `
    },
    {
        id: 'game_stack',
        title: 'Game Engine & Graphics',
        chart: `
graph LR
    App[Game Logic] --> Bevy[Bevy ECS]
    Bevy --> WGPU[WGPU Graphics]
    WGPU --> Vulkan[Vulkan]
    WGPU --> Metal[Metal]
    WGPU --> DX12[DirectX 12]
    
    style Bevy fill:#8b5cf6,color:#fff
    style WGPU fill:#ec4899,color:#fff
        `
    }
];

export const EcosystemBlueprint: React.FC = () => {
  return (
    <div className="my-10 space-y-12">
        {BLUEPRINTS.map(bp => (
            <div key={bp.id} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 overflow-hidden group">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">{bp.title}</h3>
                </div>
                <div className="bg-black/30 rounded-2xl border border-slate-800/50 p-4">
                    <MermaidDiagram chart={bp.chart} />
                </div>
                <div className="mt-4 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <T>Architectural blueprint for production-ready Rust services.</T>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">VERIFIED_BY_RUST_HUB</span>
                </div>
            </div>
        ))}
    </div>
  );
};
