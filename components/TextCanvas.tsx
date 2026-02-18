"use client";

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import html2canvas from 'html2canvas';

interface TextCanvasProps {
  text: string;
  author: string;
  fontSize: number;
}

const TextCanvas = forwardRef(({ text, author, fontSize }: TextCanvasProps, ref) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  // 强化版 Markdown 解析逻辑：支持引用块 + 两端对齐
  const parseMarkdown = (md: string, baseSize: number) => {
    // 预处理：深度清理可能存在的转义换行符残留
    const cleanMd = md.replace(/\\n/g, '\n');
    
    return cleanMd.split('\n').map((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return '<div style="height: 24px;"></div>';

      // 标题
      if (trimmedLine.startsWith('# ')) {
        return `<h1 style="font-size: ${baseSize * 1.4}px; color: #FF9500; font-weight: 800; margin-bottom: 32px; text-align: center; letter-spacing: -0.01em;">${trimmedLine.slice(2)}</h1>`;
      }

      // 引用块 (Blockquote)
      if (trimmedLine.startsWith('> ')) {
        const quoteContent = trimmedLine.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong style="color: #FF9500;">$1</strong>');
        return `<div style="padding-left: 28px; border-left: 5px solid rgba(255,255,255,0.2); margin-bottom: 24px; font-style: italic;">
                  <p style="font-size: ${baseSize * 0.95}px; line-height: 1.7; color: #aaaaaa; text-align: justify; text-justify: inter-character; margin: 0;">${quoteContent}</p>
                </div>`;
      }

      // 列表
      if (trimmedLine.startsWith('- ')) {
        return `<p style="font-size: ${baseSize}px; color: #ffffff; margin-bottom: 16px; text-align: left; padding-left: 20px;">• ${trimmedLine.slice(2)}</p>`;
      }

      // 正文实现严格的两端对齐
      let processed = trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #FF9500; font-weight: 700;">$1</strong>');
      return `<p style="font-size: ${baseSize}px; line-height: 1.8; color: #e5e5e5; margin-bottom: 24px; text-align: justify; text-justify: inter-character; word-break: break-all;">${processed}</p>`;
    }).join('');
  };

  useImperativeHandle(ref, () => ({
    download: async (fileName: string) => {
      const container = document.createElement('div');
      container.style.cssText = `position: fixed; left: -9999px; width: 1080px; height: 1920px; background: black; font-family: sans-serif;`;
      
      container.innerHTML = `
        <div style="position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; background: radial-gradient(circle at center, #222222 0%, #000000 100%);">
          <div style="width: 900px; margin-top: 180px; flex: 1; display: flex; flex-direction: column; justify-content: flex-start; padding-top: 20px;">
            ${parseMarkdown(text, fontSize)}
          </div>
          <div style="position: absolute; bottom: 120px; display: flex; flex-direction: column; align-items: center; gap: 20px;">
            <div style="width: 140px; height: 1px; background: rgba(255,255,255,0.15);"></div>
            <span style="color: #07c160; font-size: 34px; font-weight: 900; letter-spacing: 0.3em;">© ${author || "万能的孙同学"}</span>
          </div>
        </div>
      `;

      document.body.appendChild(container);
      const canvas = await html2canvas(container, { width: 1080, height: 1920, scale: 2, useCORS: true, backgroundColor: '#000000' });
      document.body.removeChild(container);

      const link = document.createElement('a');
      link.download = fileName;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    }
  }));

  return (
    <div className="flex justify-center p-4">
      <div 
        ref={canvasRef}
        className="relative bg-black overflow-hidden rounded-[64px] border-[14px] border-[#1f1f1f] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)]"
        style={{ width: '1080px', height: '1920px', transform: 'scale(0.42)', transformOrigin: 'top center', marginBottom: '-1110px' }}
      >
        {/* 顶部灵动岛装饰 */}
        <div className="absolute top-[40px] left-1/2 -translate-x-1/2 w-[280px] h-[60px] bg-[#1a1a1a] rounded-full z-[60] flex items-center justify-end px-8">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500/10 blur-[3px]" />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#222222_0%,_#000000_100%)]" />
        
        <div className="absolute inset-0 flex flex-col items-center px-[90px] pt-[180px]">
          <div className="w-full flex-1 flex flex-col justify-start pt-[20px]" 
               dangerouslySetInnerHTML={{ __html: parseMarkdown(text, fontSize) }} />
          
          <div className="absolute bottom-[120px] flex flex-col items-center gap-6">
            <div className="w-32 h-[1px] bg-white/10" />
            <span className="text-[#07c160] font-bold tracking-[0.2em] text-[34px]">© {author || "万能的孙同学"}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

TextCanvas.displayName = "TextCanvas";
export default TextCanvas;