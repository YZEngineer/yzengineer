
export interface ListeningEntry {
  title: string;
  summary: string;
  aiFeedback?: string;
  timestamp: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  surname: string;
  entries: Record<string, ListeningEntry>; // Key: "YYYY-MM-DD"
}

export interface AppState {
  students: StudentProfile[];
}
