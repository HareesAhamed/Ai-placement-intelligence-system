from dataclasses import dataclass
from pathlib import Path
from tempfile import TemporaryDirectory
from time import perf_counter

from app.config import get_settings
from app.docker_runner import DockerRunner


@dataclass
class ExecuteResult:
    output: str
    stderr: str
    status: str
    runtime_ms: int


class CodeExecutor:
    def __init__(self) -> None:
        settings = get_settings()
        self.settings = settings
        self.runner = DockerRunner(
            timeout_seconds=settings.execution_timeout_seconds,
            cpu_limit=settings.execution_cpu_limit,
            memory_limit_mb=settings.execution_memory_limit_mb,
        )

    def execute(self, language: str, code: str, input_data: str = "") -> ExecuteResult:
        if language not in {"cpp", "java"}:
            return ExecuteResult(output="", stderr="Unsupported language", status="error", runtime_ms=0)

        with TemporaryDirectory(prefix="prepiq-exec-") as tmp_dir_name:
            tmp_dir = Path(tmp_dir_name)
            (tmp_dir / "stdin.txt").write_text(input_data, encoding="utf-8")

            if language == "cpp":
                (tmp_dir / "main.cpp").write_text(code, encoding="utf-8")
                command = "g++ -O2 -std=c++17 main.cpp -o main && ./main < stdin.txt"
                image = self.settings.docker_image_cpp
            else:
                (tmp_dir / "Main.java").write_text(code, encoding="utf-8")
                command = "javac Main.java && java Main < stdin.txt"
                image = self.settings.docker_image_java

            start = perf_counter()
            result = self.runner.run_command(image=image, mount_dir=tmp_dir, command=command)
            runtime_ms = int((perf_counter() - start) * 1000)

            if result.timed_out:
                return ExecuteResult(
                    output=result.stdout,
                    stderr=result.stderr,
                    status="Time Limit Exceeded",
                    runtime_ms=runtime_ms,
                )

            if result.return_code != 0:
                status = "Compilation Error" if "error:" in result.stderr.lower() else "Runtime Error"
                return ExecuteResult(
                    output=result.stdout,
                    stderr=result.stderr,
                    status=status,
                    runtime_ms=runtime_ms,
                )

            return ExecuteResult(output=result.stdout, stderr=result.stderr, status="success", runtime_ms=runtime_ms)


code_executor = CodeExecutor()
