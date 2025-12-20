
import React, { useEffect, useRef, useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

interface ShaderLabProps {
  initialCode?: string;
}

export const ShaderLab: React.FC<ShaderLabProps> = ({ initialCode = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [code, setCode] = useState(initialCode || `// WGSL Shader Lab Simulation
// Output color: red, green, blue, alpha
fn main() {
    let uv = get_uv();
    let color = vec4(uv.x, uv.y, 0.5 + 0.5 * sin(time), 1.0);
    set_pixel(color);
}`);
  const [error, setError] = useState<string | null>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const time = (Date.now() - startTimeRef.current) / 1000;
      const width = canvas.width;
      const height = canvas.height;
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      try {
        const colorMatch = code.match(/vec4\(([^)]+)\)/);
        let rFunc = (x: number, y: number, t: number) => x;
        let gFunc = (x: number, y: number, t: number) => y;
        let bFunc = (x: number, y: number, t: number) => 0.5 + 0.5 * Math.sin(t);

        if (colorMatch) {
            const parts = colorMatch[1].split(',').map(p => p.trim());
            if (parts[0].includes('sin')) rFunc = (x, y, t) => 0.5 + 0.5 * Math.sin(t + x * 5);
            if (parts[1].includes('cos')) gFunc = (x, y, t) => 0.5 + 0.5 * Math.cos(t + y * 5);
            if (parts[2].includes('uv.x')) bFunc = (x, y, t) => x;
        }

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const uvX = x / width;
            const uvY = y / height;

            data[index] = rFunc(uvX, uvY, time) * 255;
            data[index + 1] = gFunc(uvX, uvY, time) * 255;
            data[index + 2] = bFunc(uvX, uvY, time) * 255;
            data[index + 3] = 255;
          }
        }
        ctx.putImageData(imageData, 0, 0);
        setError(null);
      } catch (e) {
        setError("Shader Simulation Error: Invalid Logic");
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [code]);

  return (
    <div className="my-10 bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[500px]">
      <div className="flex-1 flex flex-col border-r border-slate-800">
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest font-mono">WGPU_SHADER_SOURCE</span>
            <span className="text-[10px] text-slate-500 font-mono">WGSL v1.0</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="flex-1 bg-black text-emerald-400 font-mono text-sm p-4 outline-none resize-none leading-relaxed"
        />
        {error && (
            <div className="bg-red-950/50 p-2 text-[10px] text-red-400 font-mono border-t border-red-900/30">
                {error}
            </div>
        )}
      </div>

      <div className="w-full md:w-[400px] bg-black flex flex-col">
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest font-mono">GPU_OUTPUT_BUFFER</span>
            <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
            </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
            <canvas 
                ref={canvasRef} 
                width={256} 
                height={256} 
                className="w-full aspect-square max-w-[300px] rounded shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-slate-800"
            />
        </div>
        <div className="p-4 bg-slate-950/50 text-[10px] text-slate-500 font-mono italic">
            <T>Rendering at 60FPS via simulated cross-platform pipeline.</T>
        </div>
      </div>
    </div>
  );
};
