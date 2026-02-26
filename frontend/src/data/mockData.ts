import type { TopicPerformance, CompanyPatterns, Problem, DayPerformance, MockTestResult, HeatmapCell } from '../types';

// ========== User Topic Performance ==========
export const userPerformance: TopicPerformance[] = [
  { topic: 'Array', attempts: 24, solved: 19, avgTime: 22 },
  { topic: 'String', attempts: 18, solved: 14, avgTime: 20 },
  { topic: 'Linked List', attempts: 14, solved: 10, avgTime: 28 },
  { topic: 'Stack', attempts: 12, solved: 9, avgTime: 18 },
  { topic: 'Queue', attempts: 8, solved: 6, avgTime: 15 },
  { topic: 'Tree', attempts: 16, solved: 9, avgTime: 35 },
  { topic: 'Graph', attempts: 12, solved: 4, avgTime: 55 },
  { topic: 'DP', attempts: 20, solved: 7, avgTime: 48 },
  { topic: 'Greedy', attempts: 10, solved: 7, avgTime: 25 },
  { topic: 'Binary Search', attempts: 14, solved: 11, avgTime: 20 },
  { topic: 'Backtracking', attempts: 8, solved: 3, avgTime: 45 },
  { topic: 'Heap', attempts: 6, solved: 4, avgTime: 30 },
];

// ========== Company Patterns & Weightage ==========
export const companyPatterns: CompanyPatterns = {
  Amazon: {
    Array: 0.20, DP: 0.25, Graph: 0.15, Tree: 0.15,
    'Linked List': 0.05, String: 0.10, Greedy: 0.05, 'Binary Search': 0.05,
  },
  Google: {
    Array: 0.15, DP: 0.30, Graph: 0.20, Tree: 0.10,
    String: 0.05, Backtracking: 0.10, 'Binary Search': 0.05, Heap: 0.05,
  },
  Meta: {
    Array: 0.25, String: 0.15, DP: 0.20, Graph: 0.10,
    Tree: 0.10, 'Binary Search': 0.10, Stack: 0.05, Queue: 0.05,
  },
  Apple: {
    Array: 0.20, String: 0.15, 'Linked List': 0.15, Tree: 0.15,
    DP: 0.15, Stack: 0.05, Queue: 0.05, Greedy: 0.10,
  },
};

