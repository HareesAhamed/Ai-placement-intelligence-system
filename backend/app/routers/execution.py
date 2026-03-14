from fastapi import APIRouter, Depends

from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.execution import ExecuteRequest, ExecuteResponse
from app.services.code_executor import code_executor

router = APIRouter()


@router.post("/execute", response_model=ExecuteResponse)
def execute_code(payload: ExecuteRequest, _: User = Depends(get_current_user)) -> ExecuteResponse:
    result = code_executor.execute(payload.language, payload.code, payload.input)
    return ExecuteResponse(
        output=result.output,
        stderr=result.stderr,
        runtime=f"{result.runtime_ms}ms",
        status=result.status,
    )
