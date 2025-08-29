
import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { generateInsights } from '../services/geminiService';
import { SparklesIcon } from './Icons';

interface InsightsViewProps {
  entries: JournalEntry[];
}

const InsightsView: React.FC<InsightsViewProps> = ({ entries }) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setError(null);
    setInsights(null);
    try {
      const result = await generateInsights(entries);
      setInsights(result);
    } catch (err) {
      setError('Sorry, there was an error generating insights. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
      <div className="text-center">
        <SparklesIcon className="w-12 h-12 mx-auto text-teal-500" />
        <h2 className="mt-2 text-2xl font-bold text-stone-800">Self-Awareness Engine</h2>
        <p className="mt-2 text-stone-600">Discover long-term patterns and connections in your thoughts and feelings.</p>
        <button
          onClick={handleGenerateInsights}
          disabled={isLoading || entries.length < 3}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition"
        >
          {isLoading ? 'Analyzing...' : 'Generate Insights'}
        </button>
        {entries.length < 3 && <p className="text-xs text-stone-500 mt-2">You need at least 3 journal entries to generate insights.</p>}
      </div>

      {isLoading && (
        <div className="mt-8 text-center text-stone-600">
          <p>The AI is carefully reviewing your journal to find meaningful patterns. This may take a moment...</p>
        </div>
      )}

      {error && <p className="mt-8 text-center text-red-600">{error}</p>}
      
      {insights && (
        <div className="mt-8 pt-6 border-t border-stone-200">
          <h3 className="text-xl font-semibold mb-4 text-stone-700">Your Insights</h3>
          <div className="prose prose-stone max-w-none whitespace-pre-wrap">
            {insights}
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsView;