// ========== Problem Bank ==========
export const problemBank: Problem[] = [
  { id: 'p1', title: 'Two Sum', topic: 'Array', difficulty: 'Easy', solved: true, timeTaken: 15, attemptCount: 1, confidence: 5, solvedAt: '2026-02-20' },
  { id: 'p2', title: 'Best Time to Buy and Sell Stock', topic: 'Array', difficulty: 'Easy', solved: true, timeTaken: 12, attemptCount: 1, confidence: 4, solvedAt: '2026-02-20' },
  { id: 'p3', title: 'Product of Array Except Self', topic: 'Array', difficulty: 'Medium', solved: true, timeTaken: 28, attemptCount: 2, confidence: 3, solvedAt: '2026-02-21' },
  { id: 'p4', title: 'Maximum Subarray', topic: 'Array', difficulty: 'Medium', solved: true, timeTaken: 20, attemptCount: 1, confidence: 4, solvedAt: '2026-02-21' },
  { id: 'p5', title: 'Container With Most Water', topic: 'Array', difficulty: 'Medium', solved: true, timeTaken: 35, attemptCount: 3, confidence: 2, solvedAt: '2026-02-22' },
  { id: 'p6', title: 'Valid Parentheses', topic: 'Stack', difficulty: 'Easy', solved: true, timeTaken: 10, attemptCount: 1, confidence: 5, solvedAt: '2026-02-19' },
  { id: 'p7', title: 'Longest Substring Without Repeating', topic: 'String', difficulty: 'Medium', solved: true, timeTaken: 25, attemptCount: 2, confidence: 3, solvedAt: '2026-02-19' },
  { id: 'p8', title: 'Reverse Linked List', topic: 'Linked List', difficulty: 'Easy', solved: true, timeTaken: 12, attemptCount: 1, confidence: 5, solvedAt: '2026-02-18' },
  { id: 'p9', title: 'Binary Tree Inorder Traversal', topic: 'Tree', difficulty: 'Easy', solved: true, timeTaken: 15, attemptCount: 1, confidence: 4, solvedAt: '2026-02-18' },
  { id: 'p10', title: 'Climbing Stairs', topic: 'DP', difficulty: 'Easy', solved: true, timeTaken: 18, attemptCount: 1, confidence: 4, solvedAt: '2026-02-17' },
  { id: 'p11', title: 'Longest Common Subsequence', topic: 'DP', difficulty: 'Medium', solved: false, timeTaken: undefined, attemptCount: 3, confidence: 1 },
  { id: 'p12', title: 'Edit Distance', topic: 'DP', difficulty: 'Hard', solved: false, timeTaken: undefined, attemptCount: 2, confidence: 1 },
  { id: 'p13', title: 'Course Schedule', topic: 'Graph', difficulty: 'Medium', solved: false, timeTaken: undefined, attemptCount: 2, confidence: 1 },
  { id: 'p14', title: 'Number of Islands', topic: 'Graph', difficulty: 'Medium', solved: true, timeTaken: 40, attemptCount: 3, confidence: 2, solvedAt: '2026-02-22' },
  { id: 'p15', title: 'Word Search', topic: 'Backtracking', difficulty: 'Medium', solved: false, timeTaken: undefined, attemptCount: 1, confidence: 1 },
  { id: 'p16', title: 'Merge K Sorted Lists', topic: 'Heap', difficulty: 'Hard', solved: false, timeTaken: undefined, attemptCount: 1, confidence: 1 },
  { id: 'p17', title: 'Binary Search', topic: 'Binary Search', difficulty: 'Easy', solved: true, timeTaken: 8, attemptCount: 1, confidence: 5, solvedAt: '2026-02-16' },
  { id: 'p18', title: 'Search in Rotated Sorted Array', topic: 'Binary Search', difficulty: 'Medium', solved: true, timeTaken: 30, attemptCount: 2, confidence: 3, solvedAt: '2026-02-22' },
  { id: 'p19', title: 'Trapping Rain Water', topic: 'Array', difficulty: 'Hard', solved: false, timeTaken: undefined, attemptCount: 2, confidence: 1 },
  { id: 'p20', title: 'Validate BST', topic: 'Tree', difficulty: 'Medium', solved: true, timeTaken: 25, attemptCount: 2, confidence: 3, solvedAt: '2026-02-23' },
  { id: 'p21', title: 'LRU Cache', topic: 'Linked List', difficulty: 'Medium', solved: false, timeTaken: undefined, attemptCount: 2, confidence: 2 },
  { id: 'p22', title: 'Group Anagrams', topic: 'String', difficulty: 'Medium', solved: true, timeTaken: 22, attemptCount: 1, confidence: 4, solvedAt: '2026-02-23' },
  { id: 'p23', title: 'Coin Change', topic: 'DP', difficulty: 'Medium', solved: true, timeTaken: 35, attemptCount: 3, confidence: 2, solvedAt: '2026-02-24' },
  { id: 'p24', title: 'Implement Trie', topic: 'Tree', difficulty: 'Medium', solved: false, timeTaken: undefined, attemptCount: 1, confidence: 2 },
  { id: 'p25', title: 'Activity Selection', topic: 'Greedy', difficulty: 'Easy', solved: true, timeTaken: 15, attemptCount: 1, confidence: 4, solvedAt: '2026-02-24' },
];

// ========== 7-Day Performance Trend ==========
export const weeklyPerformance: DayPerformance[] = [
  { day: 'Mon', problems: 5, accuracy: 72 },
  { day: 'Tue', problems: 4, accuracy: 80 },
  { day: 'Wed', problems: 6, accuracy: 68 },
  { day: 'Thu', problems: 3, accuracy: 85 },
  { day: 'Fri', problems: 7, accuracy: 74 },
  { day: 'Sat', problems: 8, accuracy: 78 },
  { day: 'Sun', problems: 5, accuracy: 82 },
];

