"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X, Minus } from "lucide-react";
import terminalData from "@/data/terminal.json";
import { useTerminalStore } from "@/store/terminal-store";

interface TerminalProps {
  onClose?: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ onClose }) => {
  const { isMinimized, setMinimized, closeTerminal } = useTerminalStore();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [history, setHistory] = useState<{ type: "cmd" | "out"; text: string | React.ReactNode }[]>([
    { type: "out", text: "Welcome to Kali Linux XFCE Terminal" },
    { type: "out", text: 'Type "help" to see available commands.' },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "l") {
        e.preventDefault();
        setHistory([]);
      }
    };

    const inputEl = inputRef.current;
    if (inputEl) {
      inputEl.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      if (inputEl) {
        inputEl.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, []);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const newHistory = [...history, { type: "cmd" as const, text: cmd }];

    switch (trimmedCmd) {
      case "help":
        newHistory.push({
          type: "out",
          text: "Available commands:\n  help     - Show this help\n  whoami   - Current user info\n  info     - About S M Masrafi\n  projects - View recent projects\n  skills   - Show skills in JSON format\n  socials  - Social media links\n  contact  - Contact information\n  date     - Current date and time\n  clear    - Clear the terminal history\n  ls       - List files and directories",
        });
        break;
      case "whoami":
        newHistory.push({
          type: "out",
          text: `User: ${terminalData.whoami.user}\nHost: ${terminalData.whoami.host}\nOS: ${terminalData.whoami.os}\nUptime: ${terminalData.whoami.uptime}`,
        });
        break;
      case "info":
        newHistory.push({
          type: "out",
          text: `Name: ${terminalData.personal.name}\nRole: ${terminalData.personal.role}\nLocation: ${terminalData.personal.location}\nBio: ${terminalData.personal.bio}`,
        });
        break;
      case "projects":
        newHistory.push({
          type: "out",
          text: (
            <div className="space-y-2">
              {terminalData.projects.map((p, i) => (
                <div key={i} className="border-l-2 border-primary/30 pl-3">
                  <div className="font-bold text-primary">{p.name}</div>
                  <div className="text-xs text-gray-400">{p.description}</div>
                  <div className="text-xs text-blue-400 italic">{p.tech.join(", ")}</div>
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-xs text-green-400 hover:underline">View Project</a>
                </div>
              ))}
            </div>
          ),
        });
        break;
      case "skills":
      case "cd skills":
        newHistory.push({
          type: "out",
          text: <pre className="text-xs text-blue-300">{JSON.stringify(terminalData.skills, null, 2)}</pre>,
        });
        break;
      case "socials":
        newHistory.push({
          type: "out",
          text: (
            <div className="flex flex-col gap-1">
              {terminalData.socials.map((s, i) => (
                <div key={i}>
                  <span className="text-primary font-bold">{s.platform}:</span>{" "}
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{s.url}</a>
                </div>
              ))}
            </div>
          ),
        });
        break;
      case "contact":
        newHistory.push({
          type: "out",
          text: `Email: ${terminalData.contact.email}\nPhone: ${terminalData.contact.phone}\nAddress: ${terminalData.contact.address}`,
        });
        break;
      case "date":
        newHistory.push({
          type: "out",
          text: new Date().toLocaleString(),
        });
        break;
      case "clear":
        setHistory([]);
        return;
      case "ls":
        newHistory.push({
          type: "out",
          text: "bio.txt  projects/  skills.json  socials.lnk  whoami.cfg",
        });
        break;
      case "":
        break;
      default:
        newHistory.push({
          type: "out",
          text: `Command not found: ${cmd}. Type "help" for a list of commands.`,
        });
    }

    setHistory(newHistory);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput("");
  };

  if (!mounted || isMinimized) return null;

  return createPortal(
    <>
      {/* Constraints Container - Fills the viewport to restrict dragging */}
      <div 
        ref={containerRef} 
        className="fixed inset-0 pointer-events-none z-9998" 
      />
      
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        className={`fixed z-9999 bg-[#1a1a1a] rounded-lg border border-[#333] shadow-2xl overflow-hidden flex flex-col font-mono text-sm leading-relaxed w-[90vw] max-w-[700px] h-[450px] top-[15vh] md:left-[calc(50vw-350px)] left-[5vw]`}
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Kali XFCE Title Bar - Buttons on the Left */}
        <div className="terminal-header bg-[#2a2a2a] px-4 py-2 flex items-center justify-between border-b border-[#333] cursor-grab active:cursor-grabbing select-none">
          <div className="flex items-center gap-2">
            <div className="flex gap-2 mr-3">
              <button 
                onClick={() => { closeTerminal(); if(onClose) onClose(); }}
                className="size-4.5 rounded-full bg-[#ff5555] hover:bg-[#ff6e6e] flex items-center justify-center group cursor-pointer"
              >
                <X className="size-3.5 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button 
                onClick={() => setMinimized(true)}
                className="size-4.5 rounded-full bg-[#ffb86c] hover:bg-[#ffca85] flex items-center justify-center group cursor-pointer"
              >
                <Minus className="size-3.5   text-black opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
            <span className="text-[11px] text-gray-400 font-medium font-mono uppercase tracking-tight">kali@masrafi: ~</span>
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold opacity-30 font-mono">XFCE Terminal</div>
        </div>

        {/* Terminal Content */}
        <div 
          ref={scrollRef}
          className="flex-1 p-4 overflow-y-auto bg-[#1a1a1a]/97 backdrop-blur-md custom-scrollbar"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="space-y-1">
            {history.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap wrap-break-word">
                {line.type === "cmd" ? (
                  <div className="flex flex-col mb-1 animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">┌──(</span>
                      <span className="text-blue-500 font-bold">kali㉿masrafi</span>
                      <span className="text-green-500 font-bold">)-[</span>
                      <span className="text-white font-bold">~</span>
                      <span className="text-green-500 font-bold">]</span>
                    </div>
                    <div className="flex items-center gap-2 pl-1">
                      <span className="text-green-500 font-bold">└─</span>
                      <span className="text-blue-500 font-bold">$</span>
                      <span className="text-white">{line.text}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-300 pl-1 mb-2 animate-in fade-in duration-500">{line.text}</div>
                )}
              </div>
            ))}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-1 mt-2">
               <div className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">┌──(</span>
                    <span className="text-blue-500 font-bold">kali㉿masrafi</span>
                    <span className="text-green-500 font-bold">)-[</span>
                    <span className="text-white font-bold">~</span>
                    <span className="text-green-500 font-bold">]</span>
                  </div>
              <div className="flex items-center gap-2 pl-1">
                  <span className="text-green-500 font-bold">└─</span>
                  <span className="text-blue-500 font-bold">$</span>
                  <input
                      ref={inputRef}
                      autoFocus
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder:opacity-30"
                      spellCheck={false}
                      autoComplete="off"
                  />
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </>,
    document.body
  );
};

export default Terminal;
