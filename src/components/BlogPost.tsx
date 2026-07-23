import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { BLOG_POSTS } from '../data/blogPosts';
import { ArrowLeft, Calendar, Clock, Share2, Twitter, Linkedin, Github, Copy, Check, Bookmark, Heart, Trash2, MessageSquare, MessageCircle, Slack, Phone, Facebook, Info, AlertTriangle, Lightbulb, CheckCircle, Quote, Home, ChevronRight, BookOpen, ArrowRight, Flame, Star, ListFilter, Table, Search, X } from 'lucide-react';
import { getCategoryStyle } from './BlogCard';
import { getImageUrl } from '../utils/image';

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (name[0] || '?').toUpperCase();
};

const getAvatarColor = (name: string) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-emerald-500'
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return colors[sum % colors.length];
};

interface BlogPostProps {
  post: BlogPost;
  onBack: () => void;
}

// Custom high-fidelity Pinterest Icon
const PinterestIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.64 11.17-.1-.95-.19-2.41.04-3.45.21-.93 1.35-5.74 1.35-5.74s-.34-.69-.34-1.71c0-1.6 1.41-2.8 2.51-2.8.96 0 1.41.72 1.41 1.58 0 .96-.61 2.4-.93 3.73-.26 1.13.57 2.05 1.69 2.05 2.03 0 3.59-2.14 3.59-5.23 0-2.74-1.97-4.65-4.78-4.65-3.26 0-5.17 2.44-5.17 4.97 0 .98.38 2.04.85 2.61.09.11.11.21.08.33l-.32 1.3c-.05.21-.17.26-.39.16-1.46-.68-2.38-2.81-2.38-4.52 0-3.68 2.67-7.06 7.71-7.06 4.05 0 7.2 2.89 7.2 6.75 0 4.02-2.54 7.26-6.06 7.26-1.18 0-2.3-.61-2.68-1.34l-.73 2.79c-.26.98-.98 2.21-1.46 2.99C9.9 23.68 10.93 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
  </svg>
);

interface BlogImageProps {
  src: string;
  alt: string;
  caption?: string;
  key?: string | number;
}

const BlogImage = ({ src, alt, caption }: BlogImageProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const pinterestShareUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl)}&media=${encodeURIComponent(src)}&description=${encodeURIComponent(alt || caption || 'Zenire Article Visual')}`;

  return (
    <div 
      className="my-8 text-center group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative inline-block max-w-full overflow-hidden rounded-2xl border border-gray-200/80 shadow-xs transition-all duration-300 hover:shadow-md bg-gray-50">
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          className="max-h-[520px] w-auto max-w-full object-cover transition-transform duration-500 hover:scale-[1.015]"
        />
        
        {/* Pinterest Float Button */}
        <div className={`absolute inset-0 bg-black/10 flex items-start justify-end p-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <a
            href={pinterestShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#E60023] text-white font-sans font-extrabold text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-full flex items-center gap-1.5 shadow-lg hover:bg-[#b8001c] active:scale-95 transition-all cursor-pointer pointer-events-auto"
            title="Pin it on Pinterest"
          >
            <PinterestIcon className="w-3.5 h-3.5 fill-current" />
            <span>Save Pin</span>
          </a>
        </div>
      </div>
      {caption && (
        <p className="mt-2 text-xs font-mono text-gray-500 max-w-lg mx-auto leading-relaxed italic">
          {caption}
        </p>
      )}
    </div>
  );
};

interface VideoBlockProps {
  url: string;
  key?: string | number;
}

const VideoBlock = ({ url }: VideoBlockProps) => {
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be') || url.includes('youtube-nocookie.com');
  const isVimeo = url.includes('vimeo.com');
  
  let embedUrl = url;
  if (isYouTube) {
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  } else if (isVimeo) {
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match) {
      embedUrl = `https://player.vimeo.com/video/${match[1]}`;
    }
  }

  return (
    <div className="my-8 rounded-2xl overflow-hidden shadow-md aspect-video w-full bg-black relative border border-gray-150">
      {isYouTube || isVimeo ? (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video Player Embed"
        />
      ) : (
        <video src={url} controls className="w-full h-full object-cover" />
      )}
    </div>
  );
};

interface CodeBlockProps {
  code: string;
  title?: string;
  language?: string;
  key?: string | number;
}

const CodeBlock = ({ code, title = "Prompt & Code Blueprint", language = "PROMPT" }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="my-6 rounded-2xl bg-[#0f172a] text-slate-100 overflow-hidden border border-slate-800 shadow-md font-mono text-left">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-2 font-sans font-bold text-slate-200 tracking-wide">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-semibold">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg transition-all cursor-pointer font-sans font-bold shadow-xs active:scale-95"
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body */}
      <div className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm leading-relaxed text-slate-200 bg-[#0b1120]">
        <pre className="whitespace-pre-wrap break-words font-mono text-slate-200">
          {code}
        </pre>
      </div>
    </div>
  );
};

interface RevealSectionProps {
  title: string;
  children: React.ReactNode;
  key?: string | number;
}

const RevealSection = ({ title, children }: RevealSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="my-6 border border-gray-200/80 rounded-2xl bg-white overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.015)] text-left">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4.5 bg-gray-50/60 hover:bg-gray-100/80 text-left font-sans font-bold text-gray-800 transition-colors cursor-pointer select-none border-b border-transparent"
        style={{ borderBottomColor: isOpen ? '#f3f4f6' : 'transparent' }}
      >
        <span className="text-sm sm:text-base font-sans font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full bg-[rgba(11,48,215)] transition-transform ${isOpen ? 'scale-125' : ''}`} />
          {title}
        </span>
        <span className="text-[10px] text-[rgba(11,48,215)] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full bg-blue-50">
          {isOpen ? 'COLLAPSE ▲' : 'EXPAND ▼'}
        </span>
      </button>
      {isOpen && (
        <div className="p-5 text-sm sm:text-[15px] text-gray-700 leading-relaxed bg-white/50 border-t border-gray-100 font-sans">
          {children}
        </div>
      )}
    </div>
  );
};

