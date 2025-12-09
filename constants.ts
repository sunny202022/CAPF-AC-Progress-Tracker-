
import { Subject, PreviousPaper, TestPaper, CodingProblem } from './types';

export const SYLLABUS_DATA: Subject[] = [
  // --- EXISTING SUBJECTS ---
  {
    id: 'paper2',
    name: 'Paper 2 (Essay & Comp)',
    icon: 'PenTool',
    topics: [
      {
        id: 'p2_day1',
        title: 'Day 1: Essay Fundamentals',
        subtopics: ['Structure of an Essay', 'Brainstorming Techniques', 'Introduction & Conclusion Strategies', 'Connecting Paragraphs'],
      },
      {
        id: 'p2_day2',
        title: 'Day 2: Arguments & Reports',
        subtopics: ['Argument Writing Format (For/Against)', 'Report Writing Format & Tone', 'Analyzing Previous Topics'],
      },
    ],
  },
  {
    id: 'polity',
    name: 'Polity',
    icon: 'Scale',
    topics: [
      {
        id: 'p_day1',
        title: 'Day 1: Schedules & Preamble',
        subtopics: ['Schedules of Indian Constitution', 'Preamble Objectives', 'Keywords (Sovereign, Socialist, etc.)', 'Amendability of Preamble'],
      },
    ],
  },
  {
    id: 'history',
    name: 'History',
    icon: 'Scroll',
    topics: [
      {
        id: 'h_day1',
        title: 'Day 1: Ancient India',
        subtopics: ['Indus Valley Civilization', 'Vedic Age (Early & Later)', 'Buddhism & Jainism', 'Mauryan Empire', 'Gupta Period'],
      },
    ],
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: 'Globe',
    topics: [
      {
        id: 'g_day1',
        title: 'Day 1: Physical Geography',
        subtopics: ['Interior of Earth', 'Plate Tectonics', 'Earthquakes & Volcanoes', 'Rock System', 'Landforms'],
      },
    ],
  },
  {
    id: 'science',
    name: 'Science',
    icon: 'Atom',
    topics: [
      {
        id: 's_day1',
        title: 'Day 1: Physics I',
        subtopics: ['Units & Measurements', 'Motion & Laws of Motion', 'Work, Energy, Power', 'Gravitation'],
      },
    ],
  },
  {
    id: 'economy',
    name: 'Economy',
    icon: 'TrendingUp',
    topics: [
      {
        id: 'e_day1',
        title: 'Day 1: Macro Economics',
        subtopics: ['National Income (GDP, GNP)', 'Inflation (Types, Causes)', 'Monetary Policy (RBI)', 'Fiscal Policy (Budget)'],
      },
    ],
  },
  {
    id: 'environment',
    name: 'Environment',
    icon: 'Leaf',
    topics: [
      {
        id: 'env_day1',
        title: 'Day 1: Ecology',
        subtopics: ['Ecosystem Structure', 'Food Chain & Food Web', 'Ecological Pyramids', 'Biogeochemical Cycles'],
      },
    ],
  },
  {
    id: 'aptitude',
    name: 'Maths & Reasoning',
    icon: 'Calculator',
    topics: [
      {
        id: 'apt_day1',
        title: 'Day 1: Quantitative I',
        subtopics: ['Number System', 'HCF & LCM', 'Average', 'Percentage', 'Profit & Loss'],
      },
    ],
  },

  // --- NEW SUBJECTS ---
  {
    id: 'programming',
    name: 'Programming',
    icon: 'Code',
    topics: [
      {
        id: 'prog_day1',
        title: 'Day 1: Python Basics',
        subtopics: ['Variables & Data Types', 'Control Flow (If/Else)', 'Loops (For/While)', 'Functions'],
      },
      {
        id: 'prog_day2',
        title: 'Day 2: Data Structures',
        subtopics: ['Lists & Tuples', 'Dictionaries & Sets', 'Stacks & Queues', 'Basic Strings Ops'],
      },
      {
        id: 'prog_day3',
        title: 'Day 3: OOP',
        subtopics: ['Classes & Objects', 'Inheritance', 'Polymorphism', 'Encapsulation'],
      },
    ],
  },
  {
    id: 'sql',
    name: 'SQL',
    icon: 'Database',
    topics: [
      {
        id: 'sql_day1',
        title: 'Day 1: Basic Queries',
        subtopics: ['SELECT, FROM, WHERE', 'ORDER BY, LIMIT', 'Distinct', 'Arithmetic Operators'],
      },
      {
        id: 'sql_day2',
        title: 'Day 2: Joins & Aggregates',
        subtopics: ['Inner Join', 'Left/Right Join', 'GROUP BY & HAVING', 'COUNT, SUM, AVG'],
      },
    ],
  },
  {
    id: 'aiml',
    name: 'AI & Machine Learning',
    icon: 'BrainCircuit',
    topics: [
      {
        id: 'ai_day1',
        title: 'Day 1: Intro to AI',
        subtopics: ['History of AI', 'Types of AI (Narrow vs General)', 'Supervised Learning', 'Unsupervised Learning'],
      },
      {
        id: 'ai_day2',
        title: 'Day 2: Algorithms',
        subtopics: ['Linear Regression', 'Logistic Regression', 'Decision Trees', 'Neural Networks Basics'],
      },
    ],
  },
  {
    id: 'powerbi',
    name: 'Power BI',
    icon: 'BarChart',
    topics: [
      {
        id: 'bi_day1',
        title: 'Day 1: Power BI Basics',
        subtopics: ['Power Query Editor', 'Data Modeling', 'Star Schema', 'Calculated Columns'],
      },
      {
        id: 'bi_day2',
        title: 'Day 2: DAX & Visuals',
        subtopics: ['DAX Functions (SUMX, CALCULATE)', 'Creating Measures', 'Filters vs Slicers', 'Dashboards'],
      },
    ],
  },
  {
    id: 'english',
    name: 'English',
    icon: 'BookA',
    topics: [
      {
        id: 'eng_day1',
        title: 'Day 1: Grammar Core',
        subtopics: ['Tenses', 'Articles', 'Prepositions', 'Subject-Verb Agreement'],
      },
      {
        id: 'eng_day2',
        title: 'Day 2: Vocabulary',
        subtopics: ['Synonyms & Antonyms', 'Idioms & Phrases', 'One Word Substitution', 'Spelling Rules'],
      },
    ],
  },
];

