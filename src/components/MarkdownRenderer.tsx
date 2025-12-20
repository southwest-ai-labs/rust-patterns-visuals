
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { MermaidDiagram } from './MermaidDiagram';
import { MemoryVisualizer } from './MemoryVisualizer';
import { ShaderLab } from './ShaderLab';
import { PerformanceComparator } from './PerformanceComparator';
import { EcosystemBlueprint } from './EcosystemBlueprint';
import { VTableVisualizer } from './VTableVisualizer';
import { OptimizationLab } from './OptimizationLab';
import { SimdVisualizer } from './SimdVisualizer';
import { ZkCircuitLab } from './ZkCircuitLab';
import { AgenticWorkflow } from './AgenticWorkflow';
import { ZeroCopyVisualizer } from './ZeroCopyVisualizer';
import { RollbackSimulator } from './RollbackSimulator';
import { MevMitigationVisualizer } from './MevMitigationVisualizer';
import { WasmNeuralEngine } from './WasmNeuralEngine';
import { IncidentWarRoom } from './IncidentWarRoom';
import { LockFreeVisualizer } from './LockFreeVisualizer';
import { FfiBridgeVisualizer } from './FfiBridgeVisualizer';
import { CareerMatrix } from './CareerMatrix';
import { RustVsWorldVisualizer } from './RustVsWorldVisualizer';
import { WorkStealingVisualizer } from './WorkStealingVisualizer';
import { ArchitectureWorkbench } from './ArchitectureWorkbench';
import { LockFreeQueueSimulator } from './LockFreeQueueSimulator';
import { CrossLanguageFFIBenchmark } from './CrossLanguageFFIBenchmark';
import { ProcMacroLab } from './ProcMacroLab';
import { CorporateVault } from './CorporateVault';
import { JobPipeline } from './JobPipeline';
import { LoomVisualizer } from './LoomVisualizer';
import { SignalVisualizer } from './SignalVisualizer';
import { RegisterHUD } from './RegisterHUD';
import { RefactorLab } from './RefactorLab';
import { SwarmMonitor } from './SwarmMonitor';
import { ProtocolLab } from './ProtocolLab';
import { ReplayLab } from './ReplayLab';
import { KernelVisualizer } from './KernelVisualizer';
import { MicroVMLab } from './MicroVMLab';
import { WasmOrchestrator } from './WasmOrchestrator';
import { FlameVisualizer } from './FlameVisualizer';
import { AllocTracker } from './AllocTracker';
import { AsmLab } from './AsmLab';
import { NumaVisualizer } from './NumaVisualizer';
import { ModelViz } from './ModelViz';
import { LatticeViz } from './LatticeViz';
import { DepGraphViz } from './DepGraphViz';
import { MacroSandbox } from './MacroSandbox';
import { MeshViz } from './MeshViz';
import { QuorumLab } from './QuorumLab';
import { EbpfViz } from './EbpfViz';
import { EnclaveViz } from './EnclaveViz';
import { UringViz } from './UringViz';
import { IdentityViz } from './IdentityViz';
import { CrdtViz } from './CrdtViz';
import { MirViz } from './MirViz';
import { DspViz } from './DspViz';
import { HotSwapViz } from './HotSwapViz';
import { UserProgress } from '../types';

