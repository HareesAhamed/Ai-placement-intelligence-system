import type { TutorialItem } from '../types/coding';

export const tutorialFallbacks: TutorialItem[] = [
  {
    topic: 'Arrays',
    title: 'Arrays Fundamentals',
    concept: 'Arrays are ideal for indexed access, prefix sums, sliding windows, and two-pointer patterns used in interview DSA.',
    code_example:
      'def two_sum(nums, target):\n    seen = {}\n    for i, value in enumerate(nums):\n        need = target - value\n        if need in seen:\n            return [seen[need], i]\n        seen[value] = i\n    return []',
    complexity: 'Access O(1), linear scans O(n), two-sum hash map O(n).',
    practice_tips: 'Practice prefix-sum, difference-array, sliding-window, and sorted two-pointer conversions.',
    resource_link: 'https://takeuforward.org/arrays/',
    video_links: [
      'https://www.youtube.com/watch?v=37E9ckMDdTk',
      'https://www.youtube.com/watch?v=Jg4E4K5M1f8',
    ],
    article_snippets: [
      {
        title: 'Prefix Sum Template',
        language: 'python',
        code: 'def prefix(nums):\n    out = [0]\n    for x in nums:\n        out.append(out[-1] + x)\n    return out',
      },
    ],
  },
  {
    topic: 'Strings',
    title: 'Strings Patterns',
    concept: 'Strings questions are mostly frequency counting, substring windows, palindrome checks, and pattern constraints.',
    code_example:
      'from collections import Counter\n\ndef is_anagram(a, b):\n    return Counter(a) == Counter(b)',
    complexity: 'Typical scans O(n), fixed alphabet frequency checks O(n).',
    practice_tips: 'Master anagram, longest unique substring, and expand-around-center palindrome questions.',
    resource_link: 'https://takeuforward.org/strings/',
    video_links: [
      'https://www.youtube.com/watch?v=4T7iM3K5n9s',
      'https://www.youtube.com/watch?v=0n7x4A2k8R8',
    ],
    article_snippets: [
      {
        title: 'Sliding Window Skeleton',
        language: 'python',
        code: 'left = 0\nfor right in range(len(s)):\n    # update state\n    while not valid_state():\n        left += 1',
      },
    ],
  },
  {
    topic: 'Recursion',
    title: 'Recursion and Backtracking',
    concept: 'Recursion breaks a problem into smaller subproblems until base conditions are reached; backtracking explores choices.',
    code_example:
      'def backtrack(path, choices):\n    if is_goal(path):\n        ans.append(path[:])\n        return\n    for c in choices:\n        path.append(c)\n        backtrack(path, choices)\n        path.pop()',
    complexity: 'Depends on branching factor and depth; often exponential without pruning.',
    practice_tips: 'Write base case first, trace call stack manually, then prune invalid branches early.',
    resource_link: 'https://takeuforward.org/recursion/',
    video_links: ['https://www.youtube.com/watch?v=IJDJ0kBx2LM'],
    article_snippets: [],
  },
  {
    topic: 'Binary Search',
    title: 'Binary Search Mastery',
    concept: 'Binary search reduces sorted or monotonic search spaces by half each iteration.',
    code_example:
      'def binary_search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        m = (l + r) // 2\n        if nums[m] == target:\n            return m\n        if nums[m] < target:\n            l = m + 1\n        else:\n            r = m - 1\n    return -1',
    complexity: 'Time O(log n), space O(1).',
    practice_tips: 'Practice first/last occurrence and answer-space binary search on monotonic conditions.',
    resource_link: 'https://takeuforward.org/binary-search/',
    video_links: [
      'https://www.youtube.com/watch?v=Y4Vj3ywV1xY',
      'https://www.youtube.com/watch?v=QSPwI2jaWkI',
    ],
    article_snippets: [
      {
        title: 'Lower Bound Pattern',
        language: 'python',
        code: 'def lower_bound(nums, target):\n    l, r = 0, len(nums)\n    while l < r:\n        m = (l + r) // 2\n        if nums[m] < target:\n            l = m + 1\n        else:\n            r = m\n    return l',
      },
    ],
  },
];
