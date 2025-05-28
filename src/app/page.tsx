'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [originalText, setOriginalText] = useState('');
  const [recipient, setRecipient] = useState('上司');
  const [context, setContext] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const recipients = [
    '上司',
    '先輩', 
    '後輩',
    '親',
    '弟',
    '初対面',
    '2回目（絶妙な距離感）'
  ];

  const handleRephrase = async () => {
    if (!originalText.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/rephrase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalText,
          recipient,
          context,
        }),
      });

      const data = await response.json();
      setResult(data.rephrased || 'エラーが発生しました');
    } catch (error) {
      console.error('Rephrase error:', error);
      setResult('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-blue-400">Rephrase</span>
            <span className="text-purple-400">Mate</span>
          </h1>
          <p className="text-gray-300 text-lg">コンテキスト対応メールリライトアプリ</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Original Text Input */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              原文を入力
            </label>
            <textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="では、15時からミーティングよろしくお願いします。"
              className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Recipient and Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                送信相手
              </label>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {recipients.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                文脈（任意）
              </label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="相手が以前提案を却下してきたため、より"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Rephrase Button */}
          <button
            onClick={handleRephrase}
            disabled={isLoading || !originalText.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {isLoading ? 'リライト中...' : 'Rephrase'}
            <Sparkles className="w-5 h-5" />
          </button>

          {/* Result */}
          {result && (
            <div className="mt-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                出力結果:
              </label>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-gray-800 leading-relaxed">{result}</p>
              </div>
              <button
                onClick={handleCopy}
                className="mt-3 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
              >
                コピーする
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
