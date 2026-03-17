from __future__ import annotations

from app.models.problem import Problem


class CodeReviewService:
    def review(self, problem: Problem, code: str, language: str, status: str) -> dict[str, object]:
        code_len = len(code.strip())
        loops = code.count("for") + code.count("while")
        map_usage = any(token in code for token in ["unordered_map", "HashMap", "dict(", "{}", "Map<"])  # heuristic

        complexity = "O(n)"
        if loops >= 2 and not map_usage:
            complexity = "O(n^2)"
        elif loops >= 3:
            complexity = "O(n^3)"

        optimal_hint = "Try hash-based lookup or two-pointer simplification where applicable."
        if problem.topic.lower() in {"binary search", "arrays"}:
            optimal_hint = "Use monotonic condition checks and reduce comparisons inside loops."
        if problem.topic.lower() in {"graphs", "trees"}:
            optimal_hint = "Prefer adjacency-list traversal and avoid repeated full scans."

        improvements = []
        if code_len < 40:
            improvements.append("Implementation looks incomplete; add edge-case handling and return path.")
        if "print(" in code and language != "python":
            improvements.append("Avoid debug printing in final submission path.")
        if loops >= 2:
            improvements.append("Nested iteration detected; evaluate whether one-pass indexing can reduce runtime.")
        if not improvements:
            improvements.append("Code structure is clean. Add comments for tricky branches and corner cases.")

        alternative = "Use preprocessing + lookup table to trade small memory for faster execution."
        if problem.topic.lower() == "dynamic programming":
            alternative = "Try bottom-up tabulation if recursive state transitions are repeated."

        verdict = "Solution accepted and reasonably efficient."
        if status != "Accepted":
            verdict = "Solution is not accepted yet; validate constraints and boundary cases first."
        elif complexity != "O(n)":
            verdict = "Solution is correct but likely not optimal for larger constraints."

        return {
            "verdict": verdict,
            "time_complexity": complexity,
            "space_complexity": "O(n)" if map_usage else "O(1) to O(n)",
            "optimal_solution": optimal_hint,
            "improvements": improvements,
            "alternative_approach": alternative,
        }

    def editorial(self, problem: Problem) -> dict[str, object]:
        topic = problem.topic
        return {
            "concept_explanation": f"This problem focuses on core {topic} reasoning: identify invariant, then apply a deterministic traversal strategy.",
            "step_by_step": [
                "Read constraints and select data structure matching operation frequency.",
                "Build core transition/check function with clear base case.",
                "Run on sample input and verify boundary cases.",
                "Optimize by removing redundant scans and memory copies.",
            ],
            "optimized_code": "Use topic-specific optimized approach (one-pass/hash or binary-search/graph traversal) with explicit edge-case checks.",
            "tutorial_link": problem.tutorial_link,
        }


code_review_service = CodeReviewService()
