import { NextRequest, NextResponse } from 'next/server';

const DEEPSEEK_API_KEY = 'sk-35475d2156164abc8a69aff4233b52ea';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const { originalText, recipient, context } = await request.json();

    if (!originalText) {
      return NextResponse.json(
        { error: '原文が入力されていません' },
        { status: 400 }
      );
    }

    // プロンプトの構築
    const systemPrompt = `あなたは日本語のメールリライト専門家です。送信相手との関係性と背景情報を考慮して、適切なトーンと表現でメール文を書き換えてください。

以下のガイドラインに従ってください：
- 相手との関係性に応じて敬語レベルを調整
- 自然で読みやすい文章にする
- 元の意図を保ちながら、より適切な表現に変更
- 日本のビジネスマナーに適した表現を使用`;

    const userPrompt = `
原文: ${originalText}
送信相手: ${recipient}
${context ? `背景情報: ${context}` : ''}

上記の情報を考慮して、この文章を適切にリライトしてください。リライト結果のみを返してください。`;

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const rephrased = data.choices?.[0]?.message?.content?.trim();

    if (!rephrased) {
      throw new Error('リライト結果が取得できませんでした');
    }

    return NextResponse.json({ rephrased });
  } catch (error) {
    console.error('Rephrase error:', error);
    return NextResponse.json(
      { error: 'リライト処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 