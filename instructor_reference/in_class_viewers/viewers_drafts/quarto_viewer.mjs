import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  Maximize, 
  Layout, 
  Type, 
  Monitor, 
  Settings, 
  Code, 
  FileText, 
  PanelLeftClose, 
  PanelLeftOpen, 
  X, 
  Minimize, 
  Search, 
  Grid, 
  LogOut,
  Image as ImageIcon,
  Video,
  ExternalLink,
  AlertCircle,
  PlayCircle,
  Globe,
  MessageSquareText,
  Clock
} from 'lucide-react';

/**
 * Robust Inline Parser
 * Converts markdown-style inline syntax into a React component tree.
 * This replaces dangerouslySetInnerHTML for better security.
 */
const SafeInlineContent = ({ text, mini }) => {
  if (!text) return null;

  // Split text by tokens for bold, italics, code, and links
  const tokens = text.split(/(\*\*\*.*?\*\*\*|\*\*.*?\*\*|__.*?__|ReservedWord|(?<!\!)\[.*?\]\(.*?\)|`.*?`|\*.*?\*|_.*?_)/g);

  return (
    <span>
      {tokens.map((token, i) => {
        if (!token) return null;

        // Bold Italics
        if (token.startsWith('***') && token.endsWith('***')) {
          return <strong key={i}><em>{token.slice(3, -3)}</em></strong>;
        }
        // Bold
        if ((token.startsWith('**') && token.endsWith('**')) || (token.startsWith('__') && token.endsWith('__'))) {
          return <strong key={i}>{token.slice(2, -2)}</strong>;
        }
        // Italics
        if ((token.startsWith('*') && token.endsWith('*')) || (token.startsWith('_') && token.endsWith('_'))) {
          return <em key={i}>{token.slice(1, -1)}</em>;
        }
        // Inline Code
        if (token.startsWith('`') && token.endsWith('`')) {
          return (
            <code key={i} className="bg-[#eceff4] px-1.5 py-0.5 rounded font-mono text-[0.85em] text-[#bf616a]">
              {token.slice(1, -1)}
            </code>
          );
        }
        // Links
        const linkMatch = token.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          return (
            <a 
              key={i} 
              href={linkMatch[2]} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#81a1c1] underline hover:text-[#5e81ac]"
            >
              {linkMatch[1]}
            </a>
          );
        }

        return token;
      })}
    </span>
  );
};

/**
 * Smart Video Player
 * Handles YouTube, Vimeo, and local MP4s with a click-to-load pattern.
 */
