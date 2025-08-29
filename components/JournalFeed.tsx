
import React from 'react';
import { JournalEntry } from '../types';
import JournalEntryCard from './JournalEntryCard';

interface JournalFeedProps {
  entries: JournalEntry[];
  onOpenPerspectiveLens: (entry: JournalEntry) => void;
}

const JournalFeed: React.FC<JournalFeedProps> = ({ entries, onOpenPerspectiveLens }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm border border-stone-200">
        <h2 className="text-2xl font-bold text-stone-800">Your journal is empty.</h2>
        <p className="mt-2 text-stone-600">Click on "New Entry" to begin your journey of reflection.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {entries.map((entry) => (
        <JournalEntryCard key={entry.id} entry={entry} onOpenPerspectiveLens={onOpenPerspectiveLens}/>
      ))}
    </div>
  );
};

export default JournalFeed;