interface MarkdownRendererProps {
  content: string;
  onRunCode?: (code: string) => void;
  userProgress?: UserProgress;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, onRunCode, userProgress }) => {
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  useEffect(() => {
    if (window.Prism) {
      setTimeout(() => window.Prism.highlightAll(), 100); 
    }
  }, [content]); 

  const handleCopyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedBlock(id);
      setTimeout(() => setCopiedBlock(null), 2000);
    } catch (err) {}
  };

  return (
    <div className="markdown-content">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeString = String(children).replace(/\n$/, '');
            const blockId = codeString.substring(0, 20); 

            if (!inline && language === 'mermaid') return <MermaidDiagram chart={codeString} />;
            if (!inline && language === 'perf-analyzer') return <PerformanceComparator />;
            if (!inline && language === 'eco-blueprint') return <EcosystemBlueprint />;
            if (!inline && language === 'vtable-viz') return <VTableVisualizer />;
            if (!inline && language === 'opt-lab') return <OptimizationLab />;
            if (!inline && language === 'simd-viz') return <SimdVisualizer />;
            if (!inline && language === 'zk-lab') return <ZkCircuitLab />;
            if (!inline && language === 'agent-flow') return <AgenticWorkflow />;
            if (!inline && language === 'zero-copy') return <ZeroCopyVisualizer />;
            if (!inline && language === 'rollback-sim') return <RollbackSimulator />;
            if (!inline && language === 'mev-viz') return <MevMitigationVisualizer />;
            if (!inline && language === 'wasm-neural') return <WasmNeuralEngine />;
            if (!inline && language === 'war-room') return <IncidentWarRoom />;
            if (!inline && language === 'lock-free') return <LockFreeVisualizer />;
            if (!inline && language === 'lock-free-queue') return <LockFreeQueueSimulator />;
            if (!inline && language === 'ffi-bench') return <CrossLanguageFFIBenchmark />;
            if (!inline && language === 'ffi-bridge') return <FfiBridgeVisualizer />;
            if (!inline && language === 'career-matrix') return <CareerMatrix progress={userProgress || { history: [], totalMMR: 0, lastActive: 0, currentStreak: 0, isProEnabled: false }} />;
            if (!inline && language === 'rust-vs-world') return <RustVsWorldVisualizer />;
            if (!inline && language === 'tokio-sim') return <WorkStealingVisualizer />;
            if (!inline && language === 'arch-workbench') return <ArchitectureWorkbench />;
            if (!inline && language === 'proc-macro-lab') return <ProcMacroLab />;
            if (!inline && language === 'corp-vault') return <CorporateVault userMMR={userProgress?.totalMMR || 0} />;
            if (!inline && language === 'job-pipeline') return <JobPipeline userMMR={userProgress?.totalMMR || 0} />;
            if (!inline && language === 'loom-viz') return <LoomVisualizer />;
            if (!inline && language === 'leptos-signals') return <SignalVisualizer />;
            if (!inline && language === 'embedded-hud') return <RegisterHUD />;
            if (!inline && language === 'refactor-lab') return <RefactorLab />;
            if (!inline && language === 'swarm-monitor') return <SwarmMonitor />;
            if (!inline && language === 'protocol-lab') return <ProtocolLab />;
            if (!inline && language === 'replay-lab') return <ReplayLab />;
            if (!inline && language === 'kernel-viz') return <KernelVisualizer />;
            if (!inline && language === 'micro-vm-lab') return <MicroVMLab />;
            if (!inline && language === 'wasm-orchestrator') return <WasmOrchestrator />;
            if (!inline && language === 'flame-viz') return <FlameVisualizer />;
            if (!inline && language === 'alloc-tracker') return <AllocTracker />;
            if (!inline && language === 'asm-lab') return <AsmLab />;
            if (!inline && language === 'numa-viz') return <NumaVisualizer />;
            if (!inline && language === 'model-viz') return <ModelViz />;
            if (!inline && language === 'lattice-viz') return <LatticeViz />;
            if (!inline && language === 'dep-graph-viz') return <DepGraphViz />;
            if (!inline && language === 'macro-sandbox') return <MacroSandbox />;
            if (!inline && language === 'mesh-viz') return <MeshViz />;
            if (!inline && language === 'quorum-lab') return <QuorumLab />;
            if (!inline && language === 'ebpf-viz') return <EbpfViz />;
            if (!inline && language === 'enclave-viz') return <EnclaveViz />;
            if (!inline && language === 'uring-viz') return <UringViz />;
            if (!inline && language === 'identity-viz') return <IdentityViz />;
            if (!inline && language === 'crdt-viz') return <CrdtViz />;
            if (!inline && language === 'mir-viz') return <MirViz />;
            if (!inline && language === 'dsp-viz') return <DspViz />;
            if (!inline && language === 'hotswap-viz') return <HotSwapViz />;
            
            if (!inline && language === 'visualizer') {
                try {
                    const data = JSON.parse(codeString);
                    return <MemoryVisualizer data={data} />;
                } catch (e) { return <div>Invalid Viz Data</div>; }
            }

            if (!inline && language === 'shader-lab') return <ShaderLab initialCode={codeString} />;

            if (!inline && match) {
              return (
                <div className="relative group my-8 rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl bg-slate-950">
                   <div className="flex justify-between items-center bg-slate-900/80 px-4 py-2 border-b border-slate-800">
                       <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{language}</span>
                       <div className="flex items-center gap-3">
                         <button onClick={() => handleCopyCode(codeString, blockId)} className="text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">
                            {copiedBlock === blockId ? 'COPIED' : 'COPY'}
                         </button>
                         {language === 'rust' && (
                             <button onClick={() => onRunCode?.(codeString)} className="px-3 py-1 bg-orange-600/20 text-orange-400 text-[10px] font-black rounded uppercase border border-orange-500/30 transition-all hover:bg-orange-600 hover:text-white">RUN</button>
                         )}
                       </div>
                   </div>
                   <pre className={`${className} !m-0 !rounded-none !bg-transparent`} style={{ margin: 0 }}>
                      <code className={`${className} !font-fira`} {...props}>{children}</code>
                   </pre>
                </div>
              );
            }
            return <code className={className} {...props}>{children}</code>;
          },
          blockquote({ node, children, ...props }: any) {
            let isGem = false;
            const fullText = React.Children.toArray(children).join('');
            if (fullText.includes('💎') || fullText.includes('Pro Tip')) isGem = true;
            
            if (isGem) {
                return (
                    <div className="gem-block group">
                        <div className="gem-icon group-hover:rotate-12 transition-all">💎</div>
                        <span className="gem-title">The Rustacean Gem</span>
                        {children}
                    </div>
                );
            }
            return <blockquote className="border-l-4 border-slate-700 pl-4 italic text-slate-500 my-8 bg-slate-900/30 p-4 rounded-r" {...props}>{children}</blockquote>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
