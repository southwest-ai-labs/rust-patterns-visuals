
import { GoogleGenAI, Modality } from "@google/genai";
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface Message {
  role: 'user' | 'model';
  text: string;
  sources?: { uri: string; title: string }[];
}

interface AiTutorProps {
  currentContext: string;
  lessonTitle: string;
  model: string;
  onOpenSettings: () => void;
}

// Audio Utils
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const AiTutor: React.FC<AiTutorProps> = ({ currentContext, lessonTitle, model, onOpenSettings }) => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
      setMessages([{ role: 'model', text: t('tutor_welcome') }]);
  }, [lessonTitle, language]);

  const handleSpeak = async (text: string, index: number) => {
      const hasKey = await window.aistudio?.hasSelectedApiKey();
      if (!hasKey || isPlaying !== null) return;
      setIsPlaying(index);

      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
              model: "gemini-2.5-flash-preview-tts",
              contents: [{ parts: [{ text: text }] }],
              config: {
                  responseModalities: [Modality.AUDIO],
                  speechConfig: {
                      voiceConfig: {
                          prebuiltVoiceConfig: { voiceName: language === 'es' ? 'Charon' : 'Kore' }, 
                      },
                  },
              },
          });

          const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          
          if (base64Audio) {
              if (!audioContextRef.current) {
                  audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
              }
              const ctx = audioContextRef.current;
              if (ctx.state === 'suspended') await ctx.resume();

              const outputNode = ctx.createGain();
              const audioBuffer = await decodeAudioData(
                  decode(base64Audio),
                  ctx,
                  24000,
                  1
              );
              
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);
              outputNode.connect(ctx.destination);
              
              source.onended = () => setIsPlaying(null);
              source.start();
          } else {
              setIsPlaying(null);
          }

      } catch (error) {
          console.error("TTS Error:", error);
          setIsPlaying(null);
      }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const hasKey = await window.aistudio?.hasSelectedApiKey();
    if (!hasKey) {
        setMessages(prev => [...prev, { role: 'model', text: language === 'es' ? "Por favor, selecciona una API Key en Ajustes para habilitar al Tutor." : "Please select an API Key in Settings to enable the AI Tutor." }]);
        return;
    }

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemPrompt = `
        You are Ferris, an expert Rust tutor crab. 
        You are helpful, concise, and use Rust metaphors.
        CURRENT_LANGUAGE: ${language === 'es' ? 'SPANISH' : 'ENGLISH'}.
        User's current lesson: "${lessonTitle}".
        
        Content for context:
        ---
        ${currentContext} 
        ---
        
        Respond ALWAYS in ${language === 'es' ? 'SPANISH' : 'ENGLISH'}.
        If the question requires external knowledge (e.g. specific crate versions, recent Rust updates), use your search tool.
        Keep answers short and encouraging. In Spanish, use a technical but friendly tone.
      `;

      const response = await ai.models.generateContent({
        model: model || 'gemini-3-flash-preview', 
        contents: systemPrompt + "\n\nUser Question: " + userMsg,
        config: {
            tools: [{ googleSearch: {} }] 
        }
      });

      const text = response.text;
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const sources: { uri: string; title: string }[] = [];
      
      if (groundingChunks) {
          groundingChunks.forEach((chunk: any) => {
              if (chunk.web) {
                  sources.push({ uri: chunk.web.uri, title: chunk.web.title });
              }
          });
      }

      const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());
      setMessages(prev => [...prev, { role: 'model', text: text || "...", sources: uniqueSources }]);

    } catch (error: any) {
      console.error("AI Error:", error);
      let errorMsg = language === 'es' ? "Burbujas... mi conexión con el océano es débil." : "Bubbles... My connection to the ocean is weak.";
      setMessages(prev => [...prev, { role: 'model', text: `${errorMsg}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className="pointer-events-auto mb-4 w-80 md:w-96 h-[500px] flex flex-col bg-slate-900/95 backdrop-blur-xl border border-orange-500/30 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in origin-bottom-right">
          <div className="p-3 bg-gradient-to-r from-orange-600 to-orange-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <span className="text-xl">🦀</span>
                <span className="font-bold text-white text-sm">Ferris AI Tutor</span>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={onOpenSettings} title={t('settings')} className="text-white/80 hover:text-white">⚙️</button>
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="flex flex-col gap-1 max-w-[85%]">
                    <div 
                      className={`rounded-lg p-3 text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-orange-600/20 border border-orange-500/30 text-orange-100 rounded-br-none' 
                          : 'bg-slate-800/80 border border-slate-700 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {msg.text.split('`').map((part, i) => 
                        i % 2 === 1 ? <code key={i} className="bg-black/30 px-1 rounded font-mono text-orange-300">{part}</code> : part
                      )}
                    </div>
                    {msg.sources && msg.sources.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                            {msg.sources.map((src, i) => (
                                <a 
                                    key={i} href={src.uri} target="_blank" rel="noreferrer" 
                                    className="text-[9px] bg-blue-900/30 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full hover:bg-blue-900/50 hover:text-white transition-colors truncate max-w-full"
                                >
                                    🔍 {src.title}
                                </a>
                            ))}
                        </div>
                    )}
                    {msg.role === 'model' && msg.text && (
                        <button 
                            onClick={() => handleSpeak(msg.text, idx)}
                            disabled={isPlaying !== null}
                            className={`self-start text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 transition-colors ${
                                isPlaying === idx ? 'text-green-400 animate-pulse' : 'text-slate-500 hover:text-orange-400'
                            }`}
                        >
                            {isPlaying === idx ? '🔊 ...' : '🔈 Audio'}
                        </button>
                    )}
                </div>
              </div>
            ))}
            {isLoading && (
                 <div className="flex justify-start">
                    <div className="bg-slate-800/80 p-3 rounded-lg rounded-bl-none text-slate-400 text-xs italic flex items-center gap-2">
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                        {t('thinking')}
                    </div>
                 </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-slate-950/50 border-t border-slate-800">
            <div className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t('tutor_placeholder')}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 pl-3 pr-10 text-sm text-white focus:outline-none focus:border-orange-500"
                />
                <button 
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-1 top-1 p-1.5 text-orange-500 hover:text-orange-400 disabled:opacity-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto group relative flex items-center justify-center w-14 h-14 bg-orange-600 hover:bg-orange-500 text-white rounded-full shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-orange-400/50"
      >
         {isOpen ? (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
             </svg>
         ) : (
            <span className="text-2xl animate-pulse">🦀</span>
         )}
      </button>
    </div>
  );
};
