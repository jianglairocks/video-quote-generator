import { NextResponse } from 'next/server';

// 内存中存储频率限制数据 (Map: IP -> { count, startTime })
const rateLimitMap = new Map<string, { count: number, startTime: number }>();

export async function POST(req: Request) {
  try {
    // 1. 获取用户 IP 地址 (用于识别用户)
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000; // 1小时的毫秒数
    const MAX_REQUESTS = 50; // 每小时限制次数

    // 2. 频率限制检查逻辑
    const userLimit = rateLimitMap.get(ip);

    if (!userLimit) {
      // 第一次请求，初始化记录
      rateLimitMap.set(ip, { count: 1, startTime: now });
    } else {
      // 检查是否已经超过1小时
      if (now - userLimit.startTime > ONE_HOUR) {
        // 超过1小时，重置计数器
        rateLimitMap.set(ip, { count: 1, startTime: now });
      } else {
        // 在1小时内，检查次数
        if (userLimit.count >= MAX_REQUESTS) {
          return NextResponse.json(
            { error: '请求过于频繁，每小时限 50 次，请稍后再试' }, 
            { status: 429 }
          );
        }
        // 次数未超，累加计数
        userLimit.count += 1;
      }
    }

    // 3. 原有的业务逻辑：获取文本并调用 DeepSeek
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: '请提供文本内容' }, { status: 400 });

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'API Key 未配置' }, { status: 500 });

    const systemPrompt = `你是一个顶尖的短视频文案专家和视觉排版设计师。你的任务是将原始素材重构为极具视觉冲击力且符合 Markdown 格式的视频号金句文案。
    
    1. 智能主题识别：提炼灵魂标题，以 "# 标题内容" 置于首行。
    2. 内容层次：核心金句或名言使用 "> 引用内容" 格式。
    3. 视觉权重：关键点使用 "**关键词**" 加粗。
    4. 段落架构：使用双换行 "\\n\\n" 分隔逻辑段落，严禁碎句。
    5. 直接返回文案，严禁废话。`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
        temperature: 0.6,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'AI 服务调用失败' }, { status: response.status });
    }

    const data = await response.json();
    const optimizedText = data.choices[0]?.message?.content || text;
    
    return NextResponse.json({ optimizedText });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: '内部服务器错误' }, { status: 500 });
  }
}