// Formats individual table cell values into badges, tags, or inline styled text
function formatTableCell(content: string): React.ReactNode {
  const trimmed = content.trim();
  const lower = trimmed.toLowerCase();

  if (trimmed === '[yes]' || trimmed === '[Yes]' || lower === 'yes' || trimmed === '✔' || trimmed === '✓' || trimmed === '[check]' || trimmed === '[supported]') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs shrink-0">
        <Check className="w-3 h-3 stroke-[3]" />
        <span>Yes</span>
      </span>
    );
  }

  if (trimmed === '[no]' || trimmed === '[No]' || lower === 'no' || trimmed === '✖' || trimmed === '✕' || trimmed === '[x]' || trimmed === '[not supported]') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs shrink-0">
        <span className="text-rose-500 font-extrabold text-[10px]">✕</span>
        <span>No</span>
      </span>
    );
  }

  if (trimmed === '[partial]' || trimmed === '[Partial]' || lower === 'partial' || trimmed === '[limited]') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        <span>Partial</span>
      </span>
    );
  }

  if (trimmed === '[pro]' || trimmed === '[Pro]' || trimmed === '[popular]' || trimmed === '[Popular]' || trimmed === '[featured]' || trimmed === '[Featured]') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200/80 shadow-2xs shrink-0">
        <Star className="w-3 h-3 fill-purple-500 text-purple-500" />
        <span>{trimmed.replace(/[\[\]]/g, '')}</span>
      </span>
    );
  }

  if (trimmed === '[free]' || trimmed === '[Free]') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs shrink-0">
        <span>Free</span>
      </span>
    );
  }

  // Check custom badge shortcode e.g. [badge: Text] or [badge-emerald: Text]
  const badgeMatch = trimmed.match(/^\[badge(-[a-z]+)?: ([^\]]+)\]$/i);
  if (badgeMatch) {
    const colorName = badgeMatch[1] ? badgeMatch[1].replace('-', '') : 'indigo';
    const textVal = badgeMatch[2];
    
    const colorStyles: Record<string, string> = {
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rose: 'bg-rose-50 text-rose-700 border-rose-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      gray: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    
    const styleClass = colorStyles[colorName] || colorStyles.indigo;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold border shadow-2xs shrink-0 ${styleClass}`}>
        {textVal}
      </span>
    );
  }

  return parseInlineStyling(content);
}

interface StyledTableProps {
  title?: string;
  subtitle?: string;
  headers: string[];
  rows: string[][];
  key?: string | number;
}

const StyledTable = ({ title, subtitle, headers, rows }: StyledTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRows = rows.filter(row => {
    if (!searchTerm.trim()) return true;
    return row.some(cell => cell.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="my-8 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow overflow-hidden text-left font-sans">
      {/* Header Bar if Title or Filter enabled */}
      {(title || rows.length > 5) && (
        <div className="p-4 sm:px-5 sm:py-4 bg-gradient-to-r from-slate-50/90 via-white to-blue-50/20 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            {title && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200/80 text-[rgba(11,48,215)] flex items-center justify-center shrink-0 shadow-2xs">
                  <Table className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h4 className="text-base sm:text-lg font-sans font-extrabold text-slate-900 tracking-tight">
                  {title}
                </h4>
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5 font-sans font-normal">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 shrink-0">
              {filteredRows.length} {filteredRows.length === 1 ? 'row' : 'rows'}
            </span>
            {rows.length > 4 && (
              <div className="relative flex-1 sm:w-52">
                <input
                  type="text"
                  placeholder="Filter table rows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-[rgba(11,48,215)] focus:ring-2 focus:ring-blue-100/80 font-sans shadow-2xs transition-all"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table Scroll Wrapper */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200/80">
              {headers.map((header, hIdx) => (
                <th 
                  key={hIdx} 
                  className="px-4.5 py-3 text-xs font-sans font-bold uppercase tracking-wider text-slate-700 bg-slate-50/90 select-none whitespace-nowrap"
                >
                  {parseInlineStyling(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150">
            {filteredRows.length > 0 ? (
              filteredRows.map((row, rIdx) => (
                <tr 
                  key={rIdx} 
                  className="hover:bg-blue-50/30 transition-colors duration-150 even:bg-slate-50/40"
                >
                  {row.map((cell, cIdx) => (
                    <td 
                      key={cIdx} 
                      className={`px-4.5 py-3.5 text-sm font-sans text-slate-700 ${
                        cIdx === 0 ? 'font-semibold text-slate-900 bg-slate-50/30' : ''
                      }`}
                    >
                      {formatTableCell(cell)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="px-4 py-8 text-center text-xs text-slate-500 font-sans italic">
                  No rows matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Row splitter helper for table parsing
function splitRow(line: string): string[] {
  let cells = line.split('|').map(c => c.trim());
  if (cells.length > 0 && cells[0] === '') cells.shift();
  if (cells.length > 0 && cells[cells.length - 1] === '') cells.pop();
  return cells;
}

// Parses raw markdown table lines into headers and rows
function parseTableLines(tableLines: string[]): { headers: string[]; rows: string[][] } {
  const cleanLines = tableLines
    .map(l => l.trim())
    .filter(l => l.length > 0 && (l.startsWith('|') || l.endsWith('|')));

  if (cleanLines.length === 0) return { headers: [], rows: [] };

  const headers = splitRow(cleanLines[0]);

  let rowStartIdx = 1;
  if (cleanLines.length > 1 && (cleanLines[1].includes('---') || cleanLines[1].includes(':-'))) {
    rowStartIdx = 2;
  }

  const rows: string[][] = [];
  for (let idx = rowStartIdx; idx < cleanLines.length; idx++) {
    const rowCells = splitRow(cleanLines[idx]);
    if (rowCells.length > 0) {
      rows.push(rowCells);
    }
  }

  return { headers, rows };
}

// Slugify helper for Table of Contents anchor links
export const slugifyHeading = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractTableOfContents(markdown: string): TocItem[] {
  const lines = markdown.split('\n');
  const items: TocItem[] = [];
  const idCounts = new Map<string, number>();

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ') || trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
      let level = 1;
      let text = '';
      if (trimmed.startsWith('# ')) {
        level = 1;
        text = trimmed.replace(/^#\s+/, '').trim();
      } else if (trimmed.startsWith('## ')) {
        level = 2;
        text = trimmed.replace(/^##\s+/, '').trim();
      } else if (trimmed.startsWith('### ')) {
        level = 3;
        text = trimmed.replace(/^###\s+/, '').trim();
      }

      if (!text) return;

      let baseId = slugifyHeading(text);
      if (!baseId) baseId = 'heading';

      let id = baseId;
      const count = idCounts.get(baseId) || 0;
      if (count > 0) {
        id = `${baseId}-${count}`;
      }
      idCounts.set(baseId, count + 1);

      items.push({ id, text, level });
    }
  });

  return items;
}

// Table of Contents UI Component
export const TableOfContents = ({ items }: { items: TocItem[] }) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = items
        .map(item => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      let currentActive = '';
      for (const el of headingElements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 140) {
          currentActive = el.id;
        }
      }
      if (currentActive) {
        setActiveId(currentActive);
      } else if (items.length > 0) {
        setActiveId(items[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="my-8 rounded-2xl bg-gradient-to-b from-gray-50/90 to-white border border-gray-200/80 p-5 shadow-xs transition-all duration-300 text-left">
      <div className="flex items-center justify-between border-b border-gray-150 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[rgba(11,48,215)]/10 text-[rgba(11,48,215)] flex items-center justify-center">
            <ListFilter className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-sans font-extrabold text-gray-900 tracking-tight uppercase">
            Table of Contents
          </h3>
          <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full border border-gray-200">
            {items.length} Topics
          </span>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-xs font-mono font-bold text-gray-500 hover:text-[rgba(11,48,215)] transition-colors cursor-pointer px-2.5 py-1 rounded-md hover:bg-blue-50"
        >
          {isCollapsed ? 'SHOW TOC ▼' : 'HIDE TOC ▲'}
        </button>
      </div>

      {!isCollapsed && (
        <nav className="mt-3.5 space-y-1 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(item.id);
                  if (target) {
                    const yOffset = -90;
                    const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                    setActiveId(item.id);
                  }
                }}
                className={`group flex items-center justify-between py-1.5 px-3 rounded-lg text-xs font-sans transition-all duration-200 cursor-pointer ${
                  item.level === 3 ? 'ml-4 text-gray-500' : item.level === 1 ? 'font-extrabold text-gray-900' : 'font-semibold text-gray-700'
                } ${
                  isActive
                    ? 'bg-[rgba(11,48,215)]/10 text-[rgba(11,48,215)] font-extrabold translate-x-1'
                    : 'hover:text-gray-900 hover:bg-gray-100/80 hover:translate-x-0.5'
                }`}
              >
                <span className="truncate flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    isActive ? 'bg-[rgba(11,48,215)] scale-125' : 'bg-gray-300 group-hover:bg-gray-400'
                  }`} />
                  <span className="truncate">{item.text}</span>
                </span>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-[rgba(11,48,215)] shrink-0 ml-1" />
                )}
              </a>
            );
          })}
        </nav>
      )}
    </div>
  );
};

