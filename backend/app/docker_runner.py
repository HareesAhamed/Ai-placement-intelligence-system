import shlex
import subprocess
from dataclasses import dataclass
from pathlib import Path


@dataclass
class DockerRunResult:
    stdout: str
    stderr: str
    return_code: int
    timed_out: bool


class DockerRunner:
    def __init__(self, timeout_seconds: int, cpu_limit: float, memory_limit_mb: int) -> None:
        self.timeout_seconds = timeout_seconds
        self.cpu_limit = cpu_limit
        self.memory_limit_mb = memory_limit_mb

    def run_command(self, image: str, mount_dir: Path, command: str) -> DockerRunResult:
        docker_cmd = [
            "docker",
            "run",
            "--rm",
            "--network",
            "none",
            "--cpus",
            str(self.cpu_limit),
            "--memory",
            f"{self.memory_limit_mb}m",
            "--pids-limit",
            "128",
            "--security-opt",
            "no-new-privileges",
            "--read-only",
            "--tmpfs",
            "/tmp:rw,noexec,nosuid,size=64m",
            "-v",
            f"{mount_dir.resolve()}:/workspace:rw",
            "-w",
            "/workspace",
            image,
            "sh",
            "-lc",
            command,
        ]

        try:
            proc = subprocess.run(
                docker_cmd,
                capture_output=True,
                text=True,
                timeout=self.timeout_seconds,
                check=False,
            )
            return DockerRunResult(
                stdout=proc.stdout,
                stderr=proc.stderr,
                return_code=proc.returncode,
                timed_out=False,
            )
        except subprocess.TimeoutExpired as exc:
            return DockerRunResult(
                stdout=exc.stdout or "",
                stderr=(exc.stderr or "") + "\nExecution timed out",
                return_code=124,
                timed_out=True,
            )

    @staticmethod
    def shell_escape(text: str) -> str:
        return shlex.quote(text)
