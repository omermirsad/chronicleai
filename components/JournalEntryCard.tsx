
import React from 'react';
import { JournalEntry } from '../types';
import { SparklesIcon, TagIcon, ChatBubbleLeftRightIcon, LightBulbIcon } from './Icons';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onOpenPerspectiveLens: (entry: JournalEntry) => void;
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({ entry, onOpenPerspectiveLens }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <article className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 transition-shadow hover:shadow-md">
      <header className="mb-4 pb-2 border-b border-stone-200">
        <time className="text-sm text-stone-500">{formatDate(entry.date)}</time>
      </header>
      
      {entry.photo && (
        <div className="mb-4">
          <img 
            src={`data:${entry.photo.mimeType};base64,${entry.photo.base64}`} 
            alt="Journal entry" 
            className="max-h-64 w-auto rounded-md mx-auto"
          />
        </div>
      )}
      
      {entry.text && (
        <p className="font-serif text-stone-700 whitespace-pre-wrap leading-relaxed">{entry.text}</p>
      )}

      {entry.aiAnalysis ? (
        <footer className="mt-6 pt-4 border-t border-stone-200 space-y-4">
          {entry.aiAnalysis.acknowledgement && (
            <div className="bg-teal-50 text-teal-800 p-3 rounded-md flex items-start gap-3">
              <ChatBubbleLeftRightIcon className="w-5 h-5 mt-1 flex-shrink-0" />
              <p className="text-sm italic">{entry.aiAnalysis.acknowledgement}</p>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-sm text-stone-600 mb-2 flex items-center gap-2"><SparklesIcon className="w-4 h-4" />Summary</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-stone-600">
              {entry.aiAnalysis.summary.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-stone-600 mb-2 flex items-center gap-2"><TagIcon className="w-4 h-4" />Tags</h4>
            <div className="flex flex-wrap gap-2">
              {entry.aiAnalysis.tags.map(tag => (
                <span key={tag} className="bg-stone-200 text-stone-700 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
          
          {entry.aiAnalysis.socraticQuestion && (
            <div className="bg-amber-50 text-amber-900 p-4 rounded-md">
              <h4 className="font-semibold text-sm mb-1 flex items-center gap-2"><LightBulbIcon className="w-5 h-5" />A Question for Reflection</h4>
              <p className="text-sm italic">"{entry.aiAnalysis.socraticQuestion}"</p>
            </div>
          )}
          
          <div className="text-right pt-2">
            <button onClick={() => onOpenPerspectiveLens(entry)} className="text-sm font-medium text-teal-600 hover:text-teal-800 transition">
              View with Perspective Lens →
            </button>
          </div>

        </footer>
      ) : (
         <div className="mt-6 pt-4 border-t border-stone-200 text-center text-sm text-stone-500 animate-pulse">
            AI is reflecting on your entry...
        </div>
      )}
    </article>
  );
};

export default JournalEntryCard;