// ========== Mock Test History ==========
export const mockTestHistory: MockTestResult[] = [
  {
    id: 'mt1', type: 'pattern', category: 'Array',
    score: 85, totalQuestions: 10, timeTaken: 45,
    date: '2026-02-20',
    strengths: ['Two pointer technique', 'Sliding window'],
    weaknesses: ['Kadane\'s algorithm edge cases'],
  },
  {
    id: 'mt2', type: 'company', category: 'Amazon',
    score: 62, totalQuestions: 10, timeTaken: 55,
    date: '2026-02-22',
    strengths: ['Array manipulation', 'Hash maps'],
    weaknesses: ['Graph traversal', 'DP optimization'],
  },
  {
    id: 'mt3', type: 'pattern', category: 'DP',
    score: 40, totalQuestions: 10, timeTaken: 60,
    date: '2026-02-24',
    strengths: ['Basic memoization'],
    weaknesses: ['State transition', 'Space optimization', 'Interval scheduling'],
  },
];

// ========== Heatmap Data ==========
export const heatmapData: HeatmapCell[] = [
  { topic: 'Array', week: 1, intensity: 4 },
  { topic: 'Array', week: 2, intensity: 3 },
  { topic: 'Array', week: 3, intensity: 4 },
  { topic: 'Array', week: 4, intensity: 3 },
  { topic: 'String', week: 1, intensity: 3 },
  { topic: 'String', week: 2, intensity: 2 },
  { topic: 'String', week: 3, intensity: 3 },
  { topic: 'String', week: 4, intensity: 4 },
  { topic: 'DP', week: 1, intensity: 1 },
  { topic: 'DP', week: 2, intensity: 1 },
  { topic: 'DP', week: 3, intensity: 2 },
  { topic: 'DP', week: 4, intensity: 2 },
  { topic: 'Graph', week: 1, intensity: 0 },
  { topic: 'Graph', week: 2, intensity: 1 },
  { topic: 'Graph', week: 3, intensity: 1 },
  { topic: 'Graph', week: 4, intensity: 2 },
  { topic: 'Tree', week: 1, intensity: 2 },
  { topic: 'Tree', week: 2, intensity: 2 },
  { topic: 'Tree', week: 3, intensity: 3 },
  { topic: 'Tree', week: 4, intensity: 2 },
  { topic: 'Linked List', week: 1, intensity: 2 },
  { topic: 'Linked List', week: 2, intensity: 3 },
  { topic: 'Linked List', week: 3, intensity: 2 },
  { topic: 'Linked List', week: 4, intensity: 1 },
  { topic: 'Stack', week: 1, intensity: 3 },
  { topic: 'Stack', week: 2, intensity: 2 },
  { topic: 'Stack', week: 3, intensity: 3 },
  { topic: 'Stack', week: 4, intensity: 2 },
  { topic: 'Binary Search', week: 1, intensity: 3 },
  { topic: 'Binary Search', week: 2, intensity: 4 },
  { topic: 'Binary Search', week: 3, intensity: 3 },
  { topic: 'Binary Search', week: 4, intensity: 3 },
  { topic: 'Backtracking', week: 1, intensity: 0 },
  { topic: 'Backtracking', week: 2, intensity: 1 },
  { topic: 'Backtracking', week: 3, intensity: 1 },
  { topic: 'Backtracking', week: 4, intensity: 0 },
  { topic: 'Greedy', week: 1, intensity: 2 },
  { topic: 'Greedy', week: 2, intensity: 3 },
  { topic: 'Greedy', week: 3, intensity: 2 },
  { topic: 'Greedy', week: 4, intensity: 3 },
  { topic: 'Heap', week: 1, intensity: 1 },
  { topic: 'Heap', week: 2, intensity: 1 },
  { topic: 'Heap', week: 3, intensity: 2 },
  { topic: 'Heap', week: 4, intensity: 1 },
];

// ========== AI Insight Messages ==========
export const aiInsights = [
  "Your DP skills need focused attention. Consider spending 45 min daily on medium-level DP problems.",
  "Graph traversal patterns show inconsistency. Review BFS/DFS fundamentals before attempting hard problems.",
  "Strong improvement in Array-based problems this week! Keep the momentum going.",
  "Your mock test performance suggests readiness for Amazon OA. Focus on Graph + DP for the next 2 weeks.",
  "Backtracking is your weakest area. Start with N-Queens and Sudoku Solver for pattern recognition.",
];
