'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Menu, Heart, MessageSquare, Share2, Play, Pause } from 'lucide-react';
import TextCanvas from './TextCanvas';

interface PreviewContainerProps {
  showOverlays: boolean;
  showQRCode: boolean;
  children: React.ReactNode;
}

const PreviewContainer: React.FC<PreviewContainerProps> = ({
  showOverlays,
  showQRCode,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // 自动调整缩放比例
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const maxHeight = window.innerHeight * 0.7;
        const newScale = Math.min(1, maxHeight / containerHeight);
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {/* 手机容器模型 */}
      <div
        ref={containerRef}
        className="relative aspect-[9/16] max-w-sm w-full bg-gradient-to-b from-black to-[#1a1a1a] rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-900"
      >
        {/* 顶部状态栏 */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-black flex items-center justify-between px-4 z-10">
          <div className="text-white text-xs">9:41</div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>

        {/* 预览内容 */}
        <div
          className="w-full h-full flex items-center justify-center p-4"
          style={{ transform: `scale(${scale})` }}
        >
          <div className="canvas-container w-full h-full relative">
            {children}

            {/* 视频号交互 UI Overlay */}
            {showOverlays && (
              <div className="absolute inset-0 pointer-events-none opacity-30">
                {/* 右上角三点菜单 */}
                <div className="absolute top-4 right-4">
                  <Menu className="text-white" size={20} />
                </div>

                {/* 右侧点赞/评论/分享图标 */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-6">
                  <Heart className="text-white" size={24} />
                  <MessageSquare className="text-white" size={24} />
                  <Share2 className="text-white" size={24} />
                </div>

                {/* 底部标题和进度条区域 */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent flex flex-col justify-end pb-4 px-4">
                  <div className="w-full h-1 bg-white/30 rounded-full mb-2">
                    <div className="w-1/3 h-full bg-white rounded-full"></div>
                  </div>
                  <div className="text-white text-sm">视频标题 - 视频号</div>
                </div>

                {/* 中央播放按钮 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                    <Play className="text-white" size={24} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewContainer;