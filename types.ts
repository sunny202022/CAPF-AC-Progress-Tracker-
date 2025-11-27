export interface Subtopic {
  id: string;
  title: string;
}

export interface DayTopic {
  id: string;
  title: string; // e.g., "Day 1: Schedules"
  subtopics: string[]; // Keeping simple string array as per original python, but we will wrap in objects for React keys
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  topics: DayTopic[];
}

export interface ProgressState {
  [key: string]: boolean; // key format: "subjectId-dayId-subtopicIndex" -> true/false
}

export interface ActivityLog {
  date: string; // ISO string YYYY-MM-DD
  count: number;
}