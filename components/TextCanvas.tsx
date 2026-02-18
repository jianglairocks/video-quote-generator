"use client";

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import html2canvas from 'html2canvas';

interface TextCanvasProps {
  text: string;
  author: string;
  fontSize: number;
  bgColor: string;
  isCenterPage?: boolean; 
}

const TextCanvas = forwardRef(({ text, author, fontSize, bgColor, isCenterPage }: TextCanvasProps, ref) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const parseMarkdown = (md: string, baseSize: number) => {
    const cleanMd = md.replace(/\\n/g, '\n');
    return cleanMd.split('\n').map((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return '<div style="height: 24px;"></div>';
      if (trimmedLine.startsWith('# ')) {
        return `<h1 style="font-size: ${baseSize * 1.4}px; color: #FF9500; font-weight: 800; margin-bottom: 32px; text-align: center; letter-spacing: -0.01em;">${trimmedLine.slice(2)}</h1>`;
      }
      if (trimmedLine.startsWith('> ')) {
        const quoteContent = trimmedLine.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong style="color: #FF9500;">$1</strong>');
        return `<div style="padding-left: 28px; border-left: 5px solid rgba(255,255,255,0.2); margin-bottom: 24px; font-style: italic;">
                  <p style="font-size: ${baseSize * 0.95}px; line-height: 1.7; color: #aaaaaa; text-align: justify; text-justify: inter-character; margin: 0;">${quoteContent}</p>
                </div>`;
      }
      if (trimmedLine.startsWith('- ')) {
        return `<p style="font-size: ${baseSize}px; color: #ffffff; margin-bottom: 16px; text-align: left; padding-left: 20px;">• ${trimmedLine.slice(2)}</p>`;
      }
      let processed = trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #FF9500; font-weight: 700;">$1</strong>');
      return `<p style="font-size: ${baseSize}px; line-height: 1.8; color: #e5e5e5; margin-bottom: 24px; text-align: justify; text-justify: inter-character; word-break: break-all;">${processed}</p>`;
    }).join('');
  };

  useImperativeHandle(ref, () => ({
    download: async (fileName: string) => {
      const container = document.createElement('div');
      container.style.cssText = `
        position: fixed; 
        left: -9999px; 
        width: 1080px; 
        height: 1920px; 
        background-color: ${bgColor};
        background-image: 
          radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 80%),
          radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%);
        font-family: sans-serif;
      `;
      
      const justifyContent = isCenterPage ? 'center' : 'flex-start';
      const marginTop = isCenterPage ? '0px' : '180px';
      const paddingBottom = isCenterPage ? '200px' : '0px';

      container.innerHTML = `
        <div style="position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center;">
          <div style="width: 900px; flex: 1; display: flex; flex-direction: column; justify-content: ${justifyContent}; margin-top: ${marginTop}; padding-bottom: ${paddingBottom};">
            ${parseMarkdown(text, fontSize)}
          </div>
          <div style="position: absolute; bottom: 120px; display: flex; flex-direction: column; align-items: center; gap: 20px;">
            <div style="width: 140px; height: 1px; background: rgba(255,255,255,0.2);"></div>
            <span style="color: #e5e5e5; font-size: 34px; font-weight: 900; letter-spacing: 0.3em;">© ${author || "万能的孙同学"}</span>
          </div>
        </div>
      `;

      document.body.appendChild(container);
      const canvas = await html2canvas(container, { width: 1080, height: 1920, scale: 2, useCORS: true });
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
        className="relative overflow-hidden rounded-[64px] border-[14px] border-[#1f1f1f] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)]"
        style={{ 
          width: '1080px', 
          height: '1920px', 
          transform: 'scale(0.42)', 
          transformOrigin: 'top center', 
          marginBottom: '-1110px',
          backgroundColor: bgColor,
          backgroundImage: `
            radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 80%),
            radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)
          `
        }}
      >
        <div className="absolute top-[40px] left-1/2 -translate-x-1/2 w-[280px] h-[60px] bg-black/30 backdrop-blur-xl rounded-full z-[60]" />
        
        <div className={`absolute inset-0 flex flex-col items-center px-[90px] ${isCenterPage ? 'pt-0' : 'pt-[180px]'}`}>
          <div 
            className={`w-full flex-1 flex flex-col ${isCenterPage ? 'justify-center pb-[200px]' : 'justify-start pt-[20px]'}`} 
            dangerouslySetInnerHTML={{ __html: parseMarkdown(text, fontSize) }} 
          />
          
          <div className="absolute bottom-[120px] flex flex-col items-center gap-6">
            {/* 预览区装饰线：半透明白色 */}
            <div className="w-32 h-[1px] bg-white/20" />
            {/* 预览区文字：改为淡灰色 */}
            <span className="text-[#e5e5e5] font-bold tracking-[0.2em] text-[34px]">© {author || "万能的孙同学"}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

TextCanvas.displayName = "TextCanvas";
export default TextCanvas;