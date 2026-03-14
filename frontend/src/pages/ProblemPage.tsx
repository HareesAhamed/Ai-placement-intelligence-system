import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { AuthRequiredCard } from '../components/auth/AuthRequiredCard';
import { CodeEditorPanel } from '../components/editor/CodeEditorPanel';
import { ProblemStatementPanel } from '../components/problems/ProblemStatementPanel';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/useAuth';
import { executeCode, fetchProblem, submitCode } from '../services/api';
import type { CodeLanguage, CodingProblem } from '../types/coding';

const CPP_STARTER = `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  ios::sync_with_stdio(false);\n  cin.tie(nullptr);\n\n  // your code here\n  return 0;\n}\n`;

const JAVA_STARTER = `import java.io.*;\nimport java.util.*;\n\npublic class Main {\n  public static void main(String[] args) throws Exception {\n    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n    // your code here\n  }\n}\n`;

export default function ProblemPage() {
  const { problemId } = useParams<{ problemId: string }>();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [problem, setProblem] = useState<CodingProblem | null>(null);
  const [language, setLanguage] = useState<CodeLanguage>('cpp');
  const [code, setCode] = useState(CPP_STARTER);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('');
  const [running, setRunning] = useState(false);

  useEffect(() => {
    void (async () => {
      if (!problemId) return;
      const fetched = await fetchProblem(Number(problemId));
      setProblem(fetched);
    })();
  }, [problemId]);

  useEffect(() => {
    setCode(language === 'cpp' ? CPP_STARTER : JAVA_STARTER);
  }, [language]);

  const onRun = useCallback(async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      setStatus('Authentication Required');
      setOutput('Please login or register to run code.');
      return;
    }

    setRunning(true);
    try {
      const result = await executeCode({ language, code, input });
      setStatus(result.status);
      setOutput([result.output, result.stderr].filter(Boolean).join('\n'));
    } catch (error) {
      setStatus('error');
      setOutput('Execution request failed. Please verify backend and auth token.');
      console.error(error);
    } finally {
      setRunning(false);
    }
  }, [isAuthenticated, openAuthModal, language, code, input]);

  const onSubmit = useCallback(async () => {
    if (!problem) return;
    if (!isAuthenticated) {
      openAuthModal('login');
      setStatus('Authentication Required');
      setOutput('Please login or register to submit solutions.');
      return;
    }

    setRunning(true);
    try {
      const result = await submitCode({
        problem_id: problem.id,
        language,
        code,
      });
      setStatus(result.status);
      setOutput(`Passed: ${result.passed}/${result.total}\nRuntime: ${result.runtime_ms ?? '-'}ms`);
    } catch (error) {
      setStatus('error');
      setOutput('Submission failed. Please verify backend and auth token.');
      console.error(error);
    } finally {
      setRunning(false);
    }
  }, [problem, isAuthenticated, openAuthModal, language, code]);

  const pageContent = useMemo(() => {
    if (!problem) {
      return <Card hover={false}>Loading problem...</Card>;
    }

    return (
      <div className="space-y-5">
        {!isAuthenticated ? (
          <AuthRequiredCard
            title="Authentication Required For Execution"
            message="Browse problems freely, then login or register to run code, submit solutions, and track analytics."
          />
        ) : null}
        <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <ProblemStatementPanel problem={problem} />
        <CodeEditorPanel
          language={language}
          code={code}
          input={input}
          output={output}
          status={status}
          running={running}
          onLanguageChange={setLanguage}
          onCodeChange={setCode}
          onInputChange={setInput}
          onRun={onRun}
          onSubmit={onSubmit}
        />
        </div>
      </div>
    );
  }, [problem, language, code, input, output, status, running, isAuthenticated, onRun, onSubmit]);

  return <div className="space-y-6">{pageContent}</div>;
}
