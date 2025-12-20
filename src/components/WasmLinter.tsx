
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface LinterError {
  line: number;
  message: string;
  type: 'Borrow' | 'Move' | 'Lifetime' | 'Soundness';
}

interface WasmLinterProps {
  code: string;
  onUpdateErrors: (errors: LinterError[]) => void;
}

export const WasmLinter: React.FC<WasmLinterProps> = ({ code, onUpdateErrors }) => {
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (code.length > 20) analyzeCode();
    }, 1500); // Debounce
    return () => clearTimeout(timer);
  }, [code]);

  const analyzeCode = async () => {
    setAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Act as the Rust Borrow Checker. Analyze this code for memory safety errors (Moves, Borrow violations, Lifetimes). Return JSON: { errors: [{line: number, message: string, type: string}] }. If no errors, return empty array. Code: \n ${code}`;
      
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(result.text || '{"errors":[]}');
      onUpdateErrors(data.errors);
    } catch (e) {
      console.error("Linter Link Failed", e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (analyzing ? (
    <div className="absolute top-2 right-4 flex items-center gap-2 text-[9px] font-mono text-orange-500 animate-pulse">
      <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
      WASM_BORROW_CHECKER_ACTIVE
    </div>
  ) : null);
};
