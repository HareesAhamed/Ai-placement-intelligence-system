"""Seed the database with sample coding problems."""

import sys
import os

# Ensure the backend app package is importable
sys.path.insert(0, os.path.dirname(__file__))

from app.config import get_settings
from app.database import Base, engine, SessionLocal
from app.models.problem import Problem
import app.models  # noqa: F401

PROBLEMS = [
    {
        "title": "Two Sum",
        "difficulty": "Easy",
        "topic": "Arrays",
        "description": (
            "Given an array of integers `nums` and an integer `target`, return the "
            "indices of the two numbers such that they add up to `target`.\n\n"
            "You may assume that each input would have exactly one solution, and you "
            "may not use the same element twice.\n\n"
            "Print the two indices separated by a space (0-indexed), smaller index first."
        ),
        "input_format": "First line: space-separated integers (the array).\nSecond line: the target integer.",
        "output_format": "Two space-separated indices.",
        "constraints": "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9",
        "examples": [
            {"input": "2 7 11 15\n9", "output": "0 1", "explanation": "nums[0] + nums[1] = 2 + 7 = 9"},
            {"input": "3 2 4\n6", "output": "1 2", "explanation": "nums[1] + nums[2] = 2 + 4 = 6"},
        ],
        "company_tags": ["Google", "Amazon", "Microsoft", "Meta"],
        "hints": [
            "Try using a hash map to store values you have already seen.",
            "For each element, check if target - element exists in the map.",
        ],
        "visible_testcases": [
            {"input": "2 7 11 15\n9", "expected_output": "0 1"},
            {"input": "3 2 4\n6", "expected_output": "1 2"},
        ],
        "hidden_testcases": [
            {"input": "3 3\n6", "expected_output": "0 1"},
            {"input": "1 5 3 7\n8", "expected_output": "1 2"},
        ],
    },
    {
        "title": "Reverse String",
        "difficulty": "Easy",
        "topic": "Strings",
        "description": (
            "Write a program that reverses a given string.\n\n"
            "Read a string from standard input and print the reversed string."
        ),
        "input_format": "A single line containing a string.",
        "output_format": "The reversed string.",
        "constraints": "1 <= s.length <= 10^5\ns consists of printable ASCII characters.",
        "examples": [
            {"input": "hello", "output": "olleh"},
            {"input": "PrepIQ", "output": "QIperP"},
        ],
        "company_tags": ["Microsoft", "Apple"],
        "hints": ["Two-pointer approach: swap characters from both ends moving inward."],
        "visible_testcases": [
            {"input": "hello", "expected_output": "olleh"},
            {"input": "PrepIQ", "expected_output": "QIperP"},
        ],
        "hidden_testcases": [
            {"input": "a", "expected_output": "a"},
            {"input": "racecar", "expected_output": "racecar"},
            {"input": "abcdef", "expected_output": "fedcba"},
        ],
    },
    {
        "title": "Fibonacci Number",
        "difficulty": "Easy",
        "topic": "Dynamic Programming",
        "description": (
            "The Fibonacci numbers form a sequence such that each number is the sum "
            "of the two preceding ones, starting from 0 and 1.\n\n"
            "Given an integer `n`, return the n-th Fibonacci number.\n\n"
            "F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2) for n > 1."
        ),
        "input_format": "A single integer n.",
        "output_format": "The n-th Fibonacci number.",
        "constraints": "0 <= n <= 30",
        "examples": [
            {"input": "5", "output": "5", "explanation": "F(5) = F(4) + F(3) = 3 + 2 = 5"},
            {"input": "10", "output": "55"},
        ],
        "company_tags": ["Amazon", "Goldman Sachs"],
        "hints": ["Use iterative approach to avoid exponential time complexity of recursion."],
        "visible_testcases": [
            {"input": "5", "expected_output": "5"},
            {"input": "10", "expected_output": "55"},
        ],
        "hidden_testcases": [
            {"input": "0", "expected_output": "0"},
            {"input": "1", "expected_output": "1"},
            {"input": "20", "expected_output": "6765"},
            {"input": "30", "expected_output": "832040"},
        ],
    },
    {
        "title": "Maximum Subarray",
        "difficulty": "Medium",
        "topic": "Arrays",
        "description": (
            "Given an integer array `nums`, find the subarray with the largest sum "
            "and return its sum.\n\n"
            "A subarray is a contiguous non-empty sequence of elements within an array."
        ),
        "input_format": "A single line of space-separated integers.",
        "output_format": "A single integer — the maximum subarray sum.",
        "constraints": "1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4",
        "examples": [
            {"input": "-2 1 -3 4 -1 2 1 -5 4", "output": "6", "explanation": "The subarray [4,-1,2,1] has the largest sum 6."},
            {"input": "1", "output": "1"},
        ],
        "company_tags": ["Amazon", "Microsoft", "LinkedIn", "Apple"],
        "hints": [
            "Use Kadane's algorithm.",
            "Keep track of the current subarray sum. If it becomes negative, reset it to 0.",
        ],
        "visible_testcases": [
            {"input": "-2 1 -3 4 -1 2 1 -5 4", "expected_output": "6"},
            {"input": "1", "expected_output": "1"},
        ],
        "hidden_testcases": [
            {"input": "5 4 -1 7 8", "expected_output": "23"},
            {"input": "-1", "expected_output": "-1"},
            {"input": "-2 -1", "expected_output": "-1"},
        ],
    },
    {
        "title": "Valid Parentheses",
        "difficulty": "Easy",
        "topic": "Stacks",
        "description": (
            "Given a string `s` containing just the characters '(', ')', '{', '}', "
            "'[' and ']', determine if the input string is valid.\n\n"
            "An input string is valid if:\n"
            "- Open brackets are closed by the same type of brackets.\n"
            "- Open brackets are closed in the correct order.\n"
            "- Every close bracket has a corresponding open bracket of the same type.\n\n"
            "Print `true` if valid, `false` otherwise."
        ),
        "input_format": "A single line containing the string s.",
        "output_format": "'true' or 'false'.",
        "constraints": "1 <= s.length <= 10^4\ns consists of parentheses only '()[]{}'.",
        "examples": [
            {"input": "()", "output": "true"},
            {"input": "()[]{}", "output": "true"},
            {"input": "(]", "output": "false"},
        ],
        "company_tags": ["Google", "Amazon", "Meta", "Bloomberg"],
        "hints": [
            "Use a stack to keep track of opening brackets.",
            "When you encounter a closing bracket, check if the top of the stack matches.",
        ],
        "visible_testcases": [
            {"input": "()", "expected_output": "true"},
            {"input": "()[]{}", "expected_output": "true"},
            {"input": "(]", "expected_output": "false"},
        ],
        "hidden_testcases": [
            {"input": "([)]", "expected_output": "false"},
            {"input": "{[]}", "expected_output": "true"},
            {"input": "", "expected_output": "true"},
            {"input": "((()))", "expected_output": "true"},
        ],
    },
    {
        "title": "Merge Two Sorted Arrays",
        "difficulty": "Easy",
        "topic": "Arrays",
        "description": (
            "Given two sorted arrays of integers, merge them into a single sorted array.\n\n"
            "Print the merged array as space-separated integers."
        ),
        "input_format": "First line: space-separated integers of array 1.\nSecond line: space-separated integers of array 2.",
        "output_format": "Space-separated integers of the merged sorted array.",
        "constraints": "0 <= length of each array <= 10^4",
        "examples": [
            {"input": "1 3 5\n2 4 6", "output": "1 2 3 4 5 6"},
            {"input": "1\n", "output": "1"},
        ],
        "company_tags": ["Microsoft", "Adobe"],
        "hints": ["Use two pointers, one for each array, and compare elements."],
        "visible_testcases": [
            {"input": "1 3 5\n2 4 6", "expected_output": "1 2 3 4 5 6"},
            {"input": "1\n", "expected_output": "1"},
        ],
        "hidden_testcases": [
            {"input": "\n1 2 3", "expected_output": "1 2 3"},
            {"input": "1 2 3\n4 5 6", "expected_output": "1 2 3 4 5 6"},
            {"input": "1 1 1\n1 1 1", "expected_output": "1 1 1 1 1 1"},
        ],
    },
    {
        "title": "Longest Common Subsequence",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "description": (
            "Given two strings `text1` and `text2`, return the length of their "
            "longest common subsequence. If there is no common subsequence, return 0.\n\n"
            "A subsequence of a string is a new string generated from the original "
            "string with some characters (can be none) deleted without changing the "
            "relative order of the remaining characters."
        ),
        "input_format": "First line: string text1.\nSecond line: string text2.",
        "output_format": "A single integer — length of the longest common subsequence.",
        "constraints": "1 <= text1.length, text2.length <= 1000\nStrings consist of lowercase English letters only.",
        "examples": [
            {"input": "abcde\nace", "output": "3", "explanation": "The LCS is 'ace' with length 3."},
            {"input": "abc\nabc", "output": "3"},
            {"input": "abc\ndef", "output": "0"},
        ],
        "company_tags": ["Amazon", "Google", "Uber"],
        "hints": [
            "Use 2D DP where dp[i][j] = LCS of text1[:i] and text2[:j].",
            "If text1[i-1] == text2[j-1], dp[i][j] = dp[i-1][j-1] + 1.",
        ],
        "visible_testcases": [
            {"input": "abcde\nace", "expected_output": "3"},
            {"input": "abc\nabc", "expected_output": "3"},
            {"input": "abc\ndef", "expected_output": "0"},
        ],
        "hidden_testcases": [
            {"input": "a\na", "expected_output": "1"},
            {"input": "abcdefg\nbdfg", "expected_output": "4"},
            {"input": "oxcpqrsvwf\nshmtulqrypy", "expected_output": "2"},
        ],
    },
    {
        "title": "Binary Search",
        "difficulty": "Easy",
        "topic": "Searching",
        "description": (
            "Given a sorted array of integers and a target value, implement binary "
            "search to find the target.\n\n"
            "If the target exists, print its index (0-indexed). Otherwise, print -1."
        ),
        "input_format": "First line: space-separated sorted integers.\nSecond line: the target integer.",
        "output_format": "Index of the target, or -1.",
        "constraints": "1 <= nums.length <= 10^4\n-10^4 <= nums[i], target <= 10^4\nAll integers in nums are unique.\nnums is sorted in ascending order.",
        "examples": [
            {"input": "-1 0 3 5 9 12\n9", "output": "4"},
            {"input": "-1 0 3 5 9 12\n2", "output": "-1"},
        ],
        "company_tags": ["Google", "Microsoft", "Amazon"],
        "hints": ["Use two pointers (low, high) and check the midpoint each iteration."],
        "visible_testcases": [
            {"input": "-1 0 3 5 9 12\n9", "expected_output": "4"},
            {"input": "-1 0 3 5 9 12\n2", "expected_output": "-1"},
        ],
        "hidden_testcases": [
            {"input": "5\n5", "expected_output": "0"},
            {"input": "1 2 3 4 5\n1", "expected_output": "0"},
            {"input": "1 2 3 4 5\n5", "expected_output": "4"},
            {"input": "1 2 3 4 5\n6", "expected_output": "-1"},
        ],
    },
    {
        "title": "Climbing Stairs",
        "difficulty": "Easy",
        "topic": "Dynamic Programming",
        "description": (
            "You are climbing a staircase. It takes `n` steps to reach the top.\n\n"
            "Each time you can either climb 1 or 2 steps. In how many distinct ways "
            "can you climb to the top?"
        ),
        "input_format": "A single integer n.",
        "output_format": "A single integer — the number of distinct ways.",
        "constraints": "1 <= n <= 45",
        "examples": [
            {"input": "2", "output": "2", "explanation": "1+1 or 2"},
            {"input": "3", "output": "3", "explanation": "1+1+1, 1+2, or 2+1"},
        ],
        "company_tags": ["Amazon", "Apple", "Adobe"],
        "hints": [
            "This is a Fibonacci variant.",
            "dp[i] = dp[i-1] + dp[i-2]",
        ],
        "visible_testcases": [
            {"input": "2", "expected_output": "2"},
            {"input": "3", "expected_output": "3"},
        ],
        "hidden_testcases": [
            {"input": "1", "expected_output": "1"},
            {"input": "5", "expected_output": "8"},
            {"input": "10", "expected_output": "89"},
            {"input": "45", "expected_output": "1836311903"},
        ],
    },
    {
        "title": "Container With Most Water",
        "difficulty": "Medium",
        "topic": "Two Pointers",
        "description": (
            "You are given an integer array `height` of length n. There are n vertical "
            "lines drawn such that the two endpoints of the i-th line are (i, 0) and "
            "(i, height[i]).\n\n"
            "Find two lines that together with the x-axis form a container that holds "
            "the most water.\n\n"
            "Return the maximum amount of water a container can store."
        ),
        "input_format": "A single line of space-separated integers representing heights.",
        "output_format": "A single integer — the maximum area.",
        "constraints": "n == height.length\n2 <= n <= 10^5\n0 <= height[i] <= 10^4",
        "examples": [
            {"input": "1 8 6 2 5 4 8 3 7", "output": "49"},
            {"input": "1 1", "output": "1"},
        ],
        "company_tags": ["Amazon", "Goldman Sachs", "Google", "Meta"],
        "hints": [
            "Use two pointers starting at both ends.",
            "Move the pointer with the shorter line inward.",
        ],
        "visible_testcases": [
            {"input": "1 8 6 2 5 4 8 3 7", "expected_output": "49"},
            {"input": "1 1", "expected_output": "1"},
        ],
        "hidden_testcases": [
            {"input": "4 3 2 1 4", "expected_output": "16"},
            {"input": "1 2 1", "expected_output": "2"},
        ],
    },
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(Problem).count()
        if existing > 0:
            print(f"Database already has {existing} problems. Skipping seed.")
            return

        for data in PROBLEMS:
            problem = Problem(**data)
            db.add(problem)

        db.commit()
        print(f"Successfully seeded {len(PROBLEMS)} problems.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
