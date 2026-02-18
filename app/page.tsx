"use client";

import React, { useState, useRef } from 'react';
import { Sparkles, Download, Loader2, Palette } from 'lucide-react';
import TextCanvas from '@/components/TextCanvas';
import { useAutoPaging } from '@/hooks/useAutoPaging';

export default function Page() {
  const [text, setText] = useState("# 宇宙的终极思考\n> 如果一件事在逻辑上是可能的，那么在无限的宇宙中，它就必然会发生。\n\n物理学家 **爱因斯坦** 曾对因果律有过深刻的怀疑。正如他在信中写道：“上帝不掷骰子”。这意味着万物皆有其因，每一刻的 **现在** 都是过去所有力量博弈的终点。");
  const [author, setAuthor] = useState("万能的孙同学");
  const [fontSize, setFontSize] = useState(52);
  const [bgColor, setBgColor] = useState("#000000"); // 新增：背景颜色状态
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // 推荐色值
  const presetColors = [
    { name: '经典黑', value: '#000000' },
    { name: '深海蓝', value: '#0a192f' },
    { name: '森林绿', value: '#0b1a10' },
    { name: '暗酒红', value: '#1a0b0b' },
    { name: '高级灰', value: '#1a1a1a' },
  ];

  const canvasRefs = useRef<any[]>([]);
  const pages = useAutoPaging(text, fontSize);

  const handleOptimize = async () => {
    if (!text.trim() || isOptimizing) return;
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/optimize', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }) 
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "优化失败");
      if (data.optimizedText) setText(data.optimizedText);
    } catch (e: any) { 
      alert(e.message || "网络请求失败"); 
    } finally { 
      setIsOptimizing(false); 
    }
  };

  const handleBatchExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      for (let i = 0; i < pages.length; i++) {
        await canvasRefs.current[i]?.download(`金句图_${author}_${i + 1}.png`);
        await new Promise(r => setTimeout(r, 600));
      }
    } finally { setIsExporting(false); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans selection:bg-[#07c160]/30">
      <header className="max-w-[1700px] mx-auto mb-8 md:mb-16 text-center">
        <h1 className="text-2xl md:text-4xl font-black text-[#07c160] tracking-tighter uppercase leading-tight">
          视频号金句图<br className="md:hidden" />AI生成器
        </h1>
        <p className="text-[9px] md:text-[10px] text-gray-600 font-bold tracking-[0.4em] mt-3 uppercase opacity-50">High-End Quote Generator for WeChat</p>
      </header>

      <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
        
        {/* 左侧：编辑器 */}
        <div className="lg:col-span-3 order-1 space-y-6 bg-[#0d0d0d] p-6 md:p-7 rounded-[32px] md:rounded-[40px] border border-white/5 h-fit lg:sticky lg:top-8 shadow-2xl">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">内容编辑器</label>
            <textarea 
              className="w-full h-[250px] md:h-[400px] bg-black border border-white/10 rounded-2xl p-5 text-sm outline-none focus:border-[#07c160] transition-all scrollbar-hide whitespace-pre-wrap" 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
            />
            <button onClick={handleOptimize} disabled={isOptimizing} className="w-full py-4 rounded-xl bg-[#07c160]/10 border border-[#07c160]/20 text-[#07c160] text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95">
              {isOptimizing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} AI 智能排版优化
            </button>
          </div>

          {/* 新增：颜色选择模块 */}
          <div className="pt-6 border-t border-white/5 space-y-4">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
              <Palette size={12} /> 背景色彩自定义
            </label>
            <div className="flex flex-wrap gap-3">
              {presetColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setBgColor(color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${bgColor === color.value ? 'border-[#07c160] scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
              {/* 自主勾选色盘 */}
              <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/10 hover:border-white/30 transition-all">
                <input 
                  type="color" 
                  value={bgColor} 
                  onChange={(e) => setBgColor(e.target.value)}
                  className="absolute -inset-2 w-12 h-12 cursor-pointer bg-transparent"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 space-y-6">
            <input className="w-full bg-black border border-white/10 rounded-xl px-5 py-3 text-sm focus:border-[#07c160] outline-none transition-all" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="品牌署名" />
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] text-gray-500 font-black uppercase"><span>字号大小</span><span>{fontSize}px</span></div>
              <input type="range" min="40" max="72" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full h-1 bg-white/10 rounded-lg accent-[#07c160] appearance-none cursor-pointer" />
            </div>
          </div>
        </div>

        {/* 中间：预览区 */}
        <div className="lg:col-span-6 order-2 flex flex-col items-center min-w-0">
          <div className="mb-6 py-2 px-6 rounded-full bg-white/5 border border-white/10">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">实时预览模式</span>
          </div>
          <div className="w-full space-y-16 md:space-y-20 pb-20 md:pb-40 overflow-x-auto scrollbar-hide flex flex-col items-center">
            {pages.map((p, i) => (
              <div key={i} className="flex flex-col items-center gap-4 flex-shrink-0">
                <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest">第 {(i + 1).toString().padStart(2, '0')} 页</div>
                <TextCanvas 
                  ref={(el) => { canvasRefs.current[i] = el; }} 
                  text={p} 
                  author={author} 
                  fontSize={fontSize}
                  bgColor={bgColor} // 传递背景颜色
                  isCenterPage={i === 0 || i === pages.length - 1} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：导出中心 */}
        <div className="lg:col-span-3 order-3">
          <div className="bg-[#0d0d0d] p-6 md:p-8 rounded-[32px] md:rounded-[48px] border border-white/5 lg:sticky lg:top-8 shadow-2xl space-y-8 text-center">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                <div className="text-[9px] text-gray-600 font-bold mb-1 uppercase">总页数</div>
                <div className="text-xl md:text-2xl font-black">{pages.length}</div>
              </div>
              <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                <div className="text-[9px] text-gray-600 font-bold mb-1 uppercase text-xs">格式</div>
                <div className="text-xl md:text-2xl font-black uppercase mt-1">PNG</div>
              </div>
            </div>
            <button onClick={handleBatchExport} disabled={isExporting} className="w-full py-5 md:py-6 rounded-[24px] md:rounded-[28px] bg-[#07c160] hover:bg-[#06ad56] text-black font-black text-base md:text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg disabled:opacity-50">
              {isExporting ? <Loader2 size={24} className="animate-spin" /> : <Download size={24} />} 批量导出金句图
            </button>
            <div className="text-[8px] md:text-[9px] text-gray-700 font-medium leading-relaxed">
              * 分辨率已锁定 1080x1920 标准物理像素<br/>背景色将同步应用于导出图片
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}