const SmartVideoPlayer = ({ url, alt, mini }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const getYouTubeId = (inputUrl) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = inputUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const ytId = getYouTubeId(url);
  const isVimeo = url.includes('vimeo.com');
  const watchUrl = ytId ? `https://www.youtube.com/watch?v=${ytId}` : url;

  if (mini) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-[#3b4252] text-[#88c0d0]">
        <Video size={24} />
      </div>
    );
  }

  if (!isPlaying) {
    const thumbUrl = ytId 
      ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` 
      : `https://placehold.co/1280x720/3b4252/88c0d0?text=Video+Ready`;
      
    return (
      <div className="relative w-full h-full group/player overflow-hidden rounded-lg shadow-lg border border-[#d8dee9] bg-[#2e3440]">
        <img 
          src={thumbUrl} 
          alt={alt} 
          className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover/player:opacity-70 transition-opacity duration-700" 
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 z-10 p-4">
          <button 
            onClick={() => setIsPlaying(true)} 
            aria-label="Play video"
            className="flex items-center gap-3 px-8 py-4 bg-[#81a1c1] text-white rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold"
          >
            <Play fill="currentColor" size={24} />
            <span>Initialize Player</span>
          </button>
          <a 
            href={watchUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 px-4 py-2 bg-[#4c566a]/80 backdrop-blur-md hover:bg-[#4c566a] text-[#eceff4] rounded-lg transition-all text-xs font-semibold border border-white/10"
          >
            <ExternalLink size={14} />
            <span>Open Video Link</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative rounded-lg shadow-lg border border-[#d8dee9] bg-black overflow-hidden">
      {ytId || isVimeo ? (
        <iframe 
          src={ytId ? `https://www.youtube.com/embed/${ytId}?autoplay=1` : url} 
          className="absolute inset-0 w-full h-full border-0 z-10" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen 
          title={alt} 
        />
      ) : (
        <video 
          src={url} 
          className="absolute inset-0 w-full h-full object-contain z-10" 
          controls 
          autoPlay 
          playsInline 
        />
      )}
      <button 
        onClick={() => setIsPlaying(false)} 
        aria-label="Close player"
        className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

/**
 * SlideRenderer
 * Renders individual slides based on parsed blocks.
 */
const SlideRenderer = memo(({ content, isTitleSlide, isFullscreen, mini = false }) => {
  const parseBlocks = (rawContent) => {
    // Strip Speaker Notes first
    const stripped = rawContent.replace(/::: notes\s*([\s\S]*?)\s*:::/, '').trim();
    const lines = stripped.split('\n');
    const blocks = [];
    let currentBlock = null;

    lines.forEach((line) => {
      const trimmed = line.trim();

      // Image or Video Detection
      const mediaMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (mediaMatch) {
        currentBlock = null;
        const alt = mediaMatch[1];
        const url = mediaMatch[2];
        const isVideo = alt.toLowerCase() === 'video' || 
                        ['.mp4', '.webm', '.mov'].some(ext => url.toLowerCase().endsWith(ext)) || 
                        ['youtube.com', 'youtu.be', 'vimeo.com'].some(d => url.includes(d));
        blocks.push({ type: isVideo ? 'video' : 'image', alt, url });
        return;
      }

      // Table Detection
      if (trimmed.includes('|')) {
        if (!currentBlock || currentBlock.type !== 'table') {
          currentBlock = { type: 'table', rows: [], alignments: [] };
          blocks.push(currentBlock);
        }
        if (trimmed.match(/^[|\s-:]+$/)) {
          // Alignment row detection
          currentBlock.alignments = trimmed.split('|')
            .filter(c => c.trim())
            .map(c => {
              const text = c.trim();
              if (text.startsWith(':') && text.endsWith(':')) return 'center';
              if (text.endsWith(':')) return 'right';
              return 'left';
            });
          return;
        }
        const cells = trimmed.split('|').map(c => c.trim()).filter((c, i, arr) => {
            if (i === 0 && c === '') return false;
            if (i === arr.length - 1 && c === '') return false;
            return true;
        });
        currentBlock.rows.push(cells);
        return;
      }

      // Code Block Detection
      if (line.startsWith('```')) {
        if (!currentBlock || currentBlock.type !== 'code') {
          currentBlock = { type: 'code', lines: [] };
          blocks.push(currentBlock);
        } else {
          currentBlock = null;
        }
        return;
      }

      if (currentBlock && currentBlock.type === 'code') {
        currentBlock.lines.push(line);
        return;
      }

      currentBlock = null;
      if (line.startsWith('# ')) blocks.push({ type: 'h1', text: line.replace('# ', '') });
      else if (line.startsWith('## ')) blocks.push({ type: 'h2', text: line.replace('## ', '') });
      else if (line.startsWith('- ') || line.startsWith('* ')) blocks.push({ type: 'li', text: line.substring(2) });
      else if (line.startsWith('> ')) blocks.push({ type: 'quote', text: line.replace('> ', '') });
      else if (trimmed === '') blocks.push({ type: 'spacer' });
      else blocks.push({ type: 'p', text: line });
    });

    return blocks;
  };

  const blocks = useMemo(() => parseBlocks(content), [content]);

  const textScale = mini ? 'text-[6px]' : (isFullscreen ? 'text-3xl' : 'text-2xl');
  const h1Scale = mini ? 'text-[10px]' : (isFullscreen ? 'text-7xl' : 'text-5xl');
  const h2Scale = mini ? 'text-[8px]' : (isFullscreen ? 'text-5xl' : 'text-4xl');

  return (
    <div className={`w-full h-full flex flex-col ${isTitleSlide ? 'justify-center items-center text-center' : 'justify-start p-6 md:p-12'}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'h1': return <h1 key={idx} className={`${h1Scale} font-bold mb-6 text-[#2e3440] tracking-tight`}><SafeInlineContent text={block.text} /></h1>;
          case 'h2': return <h2 key={idx} className={`${h2Scale} font-semibold mb-6 text-[#3b4252]`}><SafeInlineContent text={block.text} /></h2>;
          case 'li': return <li key={idx} className={`${textScale} mb-3 ml-6 list-disc text-[#4c566a] pl-2`}><SafeInlineContent text={block.text} /></li>;
          case 'quote': return <blockquote key={idx} className={`border-l-4 border-[#81a1c1] pl-6 italic ${textScale} my-6 text-[#4c566a] bg-[#f8fafc]/50 py-2`}><SafeInlineContent text={block.text} /></blockquote>;
          case 'p': return <p key={idx} className={`${textScale} mb-4 text-[#4c566a] leading-relaxed`}><SafeInlineContent text={block.text} /></p>;
          case 'spacer': return <div key={idx} className={mini ? "h-1" : "h-4"} />;
          case 'image': return (
            <div key={idx} className="my-6 flex justify-center w-full flex-1 overflow-hidden">
              <img 
                src={block.url} 
                alt={block.alt} 
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg border border-[#d8dee9] bg-white p-1" 
                onError={(e) => { e.currentTarget.src = '[https://placehold.co/600x400?text=Image+Not+Found](https://placehold.co/600x400?text=Image+Not+Found)'; }} 
              />
            </div>
          );
          case 'video': return (
            <div key={idx} className="my-6 flex justify-center w-full flex-1 overflow-hidden">
              <div className={`w-full h-full relative ${mini ? '' : 'max-w-4xl'} aspect-video`}>
                <SmartVideoPlayer url={block.url} alt={block.alt} mini={mini} />
              </div>
            </div>
          );
          case 'table': return (
            <div key={idx} className="my-6 overflow-x-auto">
              <table className={`w-full border-collapse ${mini ? 'text-[5px]' : 'text-xl'}`}>
                <thead>
                  <tr className="bg-[#e5e9f0] border-b-2 border-[#d8dee9]">
                    {block.rows[0]?.map((cell, cIdx) => (
                      <th key={cIdx} style={{ textAlign: block.alignments[cIdx] || 'left' }} className="p-2 font-bold text-[#2e3440]">
                        <SafeInlineContent text={cell} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.slice(1).map((row, rIdx) => (
                    <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-[#f8fafc]'}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} style={{ textAlign: block.alignments[cIdx] || 'left' }} className="p-2 border-b border-[#d8dee9] text-[#4c566a]">
                          <SafeInlineContent text={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          case 'code': return (
            <pre key={idx} className={`my-4 p-4 bg-[#2e3440] text-[#d8dee9] rounded-lg font-mono ${mini ? 'text-[4px] p-1' : 'text-base'} overflow-hidden`}>
              {block.lines.join('\n')}
            </pre>
          );
          default: return null;
        }
      })}
    </div>
  );
});

const App = () => {
  const [markdown, setMarkdown] = useState(`---
title: "Quarto Slide Viewer"
subtitle: "Optimized Implementation"
author: "Nord Design System"
format: revealjs
---

# Secure & Fast
## Improved Frontend Architecture

- Component-based inline parsing
- Memoized rendering engine
- Robust table alignment
- No raw HTML injection

::: notes
Highlight the security shift from dangerouslySetInnerHTML to component mapping.
Mention that this prevents XSS risks.
:::

---

## Technical Robustness

| Feature | Accuracy | Strategy |
|:---:|:---:|:---:|
| Tables | High | Alignment support |
| Security | Strong | Component parsing |
| Performance | Fast | useMemo hooks |

::: notes
Explain that table column counts are now dynamic.
:::

---

## Multimedia Stability

![video](https://www.youtube.com/embed/dQw4w9WgXcQ)

- Thumbnails load first
- Reduced memory overhead
- Policy error prevention

---

# Thank You!
## Presentation Complete`);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSimulatedFullscreen, setIsSimulatedFullscreen] = useState(false);
  const [isOverviewMode, setIsOverviewMode] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Parse Metadata and Slides using useMemo for performance
  const { metadata, slides } = useMemo(() => {
    const yamlRegex = /^---\s*[\r\n]([\s\S]*?)[\r\n]---/;
    const yamlMatch = markdown.match(yamlRegex);
    const meta = {};
    let body = markdown;

    if (yamlMatch) {
      yamlMatch[1].split('\n').forEach(line => {
        const [key, ...val] = line.split(':');
        if (key && val) meta[key.trim()] = val.join(':').trim().replace(/['"]/g, '');
      });
      body = markdown.replace(yamlRegex, '');
    }

    const slideParts = body.split(/^---$/m).map(s => s.trim()).filter(s => s.length > 0);
    return { metadata: meta, slides: slideParts };
  }, [markdown]);

  // Adjust current slide if bounds change
  useEffect(() => {
    if (currentSlide >= slides.length) {
      setCurrentSlide(Math.max(0, slides.length - 1));
    }
  }, [slides.length, currentSlide]);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const nextSlide = () => {
    if (isOverviewMode) return;
    setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
  };
  const prevSlide = () => {
    if (isOverviewMode) return;
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

  const handlePresent = () => {
    const newMode = !isSimulatedFullscreen;
    setIsSimulatedFullscreen(newMode);
    setIsOverviewMode(false);
    if (newMode) {
      setIsSidebarOpen(false);
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['TEXTAREA', 'INPUT'].includes(document.activeElement.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (['f', 'F', 'p', 'P'].includes(e.key)) handlePresent();
      if (['o', 'O'].includes(e.key)) setIsOverviewMode(!isOverviewMode);
      if (['s', 'S'].includes(e.key)) setShowNotes(!showNotes);
      if (e.key === 'Escape') {
        setIsSimulatedFullscreen(false);
        setIsOverviewMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, isSimulatedFullscreen, isOverviewMode, showNotes]);

  const filteredSlides = searchQuery 
    ? slides.map((s, idx) => ({ content: s, index: idx })).filter(s => s.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const extractNotes = (content) => {
    const match = content.match(/::: notes\s*([\s\S]*?)\s*:::/);
    return match ? match[1].trim() : null;
  };

  return (
    <div className="flex h-screen w-full bg-[#eceff4] font-sans overflow-hidden text-[#2e3440]">
      {!isSimulatedFullscreen && (
        <div className={`transition-all duration-300 border-r border-[#d8dee9] bg-[#e5e9f0] flex flex-col ${isSidebarOpen ? 'w-80 md:w-96' : 'w-0 overflow-hidden border-none'}`}>
          <div className="p-4 border-b border-[#d8dee9] flex justify-between items-center bg-[#eceff4]">
            <div className="flex items-center gap-2 font-semibold text-[#4c566a] text-sm"><Code size={16} /><span>Quarto Markdown</span></div>
            <button onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar" className="p-1 hover:bg-[#d8dee9] rounded text-[#4c566a]"><PanelLeftClose size={16} /></button>
          </div>
          <div className="p-3 border-b border-[#d8dee9]">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 text-[#4c566a]" size={14} />
              <input 
                type="text" 
                placeholder="Search slides..." 
                aria-label="Search slides"
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-[#d8dee9] bg-white focus:outline-none focus:ring-1 focus:ring-[#81a1c1]" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>
          </div>
          <textarea 
            value={markdown} 
            onChange={(e) => setMarkdown(e.target.value)} 
            aria-label="Markdown editor"
            className="flex-1 p-4 font-mono text-[13px] resize-none focus:outline-none bg-white leading-relaxed text-[#2e3440]" 
            spellCheck="false" 
          />
        </div>
      )}

      <div className={`flex-1 flex flex-col relative transition-colors duration-500 ${isSimulatedFullscreen ? 'bg-white' : ''}`}>
        {!isSimulatedFullscreen && (
          <header className="h-14 border-b border-[#d8dee9] bg-white flex items-center justify-between px-6 z-10 shadow-sm">
            <div className="flex items-center gap-4">
              {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} aria-label="Open sidebar" className="p-1 hover:bg-[#eceff4] rounded text-[#4c566a]"><PanelLeftOpen size={20} /></button>}
              <div className="text-sm font-semibold text-[#4c566a] truncate max-w-[200px] md:max-w-md">{metadata.title || 'Untitled Presentation'}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowNotes(!showNotes)} className={`p-2 rounded-md transition-all ${showNotes ? 'bg-[#81a1c1] text-white shadow-inner' : 'text-[#4c566a] hover:bg-[#eceff4]'}`} title="Speaker Notes (S)"><MessageSquareText size={18} /></button>
              <button onClick={() => setIsOverviewMode(!isOverviewMode)} className={`p-2 rounded-md transition-all ${isOverviewMode ? 'bg-[#81a1c1] text-white shadow-inner' : 'text-[#4c566a] hover:bg-[#eceff4]'}`} title="Toggle Overview (O)"><Grid size={18} /></button>
              <button onClick={handlePresent} className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-white bg-[#81a1c1] rounded-md hover:bg-[#5e81ac] shadow transition-all active:scale-95"><Play size={14} fill="currentColor" /><span>Present</span></button>
            </div>
          </header>
        )}

        <main className={`flex-1 flex ${isSimulatedFullscreen && showNotes ? 'flex-row' : 'flex-col'} relative ${isSimulatedFullscreen ? 'p-0' : 'p-4 md:p-8 bg-[#eceff4]'} overflow-hidden`}>
          <div className="flex-1 relative overflow-y-auto scrollbar-hide flex flex-col items-center justify-center">
            {isOverviewMode ? (
              <div className="w-full h-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                {slides.map((content, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => { setCurrentSlide(idx); setIsOverviewMode(false); }} 
                    className={`aspect-[16/9] bg-white border-2 rounded-xl cursor-pointer transition-all hover:scale-105 overflow-hidden relative shadow-md text-left ${currentSlide === idx ? 'border-[#81a1c1] ring-4 ring-[#81a1c1]/10' : 'border-[#d8dee9]'}`}
                  >
                    <SlideRenderer content={content} isTitleSlide={content.startsWith('# ')} isFullscreen={isSimulatedFullscreen} mini={true} />
                    <div className="absolute bottom-2 right-3 text-[10px] font-black text-[#81a1c1] bg-white px-1.5 rounded-full shadow-sm">{idx + 1}</div>
                  </button>
                ))}
              </div>
            ) : (
                <div className={`w-full h-full relative flex flex-col overflow-hidden bg-white transition-all ${isSimulatedFullscreen ? '' : 'max-w-5xl aspect-[16/9] rounded-2xl shadow-2xl border border-[#d8dee9]'}`}>
                  {isSimulatedFullscreen && (
                    <div className="absolute top-6 right-6 z-50 opacity-0 hover:opacity-100 transition-opacity">
                      <button onClick={() => setIsSimulatedFullscreen(false)} className="flex items-center gap-2 px-5 py-2.5 bg-[#eceff4]/90 backdrop-blur text-[#4c566a] rounded-full shadow-xl border border-[#d8dee9] text-sm font-bold hover:bg-[#d8dee9] transition-all"><LogOut size={16} /><span>End (Esc)</span></button>
                    </div>
                  )}
                  {currentSlide === 0 && metadata.title && !slides[0].includes(metadata.title) && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white p-12 text-center">
                      <h1 className={`${isSimulatedFullscreen ? 'text-8xl' : 'text-6xl'} font-black text-[#2e3440] mb-6 tracking-tight`}><SafeInlineContent text={metadata.title} /></h1>
                      {metadata.subtitle && <h3 className={`${isSimulatedFullscreen ? 'text-4xl' : 'text-3xl'} text-[#4c566a] mb-12 italic font-light`}><SafeInlineContent text={metadata.subtitle} /></h3>}
                      <div className="w-32 h-1.5 bg-[#88c0d0] rounded-full shadow-sm" />
                      {metadata.author && <p className="mt-8 text-xl text-[#81a1c1] font-semibold"><SafeInlineContent text={metadata.author} /></p>}
                    </div>
                  )}
                  <div className="flex-1 overflow-auto"><SlideRenderer content={slides[currentSlide] || ''} isTitleSlide={slides[currentSlide]?.startsWith('# ')} isFullscreen={isSimulatedFullscreen} /></div>
                  <div className="h-2 w-full bg-[#e5e9f0] flex z-40">
                    <div className="h-full bg-[#88c0d0] transition-all duration-300" style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }} />
                  </div>
                  <nav className={`absolute inset-y-0 left-0 w-20 flex items-center ${isSimulatedFullscreen ? 'opacity-0 hover:opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity z-40`}>
                    <button onClick={prevSlide} aria-label="Previous slide" className="p-4 ml-4 bg-white/90 shadow-2xl rounded-full text-[#4c566a] hover:text-[#81a1c1] transition-all border border-[#d8dee9]"><ChevronLeft size={28}/></button>
                  </nav>
                  <nav className={`absolute inset-y-0 right-0 w-20 flex items-center justify-end ${isSimulatedFullscreen ? 'opacity-0 hover:opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity z-40`}>
                    <button onClick={nextSlide} aria-label="Next slide" className="p-4 mr-4 bg-white/90 shadow-2xl rounded-full text-[#4c566a] hover:text-[#81a1c1] transition-all border border-[#d8dee9]"><ChevronRight size={28}/></button>
                  </nav>
                </div>
            )}
          </div>

          {showNotes && !isOverviewMode && (
            <aside className={`${isSimulatedFullscreen ? 'w-96 border-l' : 'mt-4 h-48 border rounded-xl'} flex flex-col border-[#d8dee9] bg-[#3b4252] text-[#eceff4] shadow-2xl transition-all duration-300 overflow-hidden`}>
                <div className="p-3 border-b border-[#4c566a] bg-[#2e3440] flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#88c0d0]"><MessageSquareText size={14}/><span>Speaker Notes</span></div>
                    {isSimulatedFullscreen && (
                        <div className="flex items-center gap-3 text-[#d8dee9] font-mono text-sm border-l border-[#4c566a] pl-3"><Clock size={14}/><span className={timer > 300 ? 'text-[#bf616a]' : ''}>{formatTime(timer)}</span></div>
                    )}
                </div>
                <div className="flex-1 p-6 overflow-y-auto leading-relaxed text-lg">
                    {extractNotes(slides[currentSlide] || '') ? (
                        <div className="space-y-4">
                            {extractNotes(slides[currentSlide] || '').split('\n').map((line, i) => (
                                <p key={i} className="text-[#e5e9f0]">{line}</p>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-[#4c566a] italic text-sm text-center">No notes for this slide</div>
                    )}
                </div>
            </aside>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;