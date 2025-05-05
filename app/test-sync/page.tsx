// app/test-sync/page.tsx
'use client';
import { useState } from 'react';
import { ThemeProvider } from '../../providers/ThemeProvider';

export default function TestSync() {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(`/api/sync-products?secret=${process.env.CRON_SECRET}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');
      setResponse(data.message);
    } catch (err) {
      setError('Failed to trigger sync');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <main className="min-h-screen bg-white dark:bg-gray-900 p-4">
        <h1 className="text-2xl font-bold mb-4">Test Product Sync</h1>
        <button
          onClick={handleSync}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
          disabled={loading}
        >
          {loading ? 'Syncing...' : 'Trigger Sync'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {response && (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mt-4">
            <h2 className="font-semibold">Sync Result:</h2>
            <p>{response}</p>
          </div>
        )}
      </main>
    </ThemeProvider>
  );
}
