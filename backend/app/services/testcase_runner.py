from dataclasses import dataclass
from pathlib import Path
from tempfile import TemporaryDirectory
from time import perf_counter

from app.config import get_settings
from app.docker_runner import DockerRunner


@dataclass
class TestcaseRunResult:
    status: str
    passed: int
    total: int
    max_runtime_ms: int


class TestcaseRunner:
    def __init__(self) -> None:
        settings = get_settings()
        self.settings = settings
        self.runner = DockerRunner(
            timeout_seconds=settings.execution_timeout_seconds,
            cpu_limit=settings.execution_cpu_limit,
            memory_limit_mb=settings.execution_memory_limit_mb,
        )

    @staticmethod
    def _normalize(text: str) -> str:
        return "\n".join(line.rstrip() for line in text.strip().splitlines())

    def _count_passed_outputs(self, tmp_dir: Path, testcases: list[dict[str, str]]) -> int:
        passed = 0
        for idx, testcase in enumerate(testcases):
            output_file = tmp_dir / f"output_{idx}.txt"
            if not output_file.exists():
                break

            actual = self._normalize(output_file.read_text(encoding="utf-8"))
            expected = self._normalize(testcase["expected_output"])
            if actual == expected:
                passed += 1
            else:
                break
        return passed

    def _build_batch_command(self, language: str, total: int) -> tuple[str, str]:
        run_commands = " && ".join(
            f"./main < input_{idx}.txt > output_{idx}.txt 2> error_{idx}.txt"
            if language == "cpp"
            else f"java Main < input_{idx}.txt > output_{idx}.txt 2> error_{idx}.txt"
            for idx in range(total)
        )

        if language == "cpp":
            command = f"g++ -O2 -std=c++17 main.cpp -o main && {run_commands}"
            image = self.settings.docker_image_cpp
        else:
            command = f"javac Main.java && {run_commands}"
            image = self.settings.docker_image_java

        return command, image

    @staticmethod
    def _collect_runtime_stderr(tmp_dir: Path, total: int) -> str:
        stderr_parts: list[str] = []
        for idx in range(total):
            error_file = tmp_dir / f"error_{idx}.txt"
            if error_file.exists():
                content = error_file.read_text(encoding="utf-8").strip()
                if content:
                    stderr_parts.append(content)
        return "\n".join(stderr_parts)

    def evaluate(
        self,
        language: str,
        code: str,
        visible_testcases: list[dict[str, str]],
        hidden_testcases: list[dict[str, str]],
    ) -> TestcaseRunResult:
        if language not in {"cpp", "java"}:
            return TestcaseRunResult(status="Runtime Error", passed=0, total=0, max_runtime_ms=0)

        testcases = [*visible_testcases, *hidden_testcases]
        total = len(testcases)
        if total == 0:
            return TestcaseRunResult(status="Runtime Error", passed=0, total=0, max_runtime_ms=0)

        with TemporaryDirectory(prefix="prepiq-batch-") as tmp_dir_name:
            tmp_dir = Path(tmp_dir_name)

            if language == "cpp":
                (tmp_dir / "main.cpp").write_text(code, encoding="utf-8")
            else:
                (tmp_dir / "Main.java").write_text(code, encoding="utf-8")

            for idx, testcase in enumerate(testcases):
                (tmp_dir / f"input_{idx}.txt").write_text(testcase["input"], encoding="utf-8")

            command, image = self._build_batch_command(language, total)
            start = perf_counter()
            result = self.runner.run_command(image=image, mount_dir=tmp_dir, command=command)
            runtime_ms = int((perf_counter() - start) * 1000)

            if result.timed_out:
                passed = self._count_passed_outputs(tmp_dir, testcases)
                return TestcaseRunResult(
                    status="Time Limit Exceeded",
                    passed=passed,
                    total=total,
                    max_runtime_ms=runtime_ms,
                )

            if result.return_code != 0:
                compiled = (tmp_dir / "main").exists() if language == "cpp" else (tmp_dir / "Main.class").exists()
                if not compiled:
                    return TestcaseRunResult(
                        status="Compilation Error",
                        passed=0,
                        total=total,
                        max_runtime_ms=runtime_ms,
                    )

                passed = self._count_passed_outputs(tmp_dir, testcases)
                _ = self._collect_runtime_stderr(tmp_dir, total)
                return TestcaseRunResult(
                    status="Runtime Error",
                    passed=passed,
                    total=total,
                    max_runtime_ms=runtime_ms,
                )

            passed = 0
            for idx, testcase in enumerate(testcases):
                output_file = tmp_dir / f"output_{idx}.txt"
                actual = self._normalize(output_file.read_text(encoding="utf-8") if output_file.exists() else "")
                expected = self._normalize(testcase["expected_output"])
                if actual == expected:
                    passed += 1

            final_status = "Accepted" if passed == total else "Wrong Answer"
            return TestcaseRunResult(
                status=final_status,
                passed=passed,
                total=total,
                max_runtime_ms=runtime_ms,
            )


testcase_runner = TestcaseRunner()
