import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Eye, 
  Edit3, 
  Download, 
  Copy, 
  Trash2, 
  Moon, 
  Sun,
  Layout,
  Clock,
  CheckCircle2,
  Code,
  Type,
  Maximize2,
  Minimize2
} from 'lucide-react';

/**
 * Markdown Studio - Nord Light Edition
 * Optimized for presentations using the Nord color palette.
 */

// Nord Palette Constants
const NORD = {
  polar0: '#2e3440', // Darkest
  polar1: '#3b4252',
  polar2: '#434c5e',
  polar3: '#4c566a', // Lightest polar
  snow0: '#d8dee9',  // Darkest snow
  snow1: '#e5e9f0',
  snow2: '#eceff4',  // Lightest snow
  frost0: '#8fbcbb', // Teal
  frost1: '#88c0d0', // Sky blue
  frost2: '#81a1c1', // Steel blue
  frost3: '#5e81ac', // Deep blue
  aurora0: '#bf616a', // Red
  aurora1: '#d08770', // Orange
  aurora2: '#ebcb8b', // Yellow
  aurora3: '#a3be8c', // Green
  aurora4: '#b48ead', // Purple
};

const App = () => {
  const [markdown, setMarkdown] = useState('');
  const [viewMode, setViewMode] = useState('preview');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const savedContent = localStorage.getItem('markdown_studio_content');
    if (savedContent) {
      setMarkdown(savedContent);
    } else {
      setMarkdown(DEFAULT_MARKDOWN);
    }

    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js')
    ]).then(() => {
      if (window.marked && window.hljs) {
        window.marked.setOptions({
          highlight: function(code, lang) {
            const language = window.hljs.getLanguage(lang) ? lang : 'plaintext';
            return window.hljs.highlight(code, { language }).value;
          },
          langPrefix: 'hljs language-',
          breaks: true,
          gfm: true
        });
      }
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('markdown_studio_content', markdown);
  }, [markdown]);

  const renderedHtml = useMemo(() => {
    if (!window.marked) return '';
    try {
      return window.marked.parse(markdown);
    } catch (e) {
      return '<p style="color: #bf616a">Error parsing markdown...</p>';
    }
  }, [markdown]);

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presentation.md';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('File downloaded');
  };

  const showNotification = (msg) => {
    setShowStatus(msg);
    setTimeout(() => setShowStatus(false), 2000);
  };

  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;

  // Theme-based colors
  const bgColor = isDarkMode ? NORD.polar0 : NORD.snow2;
  const secondaryBgColor = isDarkMode ? NORD.polar1 : NORD.snow1;
  const borderColor = isDarkMode ? NORD.polar3 : NORD.snow0;
  const textColor = isDarkMode ? NORD.snow2 : NORD.polar0;
  const mutedTextColor = isDarkMode ? NORD.polar3 : NORD.polar3;

  return (
    <div 
      className="flex flex-col h-screen overflow-hidden font-sans transition-colors duration-300"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      
      {/* Header */}
      {!isFocusMode && (
        <header 
          className="flex items-center justify-between px-6 py-3 border-b z-10"
          style={{ borderColor: borderColor, backgroundColor: isDarkMode ? NORD.polar0 : '#ffffff' }}
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: NORD.frost3 }}>
              <FileText size={20} className="text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">Nord Studio</h1>
            <span 
              className="ml-2 px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider"
              style={{ backgroundColor: NORD.snow0, color: NORD.polar3 }}
            >
              Nord Light Theme
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div 
              className="flex items-center gap-2 px-3 py-1 rounded-lg"
              style={{ backgroundColor: secondaryBgColor }}
            >
              <Type size={14} style={{ color: mutedTextColor }} />
              <input 
                type="range" min="12" max="42" value={fontSize} 
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-24 h-1.5 rounded-lg appearance-none cursor-pointer accent-nord-frost"
                style={{ accentColor: NORD.frost2 }}
              />
              <span className="text-[10px] font-mono w-6" style={{ color: mutedTextColor }}>{fontSize}px</span>
            </div>

            <div className="h-6 w-px mx-1" style={{ backgroundColor: borderColor }} />

            <div className="flex items-center p-1 rounded-lg" style={{ backgroundColor: secondaryBgColor }}>
              <button 
                onClick={() => setViewMode('edit')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'edit' ? 'shadow-sm' : ''}`}
                style={{ 
                  backgroundColor: viewMode === 'edit' ? (isDarkMode ? NORD.polar2 : '#fff') : 'transparent',
                  color: viewMode === 'edit' ? NORD.frost3 : mutedTextColor
                }}
              >
                <Edit3 size={18} />
              </button>
              <button 
                onClick={() => setViewMode('split')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'split' ? 'shadow-sm' : ''}`}
                style={{ 
                  backgroundColor: viewMode === 'split' ? (isDarkMode ? NORD.polar2 : '#fff') : 'transparent',
                  color: viewMode === 'split' ? NORD.frost3 : mutedTextColor
                }}
              >
                <Layout size={18} />
              </button>
              <button 
                onClick={() => setViewMode('preview')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'preview' ? 'shadow-sm' : ''}`}
                style={{ 
                  backgroundColor: viewMode === 'preview' ? (isDarkMode ? NORD.polar2 : '#fff') : 'transparent',
                  color: viewMode === 'preview' ? NORD.frost3 : mutedTextColor
                }}
              >
                <Eye size={18} />
              </button>
            </div>

            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full transition-colors"
              style={{ color: mutedTextColor }}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button 
              onClick={() => setIsFocusMode(true)}
              className="p-2 rounded-lg transition-colors ml-2 flex items-center gap-2 text-sm font-medium text-white"
              style={{ backgroundColor: NORD.polar0 }}
            >
              <Maximize2 size={16} /> Present
            </button>
          </div>
        </header>
      )}

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden relative">
        {isFocusMode && (
          <button 
            onClick={() => setIsFocusMode(false)}
            className="fixed top-4 right-4 z-50 p-2 rounded-full transition-all backdrop-blur-sm opacity-40 hover:opacity-100"
            style={{ backgroundColor: NORD.polar3, color: '#fff' }}
          >
            <Minimize2 size={24} />
          </button>
        )}

        {/* Editor Pane */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div 
            className={`flex flex-col h-full border-r transition-all duration-300 ${viewMode === 'edit' ? 'w-full' : 'w-1/3'}`}
            style={{ borderColor: borderColor }}
          >
            <div 
              className="flex items-center justify-between px-4 py-2 text-[10px] font-bold uppercase border-b"
              style={{ backgroundColor: secondaryBgColor, borderColor: borderColor, color: mutedTextColor }}
            >
              <span className="flex items-center gap-1.5"><Code size={12} /> Source</span>
            </div>
            <textarea
              className="flex-1 p-6 resize-none outline-none font-mono text-sm leading-relaxed"
              style={{ backgroundColor: isDarkMode ? NORD.polar0 : '#fff', color: textColor }}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Start typing..."
              spellCheck="false"
            />
          </div>
        )}

        {/* Presentation Pane */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div 
            className={`flex flex-col h-full transition-all duration-300 overflow-hidden ${viewMode === 'preview' ? 'w-full' : 'w-2/3'}`}
            style={{ backgroundColor: isFocusMode ? (isDarkMode ? NORD.polar0 : NORD.snow2) : (isDarkMode ? NORD.polar1 : '#fff') }}
          >
            {!isFocusMode && (
              <div 
                className="flex items-center justify-between px-4 py-2 text-[10px] font-bold uppercase border-b"
                style={{ backgroundColor: secondaryBgColor, borderColor: borderColor, color: mutedTextColor }}
              >
                <span className="flex items-center gap-1.5"><Eye size={12} /> Nord Preview</span>
              </div>
            )}
            <div className={`flex-1 overflow-y-auto ${isFocusMode ? 'p-12 md:p-24' : 'p-12'} custom-scrollbar`}>
              <div 
                className={`prose max-w-4xl mx-auto markdown-preview`}
                style={{ 
                  fontSize: `${fontSize}px`, 
                  lineHeight: '1.7',
                  color: textColor
                }}
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            </div>
          </div>
        )}

        {showStatus && (
          <div 
            className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full shadow-lg text-sm font-medium animate-fade-in text-white"
            style={{ backgroundColor: NORD.frost3 }}
          >
            {showStatus}
          </div>
        )}
      </main>

      {/* Footer */}
      {!isFocusMode && (
        <footer 
          className="flex items-center justify-between px-4 py-1 text-[10px] border-t"
          style={{ backgroundColor: isDarkMode ? NORD.polar0 : '#fff', borderColor: borderColor, color: mutedTextColor }}
        >
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Clock size={10} /> Nord Light Palette</span>
            <span>{wordCount} words</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleDownload} className="hover:text-nord-frost transition-colors uppercase font-bold tracking-tighter" style={{ color: NORD.frost2 }}>Export .md</button>
          </div>
        </footer>
      )}

      <style>{`
        .markdown-preview { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
        .markdown-preview h1 { font-size: 2.8em; font-weight: 800; margin-bottom: 0.8em; color: ${NORD.frost3}; letter-spacing: -0.02em; border-bottom: 2px solid ${NORD.snow0}; padding-bottom: 0.3em; }
        .markdown-preview h2 { font-size: 1.8em; font-weight: 700; margin-top: 2.2em; color: ${NORD.frost2}; margin-bottom: 0.8em; }
        .markdown-preview h3 { font-size: 1.4em; font-weight: 600; margin-top: 1.8em; color: ${NORD.polar3}; }
        .markdown-preview p { margin-bottom: 1.4em; color: ${isDarkMode ? NORD.snow1 : NORD.polar1}; }
        .markdown-preview strong { color: ${NORD.frost3}; font-weight: 700; }
        .markdown-preview blockquote { border-left: 5px solid ${NORD.frost0}; padding-left: 1.5rem; color: ${NORD.polar3}; font-style: italic; background-color: ${isDarkMode ? NORD.polar1 : NORD.snow2}; padding-top: 1rem; padding-bottom: 1rem; border-radius: 0 8px 8px 0; margin: 2rem 0; }
        .markdown-preview pre { background-color: ${NORD.polar0}; padding: 1.5rem; border-radius: 12px; overflow-x: auto; margin: 2rem 0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid ${NORD.polar3}; }
        .markdown-preview code:not(pre code) { background-color: ${isDarkMode ? NORD.polar2 : NORD.snow0}; padding: 0.2rem 0.4rem; border-radius: 6px; font-size: 0.9em; color: ${NORD.aurora0}; font-weight: 600; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
        .markdown-preview hr { border: 0; height: 2px; background: ${NORD.snow0}; margin: 3rem 0; }
        .markdown-preview ul, .markdown-preview ol { margin-bottom: 1.5em; padding-left: 1.5em; }
        .markdown-preview li { margin-bottom: 0.5em; }
        .markdown-preview img { border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); margin: 2rem 0; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${NORD.snow0}; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: ${NORD.polar3}; }

        /* Nord Syntax Highlighting */
        .hljs-keyword, .hljs-selector-tag { color: ${NORD.frost3}; font-weight: bold; }
        .hljs-string, .hljs-doctag { color: ${NORD.aurora3}; }
        .hljs-title, .hljs-section, .hljs-selector-id { color: ${NORD.frost1}; }
        .hljs-variable, .hljs-template-variable { color: ${NORD.snow2}; }
        .hljs-type, .hljs-built_in, .hljs-builtin-name { color: ${NORD.frost0}; }
        .hljs-number, .hljs-symbol, .hljs-bullet { color: ${NORD.aurora4}; }
        .hljs-comment, .hljs-quote { color: ${NORD.polar3}; font-style: italic; }
        
        @keyframes fade-in { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

const DEFAULT_MARKDOWN = `# Nord Classroom Experience ❄️

## The Aesthetic of Focus
The Nord color palette is designed to be clean, professional, and readable. It uses a combination of "Arctic" colors to reduce eye strain.

### Why Nord?
1. **Low Contrast, High Legibility**: Perfect for projectors and long reading sessions.
2. **Distinct Syntax**: Code and logic stand out without being harsh.
3. **Professional Feel**: Ideal for academic environments.

---

## Technical Features
- **Teal Frost (\`#8fbcbb\`)**: Used for accent elements.
- **Deep Frost (\`#5e81ac\`)**: Primary headers and branding.
- **Aurora Red (\`#bf616a\`)**: Inline code and errors.

> "The Nord palette creates a serene environment for learning and development."

\`\`\`javascript
// Nord Syntax Highlighting in Action
const nordTheme = {
  background: '#eceff4',
  foreground: '#2e3440',
  frost: ['#8fbcbb', '#88c0d0', '#81a1c1', '#5e81ac']
};

console.log("Ready for class!");
\`\`\`

## Discussion
- How does the color choice affect your ability to read the text?
- Do you prefer the **Snow Storm** (light) or **Polar Night** (dark) variant?
`;

export default App;