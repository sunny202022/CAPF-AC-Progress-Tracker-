
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

export interface PreviousPaper {
  year: number;
  paper1Url: string; // Path to local PDF in public folder
  paper2Url: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-3)
  explanation?: string;
}

export interface TestPaper {
  id: string;
  title: string;
  subjectId: string; // 'all' for full mocks, or specific subject id like 'polity'
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number; // in minutes
  questions: Question[];
}

// --- NEW TYPES FOR CODING ARENA ---

export interface TestCase {
  input: any[];
  expected: any;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  starterCode: string;
  testCases: TestCase[];
}
