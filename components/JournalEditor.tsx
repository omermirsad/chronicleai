
import React, { useState, useCallback } from 'react';
import { JournalEntry, View } from '../types';
import { analyzeEntry } from '../services/geminiService';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { MicrophoneIcon, StopCircleIcon, PhotoIcon, PaperAirplaneIcon } from './Icons';

interface JournalEditorProps {
  addEntry: (entry: JournalEntry) => void;
  updateEntry: (id: string, updatedData: Partial<JournalEntry>) => void;
  setCurrentView: (view: View) => void;
}

const JournalEditor: React.FC<JournalEditorProps> = ({ addEntry, updateEntry, setCurrentView }) => {
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState<{ base64: string; mimeType: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTranscriptChange = useCallback((transcript: string) => {
    setText(transcript);
  }, []);

  const { isListening, startListening, stopListening, hasSupport } = useSpeechRecognition(handleTranscriptChange);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        setPhoto({ base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !photo) {
      alert("Please write something or upload a photo.");
      return;
    }
    setIsProcessing(true);
    if (isListening) stopListening();

    const newEntry: JournalEntry = {
      id: new Date().toISOString(),
      date: new Date().toISOString(),
      text,
      photo: photo || undefined,
    };
    
    addEntry(newEntry);
    setCurrentView('feed');

    try {
      const analysis = await analyzeEntry(text, photo || undefined);
      updateEntry(newEntry.id, { aiAnalysis: analysis });
    } catch (error) {
      console.error("Failed to get AI analysis:", error);
      // Optionally update the entry with an error message
    } finally {
      setIsProcessing(false);
      // Resetting form is handled by redirecting to feed
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">New Entry</h2>
        <textarea
          className="w-full h-48 p-3 font-serif text-stone-700 bg-stone-50 border border-stone-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isProcessing}
        />
        {photo && (
          <div className="my-4">
            <img src={`data:${photo.mimeType};base64,${photo.base64}`} alt="Journal entry" className="max-h-48 rounded-md" />
            <button type="button" onClick={() => setPhoto(null)} className="text-sm text-red-600 mt-1">Remove Photo</button>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {hasSupport && (
                isListening ? (
                    <button type="button" onClick={stopListening} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition">
                        <StopCircleIcon /> Stop
                    </button>
                ) : (
                    <button type="button" onClick={startListening} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-700 bg-stone-200 rounded-md hover:bg-stone-300 transition">
                        <MicrophoneIcon /> Record
                    </button>
                )
            )}
            <label className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-700 bg-stone-200 rounded-md hover:bg-stone-300 transition cursor-pointer">
              <PhotoIcon /> Upload
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>
          
          <button
            type="submit"
            disabled={isProcessing || (!text.trim() && !photo)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition"
          >
            {isProcessing ? 'Processing...' : 'Save Entry'}
            {!isProcessing && <PaperAirplaneIcon />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JournalEditor;
