import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css' // 确保这里的路径指向上一级的 styles 文件夹

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '视频号金句图 AI 生成器',
  description: '快速生成高质量的视频号金句排版图',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}