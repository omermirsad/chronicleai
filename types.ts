
export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  photo?: {
    base64: string;
    mimeType: string;
  };
  aiAnalysis?: AIAnalysis;
}

export interface AIAnalysis {
  summary: string[];
  tags: string[];
  sentiment: string;
  acknowledgement?: string;
  socraticQuestion?: string;
}

export interface Perspective {
  title: string;
  content: string;
}

export type View = 'feed' | 'editor' | 'insights';
