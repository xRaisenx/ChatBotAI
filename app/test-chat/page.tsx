// app/test-chat/page.tsx
'use client';
import { useState } from 'react';
import { ThemeProvider } from '../../providers/ThemeProvider';

export default function TestChat() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: query }] }),
      });
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      let result = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += new TextDecoder().decode(value);
      }

      setResponse(result);
    } catch (err) {
      setError('Failed to fetch response');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <main className="min-h-screen bg-white dark:bg-gray-900 p-4">
        <h1 className="text-2xl font-bold mb-4">Test Chat API</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Enter your query...'
            className="p-2 border rounded-lg w-full max-w-md text-black dark:text-white dark:bg-gray-700"
          />
          <button
            type="submit"
            className="mt-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Send'}
          </button>
        </form>
        {error && <p className="text-red-500">{error}</p>}
        {response && (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h2 className="font-semibold">Response:</h2>
            <p>{response}</p>
          </div>
        )}
      </main>
    </ThemeProvider>
  );
}
