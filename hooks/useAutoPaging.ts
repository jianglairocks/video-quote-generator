"use client";

import { useState, useEffect } from 'react';

export const useAutoPaging = (text: string, fontSize: number) => {
  const [pages, setPages] = useState<string[]>([]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 深度清理 AI 可能返回的转义换行符
    const cleanText = text.replace(/\\n/g, '\n')
                          .replace(/[\u200B-\u200D\uFEFF]/g, '')
                          .trim();
    
    // 维持 900px 宽度布局
    const MAX_CONTENT_HEIGHT = 1100; 
    const CANVAS_WIDTH = 900; 

    const measureHeight = (content: string) => {
      const div = document.createElement('div');
      div.style.width = `${CANVAS_WIDTH}px`;
      div.style.fontSize = `${fontSize}px`;
      div.style.lineHeight = '1.8';
      div.style.whiteSpace = 'pre-wrap';
      div.style.wordBreak = 'break-word';
      div.style.position = 'absolute';
      div.style.visibility = 'hidden';
      div.style.textAlign = 'justify';
      div.style.textJustify = 'inter-character';
      
      // 增加对引用格式的高度模拟
      div.innerHTML = content.replace(/^# (.*$)/gm, '<h1 style="font-size:1.4em">$1</h1>')
                             .replace(/^> (.*$)/gm, '<blockquote style="padding-left:30px; border-left:4px solid gray">$1</blockquote>')
                             .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                             
      document.body.appendChild(div);
      const height = div.offsetHeight;
      document.body.removeChild(div);
      return height;
    };

    const paragraphs = cleanText.split(/\n\n+/);
    let currentPages: string[] = [];
    let currentPageContent = "";

    paragraphs.forEach((para) => {
      const testContent = currentPageContent ? currentPageContent + "\n\n" + para : para;
      if (measureHeight(testContent) <= MAX_CONTENT_HEIGHT) {
        currentPageContent = testContent;
      } else {
        if (currentPageContent) currentPages.push(currentPageContent);
        currentPageContent = para;
      }
    });

    if (currentPageContent) currentPages.push(currentPageContent);
    setPages(currentPages.length > 0 ? currentPages : [cleanText]);
  }, [text, fontSize]);

  return pages;
};