from dataclasses import dataclass

from app.services.code_executor import code_executor


@dataclass
class TestcaseRunResult:
    status: str
    passed: int
    total: int
    max_runtime_ms: int


class TestcaseRunner:
    @staticmethod
    def _normalize(text: str) -> str:
        return "\n".join(line.rstrip() for line in text.strip().splitlines())

    def evaluate(
        self,
        language: str,
        code: str,
        visible_testcases: list[dict[str, str]],
        hidden_testcases: list[dict[str, str]],
    ) -> TestcaseRunResult:
        testcases = [*visible_testcases, *hidden_testcases]
        total = len(testcases)
        passed = 0
        max_runtime = 0
        final_status = "Accepted"

        for testcase in testcases:
            exec_result = code_executor.execute(language=language, code=code, input_data=testcase["input"])
            max_runtime = max(max_runtime, exec_result.runtime_ms)

            if exec_result.status != "success":
                final_status = exec_result.status
                continue

            expected = self._normalize(testcase["expected_output"])
            actual = self._normalize(exec_result.output)

            if actual == expected:
                passed += 1
            elif final_status == "Accepted":
                final_status = "Wrong Answer"

        if total == 0:
            return TestcaseRunResult(status="Runtime Error", passed=0, total=0, max_runtime_ms=max_runtime)

        if passed == total:
            final_status = "Accepted"
        elif final_status == "Accepted":
            final_status = "Wrong Answer"

        return TestcaseRunResult(status=final_status, passed=passed, total=total, max_runtime_ms=max_runtime)


testcase_runner = TestcaseRunner()