export const PREVIOUS_PAPERS: PreviousPaper[] = [
  { year: 2023, paper1Url: '/papers/2023_paper1.pdf', paper2Url: '/papers/2023_paper2.pdf' },
  { year: 2022, paper1Url: '/papers/2022_paper1.pdf', paper2Url: '/papers/2022_paper2.pdf' },
  { year: 2021, paper1Url: '/papers/2021_paper1.pdf', paper2Url: '/papers/2021_paper2.pdf' },
];

export const TEST_PAPERS: TestPaper[] = [
  {
    id: 'mock_1',
    title: 'CAPF Full Length Mock Test 01',
    subjectId: 'all',
    difficulty: 'Medium',
    duration: 120, 
    questions: [
      {
        id: 101,
        text: "Which Schedule of the Indian Constitution divides legislative powers between the Union and the States?",
        options: ["6th Schedule", "7th Schedule", "8th Schedule", "9th Schedule"],
        correctAnswer: 1,
        explanation: "The 7th Schedule contains the Union List, State List, and Concurrent List."
      },
    ]
  },
];

/**
 * --------------------------------------------------------------------------
 * CODING PROBLEMS DEFINITION (LeetCode Style) - PYTHON
 * --------------------------------------------------------------------------
 */
export const CODING_PROBLEMS: CodingProblem[] = [
  {
    id: 'code_1',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
    
You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    starterCode: `def twoSum(nums, target):
    # Write your code here
    pass`,
    testCases: [
      { input: [[2,7,11,15], 9], expected: [0,1] },
      { input: [[3,2,4], 6], expected: [1,2] },
      { input: [[3,3], 6], expected: [0,1] }
    ]
  },
  {
    id: 'code_2',
    title: 'Palindrome Number',
    difficulty: 'Easy',
    description: 'Given an integer x, return true if x is a palindrome, and false otherwise.',
    starterCode: `def isPalindrome(x):
    # Write your code here
    pass`,
    testCases: [
      { input: [121], expected: true },
      { input: [-121], expected: false },
      { input: [10], expected: false }
    ]
  },
  {
    id: 'code_3',
    title: 'Fizz Buzz',
    difficulty: 'Easy',
    description: `Given an integer n, return a string list answer (1-indexed) where:
- answer[i] == "FizzBuzz" if i is divisible by 3 and 5.
- answer[i] == "Fizz" if i is divisible by 3.
- answer[i] == "Buzz" if i is divisible by 5.
- answer[i] == i (as a string) if none of the above conditions are true.`,
    starterCode: `def fizzBuzz(n):
    # Write your code here
    pass`,
    testCases: [
      { input: [3], expected: ["1","2","Fizz"] },
      { input: [5], expected: ["1","2","Fizz","4","Buzz"] }
    ]
  },
   {
    id: 'code_4',
    title: 'Factorial Calculator',
    difficulty: 'Medium',
    description: 'Write a function to calculate the factorial of a number n. If n is negative, return None.',
    starterCode: `def factorial(n):
    # Write your code here
    pass`,
    testCases: [
      { input: [5], expected: 120 },
      { input: [0], expected: 1 },
      { input: [3], expected: 6 }
    ]
  }
];