// High-fidelity Markdown Parser supporting rich shortcodes, prompts, bold headings & styled lists
function parseMarkdown(md: string) {
  const lines = md.split('\n');
  let inCode = false;
  let codeTitle = '';
  let codeContent: string[] = [];

  let inPrompt = false;
  let promptTitle = '';
  let promptContent: string[] = [];
  
  let inReveal = false;
  let revealTitle = '';
  let revealContent: string[] = [];

  let inNote = false;
  let noteContent: string[] = [];

  let inWarning = false;
  let warningContent: string[] = [];

  let inTip = false;
  let tipContent: string[] = [];

  let inQuoteBlock = false;
  let quoteBlockContent: string[] = [];

  let inKeyTakeaways = false;
  let takeawaysContent: string[] = [];

  let inTableShortcode = false;
  let tableTitle = '';
  let tableSubtitle = '';
  let tableShortcodeContent: string[] = [];
  let lastProcessedTableLineIdx = -1;

  const htmlElements: React.ReactNode[] = [];
  const headingIdCounts = new Map<string, number>();

  const getHeadingId = (text: string) => {
    let base = slugifyHeading(text);
    if (!base) base = 'heading';
    const count = headingIdCounts.get(base) || 0;
    const id = count > 0 ? `${base}-${count}` : base;
    headingIdCounts.set(base, count + 1);
    return id;
  };

  lines.forEach((line, index) => {
    if (index <= lastProcessedTableLineIdx) {
      return;
    }

    // Table Shortcode Check: [table title="..." subtitle="..."] ... [/table]
    if (line.trim().startsWith('[table') || line.trim().startsWith('[TABLE')) {
      const titleMatch = line.match(/title="([^"]+)"/i);
      const subtitleMatch = line.match(/subtitle="([^"]+)"/i);
      tableTitle = titleMatch ? titleMatch[1] : '';
      tableSubtitle = subtitleMatch ? subtitleMatch[1] : '';

      const rest = line.replace(/^\[table[^\]]*\]/i, '').trim();

      if (rest.endsWith('[/table]')) {
        const singleContent = rest.replace(/\[\/table\]$/i, '').trim();
        const tLines = singleContent.split('\n');
        const { headers, rows } = parseTableLines(tLines);
        if (headers.length > 0) {
          htmlElements.push(
            <StyledTable key={`tbl-${index}`} title={tableTitle} subtitle={tableSubtitle} headers={headers} rows={rows} />
          );
        }
        tableTitle = '';
        tableSubtitle = '';
      } else {
        inTableShortcode = true;
        tableShortcodeContent = rest ? [rest] : [];
      }
      return;
    }

    if (inTableShortcode) {
      if (line.trim().includes('[/table]') || line.trim().includes('[/TABLE]')) {
        inTableShortcode = false;
        const cleanLine = line.replace(/\[\/table\]/i, '').trim();
        if (cleanLine) tableShortcodeContent.push(cleanLine);

        const { headers, rows } = parseTableLines(tableShortcodeContent);
        if (headers.length > 0) {
          htmlElements.push(
            <StyledTable key={`tbl-${index}`} title={tableTitle} subtitle={tableSubtitle} headers={headers} rows={rows} />
          );
        }
        tableShortcodeContent = [];
        tableTitle = '';
        tableSubtitle = '';
      } else {
        tableShortcodeContent.push(line);
      }
      return;
    }
    // Fenced Code block check: ```
    if (line.trim().startsWith('```')) {
      if (inCode) {
        inCode = false;
        htmlElements.push(
          <CodeBlock 
            key={`code-${index}`} 
            code={codeContent.join('\n')} 
            title={codeTitle || "Code & Prompt Template"}
            language="CODE"
          />
        );
        codeContent = [];
        codeTitle = '';
      } else {
        inCode = true;
        codeTitle = line.trim().replace(/^```/, '').trim();
      }
      return;
    }

    if (inCode) {
      codeContent.push(line);
      return;
    }

    // Custom Prompt Shortcode: [prompt title="..."] ... [/prompt]
    if (line.trim().startsWith('[prompt') || line.trim().startsWith('[PROMPT')) {
      const titleMatch = line.match(/title="([^"]+)"/i);
      promptTitle = titleMatch ? titleMatch[1] : 'AI Executive Prompt';
      const rest = line.replace(/^\[prompt[^\]]*\]/i, '').trim();

      if (rest.endsWith('[/prompt]')) {
        const singleContent = rest.replace(/\[\/prompt\]$/i, '').trim();
        htmlElements.push(
          <CodeBlock 
            key={`prompt-${index}`} 
            code={singleContent} 
            title={promptTitle} 
            language="PROMPT"
          />
        );
      } else {
        inPrompt = true;
        promptContent = rest ? [rest] : [];
      }
      return;
    }

    if (inPrompt) {
      if (line.trim().includes('[/prompt]') || line.trim().includes('[/PROMPT]')) {
        inPrompt = false;
        const cleanLine = line.replace(/\[\/prompt\]/i, '').trim();
        if (cleanLine) {
          promptContent.push(cleanLine);
        }
        htmlElements.push(
          <CodeBlock 
            key={`prompt-${index}`} 
            code={promptContent.join('\n')} 
            title={promptTitle} 
            language="PROMPT"
          />
        );
        promptContent = [];
      } else {
        promptContent.push(line);
      }
      return;
    }

    // Key Takeaways Shortcode: [key-takeaways] ... [/key-takeaways]
    if (line.trim().startsWith('[key-takeaways') || line.trim().startsWith('[KEY-TAKEAWAYS')) {
      const rest = line.replace(/^\[key-takeaways\]/i, '').trim();
      if (rest.endsWith('[/key-takeaways]')) {
        const singleContent = rest.replace(/\[\/key-takeaways\]$/i, '').trim();
        htmlElements.push(
          <div key={`takeaways-${index}`} className="my-8 rounded-2xl bg-gradient-to-br from-blue-50/70 via-indigo-50/50 to-purple-50/40 border border-blue-200/80 p-6 shadow-xs text-left">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[rgba(11,48,215)] text-white flex items-center justify-center shadow-xs">
                <Flame className="w-4 h-4 fill-current" />
              </div>
              <h4 className="text-base font-sans font-extrabold text-gray-900 tracking-tight uppercase">
                Key Takeaways & System Impact
              </h4>
            </div>
            <div className="text-sm sm:text-base text-gray-800 leading-relaxed font-sans">
              {parseInlineStyling(singleContent)}
            </div>
          </div>
        );
      } else {
        inKeyTakeaways = true;
        takeawaysContent = rest ? [rest] : [];
      }
      return;
    }

    if (inKeyTakeaways) {
      if (line.trim().includes('[/key-takeaways]')) {
        inKeyTakeaways = false;
        const cleanLine = line.replace(/\[\/key-takeaways\]/i, '').trim();
        if (cleanLine) takeawaysContent.push(cleanLine);
        htmlElements.push(
          <div key={`takeaways-${index}`} className="my-8 rounded-2xl bg-gradient-to-br from-blue-50/70 via-indigo-50/50 to-purple-50/40 border border-blue-200/80 p-6 shadow-xs text-left">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[rgba(11,48,215)] text-white flex items-center justify-center shadow-xs">
                <Flame className="w-4 h-4 fill-current" />
              </div>
              <h4 className="text-base font-sans font-extrabold text-gray-900 tracking-tight uppercase">
                Key Takeaways & System Impact
              </h4>
            </div>
            <div className="text-sm sm:text-base text-gray-800 leading-relaxed font-sans space-y-2">
              {parseMarkdown(takeawaysContent.join('\n'))}
            </div>
          </div>
        );
        takeawaysContent = [];
      } else {
        takeawaysContent.push(line);
      }
      return;
    }

    // Reveal shortcode container block: [reveal title="..."]
    if (line.trim().startsWith('[reveal') || line.trim().startsWith('[REVEAL')) {
      const titleMatch = line.match(/title="([^"]+)"/i);
      revealTitle = titleMatch ? titleMatch[1] : 'Click to Reveal Section';
      const rest = line.replace(/^\[reveal[^\]]*\]/i, '').trim();
      
      if (rest.endsWith('[/reveal]')) {
        const singleContent = rest.replace(/\[\/reveal\]$/i, '').trim();
        htmlElements.push(
          <RevealSection key={`reveal-${index}`} title={revealTitle}>
            {parseMarkdown(singleContent)}
          </RevealSection>
        );
      } else {
        inReveal = true;
        revealContent = rest ? [rest] : [];
      }
      return;
    }

    if (inReveal) {
      if (line.trim().includes('[/reveal]')) {
        inReveal = false;
        const cleanLine = line.replace(/\[\/reveal\]/i, '').trim();
        if (cleanLine) {
          revealContent.push(cleanLine);
        }
        htmlElements.push(
          <RevealSection key={`reveal-${index}`} title={revealTitle}>
            {parseMarkdown(revealContent.join('\n'))}
          </RevealSection>
        );
        revealContent = [];
      } else {
        revealContent.push(line);
      }
      return;
    }

    // Note Block Accumulator
    if (inNote) {
      if (line.trim().includes('[/note]') || line.trim().includes('[/NOTE]')) {
        inNote = false;
        const cleanLine = line.replace(/\[\/note\]/i, '').trim();
        if (cleanLine) {
          noteContent.push(cleanLine);
        }
        htmlElements.push(
          <div key={`note-${index}`} className="my-6 p-4.5 bg-blue-50/60 border-l-4 border-[rgba(11,48,215)] rounded-r-xl flex gap-3 items-start text-left shadow-2xs">
            <Info className="w-5 h-5 text-[rgba(11,48,215)] shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-mono font-extrabold text-[rgba(11,48,215)] uppercase tracking-wider block mb-0.5">Insight Note</span>
              <div className="text-sm text-gray-800 leading-relaxed font-sans font-medium">
                {parseInlineStyling(noteContent.join(' '))}
              </div>
            </div>
          </div>
        );
        noteContent = [];
      } else {
        noteContent.push(line);
      }
      return;
    }

    // Warning Block Accumulator
    if (inWarning) {
      if (line.trim().includes('[/warning]') || line.trim().includes('[/WARNING]')) {
        inWarning = false;
        const cleanLine = line.replace(/\[\/warning\]/i, '').trim();
        if (cleanLine) {
          warningContent.push(cleanLine);
        }
        htmlElements.push(
          <div key={`warning-${index}`} className="my-6 p-4.5 bg-amber-50/70 border-l-4 border-amber-500 rounded-r-xl flex gap-3 items-start text-left shadow-2xs">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-mono font-extrabold text-amber-700 uppercase tracking-wider block mb-0.5">Important Warning</span>
              <div className="text-sm text-amber-950 leading-relaxed font-sans font-medium">
                {parseInlineStyling(warningContent.join(' '))}
              </div>
            </div>
          </div>
        );
        warningContent = [];
      } else {
        warningContent.push(line);
      }
      return;
    }

    // Tip Block Accumulator
    if (inTip) {
      if (line.trim().includes('[/tip]') || line.trim().includes('[/TIP]')) {
        inTip = false;
        const cleanLine = line.replace(/\[\/tip\]/i, '').trim();
        if (cleanLine) {
          tipContent.push(cleanLine);
        }
        htmlElements.push(
          <div key={`tip-${index}`} className="my-6 p-4.5 bg-emerald-50/70 border-l-4 border-emerald-500 rounded-r-xl flex gap-3 items-start text-left shadow-2xs">
            <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-mono font-extrabold text-emerald-700 uppercase tracking-wider block mb-0.5">Pro Strategy Tip</span>
              <div className="text-sm text-emerald-950 leading-relaxed font-sans font-medium">
                {parseInlineStyling(tipContent.join(' '))}
              </div>
            </div>
          </div>
        );
        tipContent = [];
      } else {
        tipContent.push(line);
      }
      return;
    }

    // Quote Block Accumulator
    if (inQuoteBlock) {
      if (line.trim().includes('[/quote]') || line.trim().includes('[/QUOTE]')) {
        inQuoteBlock = false;
        const cleanLine = line.replace(/\[\/quote\]/i, '').trim();
        if (cleanLine) {
          quoteBlockContent.push(cleanLine);
        }
        htmlElements.push(
          <div key={`quote-${index}`} className="my-8 p-6 bg-gradient-to-r from-gray-50 to-slate-50 border-l-4 border-gray-900 rounded-r-2xl relative text-left shadow-2xs">
            <Quote className="w-8 h-8 text-gray-200 absolute top-3 right-4 transform rotate-180 pointer-events-none" />
            <p className="text-base sm:text-lg italic text-gray-900 font-bold leading-relaxed relative z-10 font-sans">
              "{parseInlineStyling(quoteBlockContent.join(' '))}"
            </p>
          </div>
        );
        quoteBlockContent = [];
      } else {
        quoteBlockContent.push(line);
      }
      return;
    }

    // Video check (shortcode syntax)
    if (line.trim().startsWith('[video') || line.trim().startsWith('[VIDEO')) {
      const urlMatch = line.match(/url="([^"]+)"/i) || line.match(/src="([^"]+)"/i);
      const url = urlMatch ? urlMatch[1] : line.replace(/^\[video[^\]]*\]/i, '').replace(/\[\/video\]/i, '').trim();
      if (url) {
        htmlElements.push(<VideoBlock key={`video-${index}`} url={url} />);
      }
      return;
    }

    // Markdown image check: ![alt](url)
    if (line.trim().startsWith('![')) {
      const match = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)/);
      if (match) {
        const alt = match[1];
        const url = match[2];
        htmlElements.push(<BlogImage key={`img-${index}`} src={url} alt={alt} caption={alt} />);
        return;
      }
    }

    // Custom image shortcode check: [image url="..." alt="..." caption="..."]
    if (line.trim().startsWith('[image') || line.trim().startsWith('[IMAGE')) {
      const urlMatch = line.match(/url="([^"]+)"/i) || line.match(/src="([^"]+)"/i);
      const altMatch = line.match(/alt="([^"]+)"/i);
      const capMatch = line.match(/caption="([^"]+)"/i);
      const url = urlMatch ? urlMatch[1] : '';
      const alt = altMatch ? altMatch[1] : '';
      const caption = capMatch ? capMatch[1] : alt;
      if (url) {
        htmlElements.push(<BlogImage key={`img-${index}`} src={url} alt={alt} caption={caption} />);
      }
      return;
    }

    // Note Block Open Check
    if (line.trim().startsWith('[note') || line.trim().startsWith('[NOTE')) {
      const rest = line.replace(/^\[note\]/i, '').trim();
      if (rest.endsWith('[/note]')) {
        const singleContent = rest.replace(/\[\/note\]$/i, '').trim();
        htmlElements.push(
          <div key={`note-${index}`} className="my-6 p-4.5 bg-blue-50/60 border-l-4 border-[rgba(11,48,215)] rounded-r-xl flex gap-3 items-start text-left shadow-2xs">
            <Info className="w-5 h-5 text-[rgba(11,48,215)] shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-mono font-extrabold text-[rgba(11,48,215)] uppercase tracking-wider block mb-0.5">Insight Note</span>
              <div className="text-sm text-gray-800 leading-relaxed font-sans font-medium">
                {parseInlineStyling(singleContent)}
              </div>
            </div>
          </div>
        );
      } else {
        inNote = true;
        noteContent = rest ? [rest] : [];
      }
      return;
    }

    // Warning Block Open Check
    if (line.trim().startsWith('[warning') || line.trim().startsWith('[WARNING')) {
      const rest = line.replace(/^\[warning\]/i, '').trim();
      if (rest.endsWith('[/warning]')) {
        const singleContent = rest.replace(/\[\/warning\]$/i, '').trim();
        htmlElements.push(
          <div key={`warning-${index}`} className="my-6 p-4.5 bg-amber-50/70 border-l-4 border-amber-500 rounded-r-xl flex gap-3 items-start text-left shadow-2xs">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-mono font-extrabold text-amber-700 uppercase tracking-wider block mb-0.5">Important Warning</span>
              <div className="text-sm text-amber-950 leading-relaxed font-sans font-medium">
                {parseInlineStyling(singleContent)}
              </div>
            </div>
          </div>
        );
      } else {
        inWarning = true;
        warningContent = rest ? [rest] : [];
      }
      return;
    }

    // Tip Block Open Check
    if (line.trim().startsWith('[tip') || line.trim().startsWith('[TIP')) {
      const rest = line.replace(/^\[tip\]/i, '').trim();
      if (rest.endsWith('[/tip]')) {
        const singleContent = rest.replace(/\[\/tip\]$/i, '').trim();
        htmlElements.push(
          <div key={`tip-${index}`} className="my-6 p-4.5 bg-emerald-50/70 border-l-4 border-emerald-500 rounded-r-xl flex gap-3 items-start text-left shadow-2xs">
            <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-mono font-extrabold text-emerald-700 uppercase tracking-wider block mb-0.5">Pro Strategy Tip</span>
              <div className="text-sm text-emerald-950 leading-relaxed font-sans font-medium">
                {parseInlineStyling(singleContent)}
              </div>
            </div>
          </div>
        );
      } else {
        inTip = true;
        tipContent = rest ? [rest] : [];
      }
      return;
    }

    // Quote Block Open Check
    if (line.trim().startsWith('[quote') || line.trim().startsWith('[QUOTE')) {
      const rest = line.replace(/^\[quote\]/i, '').trim();
      if (rest.endsWith('[/quote]')) {
        const singleContent = rest.replace(/\[\/quote\]$/i, '').trim();
        htmlElements.push(
          <div key={`quote-${index}`} className="my-8 p-6 bg-gradient-to-r from-gray-50 to-slate-50 border-l-4 border-gray-900 rounded-r-2xl relative text-left shadow-2xs">
            <Quote className="w-8 h-8 text-gray-200 absolute top-3 right-4 transform rotate-180 pointer-events-none" />
            <p className="text-base sm:text-lg italic text-gray-900 font-bold leading-relaxed relative z-10 font-sans">
              "{parseInlineStyling(singleContent)}"
            </p>
          </div>
        );
      } else {
        inQuoteBlock = true;
        quoteBlockContent = rest ? [rest] : [];
      }
      return;
    }

    // Shortcode Check: [check] or [CHECK]
    if (line.trim().startsWith('[check]') || line.trim().startsWith('[CHECK]')) {
      const content = line.replace(/^\[check\]/i, '').replace(/\[\/check\]/i, '').trim();
      htmlElements.push(
        <div key={`check-${index}`} className="flex items-start gap-3 my-3 text-left">
          <div className="w-5 h-5 rounded-full bg-[rgba(11,48,215)]/10 text-[rgba(11,48,215)] flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="text-gray-800 text-base leading-relaxed font-sans font-medium">
            {parseInlineStyling(content)}
          </span>
        </div>
      );
      return;
    }

    // Horizontal Rule replacement (---)
    if (line.trim() === '---' || line.trim() === '***') {
      htmlElements.push(
        <div key={`hr-${index}`} className="my-10 flex items-center justify-center gap-3 select-none">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent flex-1" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <span className="w-2 h-2 rounded-full bg-[rgba(11,48,215)]/40" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent flex-1" />
        </div>
      );
      return;
    }

    // List Check (- or *) with custom styled colored bullet point indicator
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const itemText = line.replace(/^[-*]\s+/, '');
      const formattedText = parseInlineStyling(itemText);
      htmlElements.push(
        <li key={`li-${index}`} className="flex items-start gap-3 my-2.5 text-gray-800 text-base sm:text-[17px] leading-relaxed font-sans">
          <span className="w-2 h-2 rounded-full bg-[rgba(11,48,215)] shrink-0 mt-2.5 shadow-2xs" />
          <span className="flex-1">{formattedText}</span>
        </li>
      );
      return;
    }

    // Numbered List Check (1., 2., 25., etc.) with stylish gradient number badge
    const numberedListMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
    if (numberedListMatch) {
      const num = numberedListMatch[1];
      const itemText = numberedListMatch[2];
      const formattedText = parseInlineStyling(itemText);
      htmlElements.push(
        <li key={`num-li-${index}`} className="flex items-start gap-3.5 my-3 text-gray-800 text-base sm:text-[17px] leading-relaxed font-sans group">
          <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[rgba(11,48,215)] to-[rgba(0,143,255)] text-white text-xs font-mono font-extrabold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs group-hover:scale-105 transition-transform">
            {num}
          </span>
          <span className="flex-1">{formattedText}</span>
        </li>
      );
      return;
    }

    // Step Headings Check
    if (line.trim().startsWith('### Step ') || line.trim().startsWith('### STEP ') || line.trim().startsWith('### step ')) {
      const rawText = line.replace(/^###\s+/, '');
      const match = rawText.match(/^(Step\s+\d+):\s*(.*)/i);
      const headingText = rawText;
      const headingId = getHeadingId(headingText);

      if (match) {
        const stepNum = match[1];
        const stepTitle = match[2];
        htmlElements.push(
          <div id={headingId} key={`step-${index}`} className="mt-10 mb-4 flex items-center gap-3 bg-gradient-to-r from-gray-50 to-blue-50/30 border border-gray-200/80 p-4.5 rounded-2xl shadow-2xs text-left scroll-mt-24">
            <span className="shrink-0 bg-gradient-to-r from-[rgba(0,143,255)] to-[rgba(11,48,215)] text-white text-[11px] font-mono font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-xs">
              {stepNum}
            </span>
            <h4 className="text-lg sm:text-xl font-sans font-extrabold text-gray-900 tracking-tight">
              {stepTitle}
            </h4>
          </div>
        );
      } else {
        htmlElements.push(
          <h4 id={headingId} key={`h3-${index}`} className="text-lg sm:text-xl font-sans font-extrabold text-gray-900 mt-8 mb-3 tracking-tight scroll-mt-24">
            {rawText}
          </h4>
        );
      }
      return;
    }

    // H3 Headings
    if (line.trim().startsWith('### ')) {
      const headingText = line.replace(/^###\s+/, '');
      const headingId = getHeadingId(headingText);

      // Check if it's a numbered rank heading like "### 1. ChatGPT Plus (OpenAI)" or "### #1 — ChatGPT Plus"
      const rankMatch = headingText.match(/^(?:#|Tool\s+)?(\d+)[\.\s—-]+(.*)/i);
      if (rankMatch) {
        const rankNum = rankMatch[1].padStart(2, '0');
        const toolTitle = rankMatch[2].trim();
        htmlElements.push(
          <div id={headingId} key={`rank-heading-${index}`} className="mt-10 mb-5 p-4 sm:p-4.5 rounded-2xl bg-gradient-to-r from-slate-50/90 via-white to-blue-50/30 border border-slate-200/90 shadow-2xs hover:border-blue-200/90 transition-all flex items-center gap-3.5 scroll-mt-24 text-left group">
            <span className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[rgba(11,48,215)] to-[rgba(0,143,255)] text-white text-sm font-mono font-bold flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              #{rankNum}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg sm:text-xl font-sans font-extrabold text-slate-900 tracking-tight truncate">
                {toolTitle}
              </h4>
            </div>
            <span className="hidden sm:inline-flex text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[rgba(11,48,215)] border border-blue-100/80">
              Rank #{rankNum}
            </span>
          </div>
        );
        return;
      }

      htmlElements.push(
        <h4 id={headingId} key={`h3-${index}`} className="text-lg sm:text-xl font-sans font-extrabold text-gray-900 mt-8 mb-3 tracking-tight scroll-mt-24 text-left">
          {headingText}
        </h4>
      );
      return;
    }

    // H2 Headings
    if (line.trim().startsWith('## ')) {
      const headingText = line.replace(/^##\s+/, '');
      const headingId = getHeadingId(headingText);
      htmlElements.push(
        <h3 id={headingId} key={`h2-${index}`} className="text-xl sm:text-2xl font-sans font-extrabold text-gray-900 mt-12 mb-4 pb-2 border-b-2 border-gray-100 tracking-tight scroll-mt-24 text-left flex items-center gap-2.5">
          <span className="w-2 h-6 rounded-xs bg-[rgba(11,48,215)] shrink-0" />
          <span>{headingText}</span>
        </h3>
      );
      return;
    }

    // H1 Headings
    if (line.trim().startsWith('# ')) {
      const headingText = line.replace(/^#\s+/, '');
      const headingId = getHeadingId(headingText);
      htmlElements.push(
        <h2 id={headingId} key={`h1-${index}`} className="text-2xl sm:text-3xl font-sans font-extrabold text-gray-900 mt-14 mb-5 pb-3 border-b-2 border-[rgba(11,48,215)]/20 tracking-tight scroll-mt-24 text-left">
          {headingText}
        </h2>
      );
      return;
    }

    // Blockquote Check
    if (line.trim().startsWith('> ')) {
      htmlElements.push(
        <blockquote key={`quote-${index}`} className="border-l-4 border-[rgba(11,48,215)] pl-4.5 my-6 italic text-gray-800 bg-blue-50/30 py-3 rounded-r-xl font-sans font-medium text-left">
          {line.replace(/^>\s+/, '')}
        </blockquote>
      );
      return;
    }

    // Standard Markdown Table Parser
    if (line.trim().startsWith('|')) {
      const tableLines: string[] = [];
      let tempIdx = index;
      while (tempIdx < lines.length && lines[tempIdx].trim().startsWith('|')) {
        tableLines.push(lines[tempIdx]);
        tempIdx++;
      }
      lastProcessedTableLineIdx = tempIdx - 1;

      const { headers, rows } = parseTableLines(tableLines);
      if (headers.length > 0) {
        htmlElements.push(
          <StyledTable key={`tbl-${index}`} headers={headers} rows={rows} />
        );
      }
      return;
    }

    // Normal Paragraph
    if (line.trim() !== '') {
      htmlElements.push(
        <p key={`p-${index}`} className="text-gray-800 text-base sm:text-[17px] leading-relaxed mb-6 font-sans">
          {parseInlineStyling(line)}
        </p>
      );
    }
  });

  return htmlElements;
}

// Convert **text** to <strong>text</strong> or code elements inline
function parseInlineStyling(text: string): (string | React.ReactNode)[] {
  const parts: (string | React.ReactNode)[] = [];
  let currentIndex = 0;

  // Since we are running in simple client-side, let's do a basic sequential check
  // For the sake of reliability, we will parse bold and inline code simply:
  let tempText = text;
  
  // Quick check for bold or inline code
  if (!tempText.includes('**') && !tempText.includes('`') && !tempText.includes('[')) {
    return [text];
  }

  // Fallback to simple highlighted elements if matches are present:
  // Let's do a simple splitting logic for bold (**):
  const splittedBold = tempText.split('**');
  const elements: (string | React.ReactNode)[] = [];
  
  splittedBold.forEach((part, idx) => {
    if (idx % 2 === 1) {
      // Bold element
      elements.push(<strong key={idx} className="font-semibold text-gray-900">{part}</strong>);
    } else {
      // Non-bold element, check if it contains code `
      const splittedCode = part.split('`');
      splittedCode.forEach((cPart, cIdx) => {
        if (cIdx % 2 === 1) {
          elements.push(
            <code key={`code-${idx}-${cIdx}`} className="bg-gray-100 text-[rgba(11,48,215)] text-xs font-mono px-1.5 py-0.5 rounded-sm">
              {cPart}
            </code>
          );
        } else {
          // Check for link [label](url)
          if (cPart.includes('[') && cPart.includes(']')) {
            const linkMatch = cPart.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (linkMatch) {
              const [full, label, url] = linkMatch;
              const beforeLink = cPart.substring(0, linkMatch.index);
              const afterLink = cPart.substring((linkMatch.index || 0) + full.length);
              
              if (beforeLink) elements.push(beforeLink);
              elements.push(
                <a 
                  key={`link-${idx}`} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[rgba(11,48,215)] font-medium border-b border-dashed border-[rgba(11,48,215)]/40 hover:border-[rgba(11,48,215)] hover:text-[rgba(80,13,174)] hover:bg-blue-50/30 transition-all px-0.5 rounded-xs"
                >
                  {label}
                </a>
              );
              if (afterLink) elements.push(afterLink);
            } else {
              elements.push(cPart);
            }
          } else {
            elements.push(cPart);
          }
        }
      });
    }
  });

  return elements;
}

const getBasePath = () => {
  if (typeof window === 'undefined') return '';
  const initialPath = window.location.pathname;
  const segments = initialPath.split('/').filter(Boolean);
  if (segments.length > 0) {
    const firstSegment = segments[0];
    const isKnownSlug = BLOG_POSTS.some(p => p.slug === firstSegment);
    const isCategory = firstSegment === 'category';
    if (!isKnownSlug && !isCategory) {
      return `/${firstSegment}`;
    }
  }
  return '';
};

export default function BlogPostComponent({ post, onBack }: BlogPostProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isShareExpanded, setIsShareExpanded] = useState(false);

  // Dynamic comment states
  const [comments, setComments] = useState<Array<{ id: string; name: string; content: string; date: string; likes?: number }>>([]);
  const [commentName, setCommentName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);

  const basePath = getBasePath();

  const handleNavigateToPost = (otherPost: BlogPost) => {
    window.history.pushState(null, '', `${basePath}/${otherPost.slug}`);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load comments from API with local fallback
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments/${post.slug}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
          localStorage.setItem(`comments-${post.slug}`, JSON.stringify(data));
          return;
        }
      } catch (err) {
        console.error("Backend fetch comments failed, using localStorage fallback", err);
      }

      const savedComments = localStorage.getItem(`comments-${post.slug}`);
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      } else {
        const seedComments = [
          {
            id: 'seed-1',
            name: 'Sarah Jenkins',
            content: `This is incredibly insightful. I implemented the automated triage process on our support email pipeline using your exact routing blueprint and we saved roughly 10 hours in the first week. The sitemap generation advice is also critical for indexing. Thank you!`,
            date: '2026-07-16',
            likes: 5
          }
        ];
        setComments(seedComments);
        localStorage.setItem(`comments-${post.slug}`, JSON.stringify(seedComments));
      }
    };

    fetchComments();
  }, [post.slug]);

  const handleLikeComment = async (commentId: string) => {
    const key = `comment-liked-${post.slug}-${commentId}`;
    const alreadyLiked = localStorage.getItem(key) === 'true';
    const endpoint = alreadyLiked ? 'unlike' : 'like';

    try {
      const res = await fetch(`/api/comments/${post.slug}/${commentId}/${endpoint}`, {
        method: 'POST'
      });
      if (res.ok) {
        if (alreadyLiked) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, 'true');
        }
        
        const freshRes = await fetch(`/api/comments/${post.slug}`);
        if (freshRes.ok) {
          const freshData = await freshRes.json();
          setComments(freshData);
          localStorage.setItem(`comments-${post.slug}`, JSON.stringify(freshData));
          return;
        }
      }
    } catch (err) {
      console.error("Like backend sync failed, using local only", err);
    }

    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        const currentLikes = c.likes || 0;
        if (alreadyLiked) {
          localStorage.removeItem(key);
          return { ...c, likes: Math.max(0, currentLikes - 1) };
        } else {
          localStorage.setItem(key, 'true');
          return { ...c, likes: currentLikes + 1 };
        }
      }
      return c;
    });
    setComments(updatedComments);
    localStorage.setItem(`comments-${post.slug}`, JSON.stringify(updatedComments));
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments/${post.slug}/${commentId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
        localStorage.setItem(`comments-${post.slug}`, JSON.stringify(data.comments));
        return;
      }
    } catch (err) {
      console.error("Delete backend sync failed, using local only", err);
    }

    const updatedComments = comments.filter(c => c.id !== commentId);
    setComments(updatedComments);
    localStorage.setItem(`comments-${post.slug}`, JSON.stringify(updatedComments));
  };

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}/${post.slug}` : `https://blog.zenire.in/${post.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentContent.trim()) return;

    const newCommentPayload = {
      name: commentName.trim(),
      content: commentContent.trim()
    };

    try {
      const res = await fetch(`/api/comments/${post.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCommentPayload)
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data);
        localStorage.setItem(`comments-${post.slug}`, JSON.stringify(data));
        setCommentName('');
        setCommentContent('');
        return;
      }
    } catch (err) {
      console.error("Post comment to backend failed, applying local fallback", err);
    }

    const localNewComment = {
      id: "comment_" + Date.now(),
      name: commentName.trim(),
      content: commentContent.trim(),
      date: new Date().toISOString().split('T')[0],
      likes: 0
    };
    const updatedComments = [localNewComment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`comments-${post.slug}`, JSON.stringify(updatedComments));
    setCommentName('');
    setCommentContent('');
  };

  return (
    <article className="min-h-screen bg-[#FDFDFB] pb-20 relative">
      
      {/* Sticky Social Share Floating Widget on the Right (Visible on all devices, ultra-narrow, transparent outline) */}
      <div className="fixed right-2 sm:right-4 top-1/3 flex flex-col items-center gap-2 z-40">
        {/* Collapsed Trigger Button with circular scroll progress outline indicator */}
        <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center">
          {/* Circular progress outline */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none">
            {/* Background circle */}
            <circle
              cx="50%"
              cy="50%"
              r="17"
              className="stroke-gray-150 fill-none"
              strokeWidth="2"
            />
            {/* Active progress circle */}
            <circle
              cx="50%"
              cy="50%"
              r="17"
              className="stroke-[rgba(11,48,215)] fill-none transition-all duration-75"
              strokeWidth="2.5"
              strokeDasharray="106.8"
              strokeDashoffset={106.8 - (106.8 * scrollProgress) / 100}
              strokeLinecap="round"
            />
          </svg>

          {/* Collapsed Trigger Button */}
          <button
            onClick={() => setIsShareExpanded(!isShareExpanded)}
            title={isShareExpanded ? "Collapse sharing options" : "Expand sharing options"}
            className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm ${
              isShareExpanded 
                ? 'bg-gradient-to-r from-[rgba(0,143,255)] via-[rgba(11,48,215)] to-[rgba(80,13,174)] text-white rotate-45' 
                : 'bg-white hover:bg-gray-50 text-gray-700'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Expanded Stack (Narrow, sleek and transparent outline) */}
        {isShareExpanded && (
          <div className="flex flex-col items-center gap-2.5 bg-white/95 backdrop-blur-xs p-1.5 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.06)] animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              title="Copy Link"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 hover:scale-110 transition-transform cursor-pointer"
            >
              {copiedLink ? <Check className="w-3 h-3 text-green-600 animate-pulse" /> : <Copy className="w-3 h-3" />}
            </button>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Facebook"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:scale-110 transition-all cursor-pointer"
            >
              <Facebook className="w-3 h-3 fill-current" />
            </a>

            {/* Twitter / X */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on X"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-black/5 text-black hover:bg-black hover:text-white hover:scale-110 transition-all cursor-pointer"
            >
              <Twitter className="w-3 h-3 fill-current" />
            </a>

            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on WhatsApp"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white hover:scale-110 transition-all cursor-pointer"
            >
              <MessageCircle className="w-3 h-3 fill-current" />
            </a>

            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on LinkedIn"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white hover:scale-110 transition-all cursor-pointer"
            >
              <Linkedin className="w-3 h-3" />
            </a>

            {/* Bookmark */}
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              title={isBookmarked ? "Bookmarked" : "Bookmark article"}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${
                isBookmarked ? 'bg-[rgba(11,48,215)] text-white' : 'bg-blue-50 text-[rgba(11,48,215)] hover:bg-blue-100'
              }`}
            >
              <Bookmark className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[rgba(0,143,255)] via-[rgba(11,48,215)] to-[rgba(80,13,174)] z-50 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-5xl mx-auto px-3.5 sm:px-4 lg:px-6 pt-4">
        
        {/* Google Breadcrumbs (GSC and Schema.org compliant) */}
        <nav aria-label="Breadcrumb" className="mb-4.5 flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-sans text-gray-400 tracking-wide select-none">
          <button 
            onClick={onBack}
            className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer font-medium"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <span className="text-gray-300">/</span>
          <button 
            onClick={() => {
              window.history.pushState(null, '', `${basePath}/category/${encodeURIComponent(post.category)}`);
              window.dispatchEvent(new Event('popstate'));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer font-medium"
          >
            {post.category}
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-400 truncate max-w-[150px] sm:max-w-[320px] font-normal">
            {post.title}
          </span>

          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": `${typeof window !== 'undefined' ? window.location.origin : 'https://blog.zenire.in'}/`
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": post.category,
                  "item": `${typeof window !== 'undefined' ? window.location.origin : 'https://blog.zenire.in'}/category/${encodeURIComponent(post.category)}`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": post.title,
                  "item": typeof window !== 'undefined' ? window.location.href : `https://blog.zenire.in/${post.slug}`
                }
              ]
            })}
          </script>
        </nav>

        {/* Back Navigation */}
        <button
          onClick={onBack}
          className="hidden sm:inline-flex items-center gap-2 text-sm font-sans font-medium text-gray-500 hover:text-gray-900 group cursor-pointer mb-5"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
          Back to all articles
        </button>

        {/* Category & Title */}
        <div className="mb-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold text-gray-900 leading-tight tracking-tight">
            {post.title}
          </h1>
        </div>

        {/* Author & Read Stats */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-150 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <span className="text-sm font-sans font-semibold text-gray-900 block leading-tight">
                {post.author.name}
              </span>
              <span className="text-xs text-gray-400 block font-mono mt-0.5">
                {post.author.role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-[13px] font-sans text-gray-400 select-none">
            <span className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
              <Calendar className="w-4 h-4 text-gray-300" />
              <time dateTime={post.date} className="font-medium text-gray-500">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
              <Clock className="w-4 h-4 text-gray-300" />
              <span className="font-medium text-gray-500">{post.readTime}</span>
            </span>
          </div>
        </div>

        {/* Feature Hero Image */}
        <div className="relative rounded-2xl overflow-hidden aspect-video w-full bg-gray-100 shadow-xs mb-6 group">
          <img
            src={getImageUrl(post.coverImage)}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
          />
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a
              href={`https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&media=${encodeURIComponent(getImageUrl(post.coverImage))}&description=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#E60023] text-white font-sans font-extrabold text-xs uppercase tracking-wider px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg hover:bg-[#b8001c] active:scale-95 transition-all cursor-pointer"
              title="Save to Pinterest"
            >
              <PinterestIcon className="w-3.5 h-3.5 fill-current" />
              <span>Save Pin</span>
            </a>
          </div>
        </div>

        {/* Centered spacious reading layout with zero overlapping elements */}
        <div className="max-w-3xl mx-auto">
          {/* Automatic Table of Contents */}
          <TableOfContents items={extractTableOfContents(post.content)} />

          <div className="space-y-4 text-left leading-relaxed">
            <div className="prose prose-teal max-w-none">
              {parseMarkdown(post.content)}
            </div>

            {/* Tags section */}
            <div className="pt-8 border-t border-gray-150 mt-10">
              <h4 className="text-xs font-mono font-medium text-gray-500 uppercase tracking-widest mb-3">
                Indexed Semantic Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-sans text-gray-600 bg-gray-100 border border-gray-150"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Share Buttons (Image-inspired High-Fidelity Interactive Block) */}
            <div className="pt-8 border-t border-gray-150 mt-10">
              <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-4">
                Share This Article
              </h4>
              <div className="flex flex-wrap gap-3 items-center">
                {/* Facebook Pill */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2]/5 text-xs font-sans font-bold transition-all duration-200 shadow-xs cursor-pointer"
                >
                  <Facebook className="w-3.5 h-3.5 fill-current" />
                  <span>Facebook</span>
                </a>

                {/* Twitter Pill */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1DA1F2] text-[#1DA1F2] hover:bg-[#1DA1F2]/5 text-xs font-sans font-bold transition-all duration-200 shadow-xs cursor-pointer"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  <span>Twitter</span>
                </a>

                {/* Pinterest Pill */}
                <a
                  href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&description=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#BD081C] text-[#BD081C] hover:bg-[#BD081C]/5 text-xs font-sans font-bold transition-all duration-200 shadow-xs cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Pinterest</span>
                </a>

                {/* WhatsApp Rectangle */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-sans font-bold transition-all duration-200 shadow-md cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>

                {/* Slack Rectangle */}
                <a
                  href={`https://slack.com/share?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border border-[#E01E5A] text-[#E01E5A] hover:bg-[#E01E5A]/5 text-xs font-sans font-bold transition-all duration-200 shadow-xs cursor-pointer"
                >
                  <Slack className="w-3.5 h-3.5" />
                  <span>Slack</span>
                </a>

                {/* Skype Rectangle */}
                <a
                  href={`https://web.skype.com/share?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border border-[#00AFF0] text-[#00AFF0] hover:bg-[#00AFF0]/5 text-xs font-sans font-bold transition-all duration-200 shadow-xs cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Skype</span>
                </a>

                {/* LinkedIn Rectangle */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2]/5 text-xs font-sans font-bold transition-all duration-200 shadow-xs cursor-pointer"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Author Profile Bio Card (Condensed, High-Density Design) */}
            <div className="bg-[#FBFBF9] rounded-xl p-2.5 mt-6 flex flex-row gap-4 items-center">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                      Author
                    </span>
                    <h4 className="text-sm font-sans font-extrabold text-gray-900 leading-tight">
                      {post.author.name}
                    </h4>
                  </div>
                  <div className="flex gap-2">
                    {post.author.twitter && (
                      <a
                        href={`https://twitter.com/${post.author.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[rgba(11,48,215)] transition-colors p-1"
                      >
                        <Twitter className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {post.author.github && (
                      <a
                        href={`https://github.com/${post.author.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[rgba(11,48,215)] transition-colors p-1"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed font-sans line-clamp-2">
                  {post.author.bio}
                </p>
              </div>
            </div>

            {/* Comment Section (Collapsible - Placed right below the Author Profile Bio Card) */}
            <div className="pt-8 border-t border-gray-150 mt-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-[#FBFBF9] border border-gray-150">
                <div>
                  <h3 className="text-base sm:text-lg font-sans font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[rgba(11,48,215)]" />
                    Reader Discussions ({comments.length})
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-sans">
                    Join the automated validation dialogue and insights.
                  </p>
                </div>
                <button
                  onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
                  className="px-5 py-2.5 bg-gray-900 hover:bg-[rgba(11,48,215)] text-white font-bold rounded-xl text-xs cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-[rgba(11,48,215)]/10 active:scale-98 shrink-0"
                >
                  <span>{isCommentsExpanded ? 'Hide Discussions' : 'Show Comments & Join'}</span>
                  <span className="bg-white/20 text-white rounded-full px-1.5 py-0.5 text-[9px] font-bold">
                    {comments.length}
                  </span>
                </button>
              </div>
              
              {isCommentsExpanded && (
                <div className="mt-8 space-y-6">
                  <form onSubmit={handleAddComment} className="space-y-4 bg-white p-5 border border-gray-150 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                    <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wide block">
                      Share Your Thoughts
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[rgba(11,48,215)]/20 focus:border-[rgba(11,48,215)]"
                      />
                      <div className="text-[10px] text-gray-400 font-sans flex items-center sm:justify-end">
                        Comment moderation is active. Live instant preview.
                      </div>
                    </div>
                    <textarea
                      required
                      rows={3}
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="Add your insightful comment... Supports instant real-time discussion."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[rgba(11,48,215)]/20 focus:border-[rgba(11,48,215)]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-[rgba(0,143,255)] to-[rgba(11,48,215)] hover:brightness-110 text-white font-bold rounded-lg text-sm cursor-pointer transition-all"
                    >
                      Post Discussion Comment
                    </button>
                  </form>

                  {/* Listed Comments */}
                  <div className="space-y-3 mt-6">
                    {comments.length === 0 ? (
                      <p className="text-sm text-gray-400 italic text-center py-6">No comments posted yet. Be the first to share your thoughts!</p>
                    ) : (
                      comments.map((comment) => {
                        const key = `comment-liked-${post.slug}-${comment.id}`;
                        const isLiked = localStorage.getItem(key) === 'true';
                        
                        return (
                          <div key={comment.id} className="p-4 border border-gray-150 rounded-xl bg-gray-50/50 flex gap-4 items-start hover:border-gray-200 transition-colors">
                            <div className={`w-8 h-8 rounded-full ${getAvatarColor(comment.name)} text-white font-sans font-bold flex items-center justify-center text-xs shrink-0 shadow-xs`}>
                              {getInitials(comment.name)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-sans font-bold text-gray-800">{comment.name}</span>
                                <span className="text-[10px] font-mono text-gray-400">{comment.date}</span>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed font-sans">{comment.content}</p>
                              
                              {/* Interactive actions */}
                              <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-gray-100/50">
                                <button
                                  onClick={() => handleLikeComment(comment.id)}
                                  className={`flex items-center gap-1.5 text-xs font-mono font-medium transition-colors cursor-pointer ${
                                    isLiked ? 'text-red-500 font-bold' : 'text-gray-400 hover:text-red-500'
                                  }`}
                                >
                                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                                  <span>{comment.likes || 0} Likes</span>
                                </button>
                                
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="flex items-center gap-1 text-xs font-mono text-gray-400 hover:text-red-600 transition-colors ml-auto cursor-pointer"
                                  title="Delete comment"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Related Publications Section */}
            {(() => {
              const relatedPosts = BLOG_POSTS.filter(p => p.slug !== post.slug && (p.category === post.category || p.tags.some(tag => post.tags.includes(tag)))).slice(0, 3);
              if (relatedPosts.length < 3) {
                const otherPosts = BLOG_POSTS.filter(p => p.slug !== post.slug && !relatedPosts.some(r => r.id === p.id)).slice(0, 3 - relatedPosts.length);
                relatedPosts.push(...otherPosts);
              }

              const popularPosts = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 5);

              return (
                <>
                  {/* Related Publications Section */}
                  <div className="pt-12 border-t border-gray-150 mt-16">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="bg-violet-50 p-2 text-violet-600 rounded-full flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-sans font-black text-gray-900 tracking-tight">
                          Related Reads
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          More insights on AI, careers, hiring and education.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-0 divide-y divide-gray-100/80 mt-4 bg-transparent">
                      {relatedPosts.map((otherPost) => {
                        const styles = getCategoryStyle(otherPost.category, otherPost.title);
                        return (
                          <button
                            key={otherPost.id}
                            onClick={() => handleNavigateToPost(otherPost)}
                            className="group text-left w-full flex flex-row items-center gap-3 sm:gap-4 py-3 bg-transparent hover:bg-gray-50/40 px-2 -mx-2 rounded-xl transition-all duration-300 cursor-pointer"
                          >
                            {/* Left Image */}
                            <div className="relative w-20 h-16 sm:w-48 sm:h-32 shrink-0 overflow-hidden rounded-xl bg-gray-50 aspect-video sm:aspect-auto">
                              <img
                                src={otherPost.coverImage}
                                alt={otherPost.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                              />
                            </div>

                            {/* Details Container */}
                            <div className="flex-1 flex flex-col h-full py-1 min-w-0">
                              <div>
                                {/* Title */}
                                <h4 className="text-xs sm:text-base md:text-lg font-sans font-extrabold text-gray-900 group-hover:text-[rgba(11,48,215)] transition-colors leading-tight sm:leading-snug tracking-tight mb-1">
                                  {otherPost.title}
                                </h4>

                                {/* Excerpt */}
                                <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm leading-normal sm:leading-relaxed mb-1 sm:mb-1.5 line-clamp-1 sm:line-clamp-2">
                                  {otherPost.excerpt}
                                </p>
                              </div>

                              {/* Metadata Footer */}
                              <div className="flex items-center gap-2 sm:gap-4 text-[9px] sm:text-xs font-mono text-gray-400 mt-auto">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                                  {otherPost.readTime}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                                  {new Date(otherPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Most Popular Publications Section - Same layout language but slightly different! */}
                  <div className="pt-12 border-t border-gray-150 mt-12">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="bg-blue-50 p-2.5 text-[rgba(11,48,215)] rounded-full flex items-center justify-center shrink-0">
                        <Flame className="w-5 h-5 fill-current" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-sans font-black text-gray-900 tracking-tight">
                          Trending Reads
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          The absolute highest-traffic conceptual guides this month.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-0 divide-y divide-gray-100/80 mt-4 bg-transparent">
                      {popularPosts.map((popPost, idx) => {
                        const styles = getCategoryStyle(popPost.category, popPost.title);
                        return (
                          <button
                            key={popPost.id}
                            onClick={() => handleNavigateToPost(popPost)}
                            className="group text-left w-full flex flex-row items-center gap-3 sm:gap-4 py-3 bg-transparent hover:bg-gray-50/40 px-2 -mx-2 rounded-xl transition-all duration-300 cursor-pointer"
                          >
                            {/* Left Side: Number Badge */}
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-mono font-black text-base ${styles.numberBg}`}>
                              {idx + 1}
                            </div>

                            {/* Details Container */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-mono text-gray-400">
                                  {popPost.readTime}
                                </span>
                              </div>
                              <h4 className="text-sm sm:text-base font-sans font-extrabold text-gray-900 group-hover:text-[rgba(11,48,215)] transition-colors line-clamp-2 leading-snug tracking-tight mb-1">
                                {popPost.title}
                              </h4>
                              <p className="text-gray-500 text-xs leading-normal line-clamp-2">
                                {popPost.excerpt}
                              </p>
                            </div>

                            {/* Arrow Button */}
                            <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ml-auto ${styles.arrowBg}`}>
                              <ArrowRight className={`w-3 h-3 sm:w-4.5 sm:h-4.5 transition-transform group-hover:translate-x-0.5 ${styles.arrowIcon}`} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              );
            })()}

          </div>

        </div>

      </div>
    </article>
  );
}
