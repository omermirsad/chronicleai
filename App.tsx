
import React, { useState } from 'react';
import Header from './components/Header';
import JournalEditor from './components/JournalEditor';
import JournalFeed from './components/JournalFeed';
import InsightsView from './components/InsightsView';
import { useJournal } from './hooks/useJournal';
import { JournalEntry, View } from './types';
import PerspectiveLensModal from './components/PerspectiveLensModal';

const App: React.FC = () => {
  const { entries, addEntry, updateEntry } = useJournal();
  const [currentView, setCurrentView] = useState<View>('feed');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenPerspectiveLens = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const renderView = () => {
    switch (currentView) {
      case 'editor':
        return <JournalEditor addEntry={addEntry} updateEntry={updateEntry} setCurrentView={setCurrentView} />;
      case 'insights':
        return <InsightsView entries={entries} />;
      case 'feed':
      default:
        return <JournalFeed entries={entries} onOpenPerspectiveLens={handleOpenPerspectiveLens} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="max-w-3xl mx-auto p-4 sm:p-6">
        {renderView()}
      </main>
      {selectedEntry && (
        <PerspectiveLensModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          entry={selectedEntry}
        />
      )}
    </div>
  );
};

export default App;
