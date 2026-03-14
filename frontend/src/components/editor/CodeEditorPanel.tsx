import { Play, SendHorizontal } from 'lucide-react';
import Editor from '@monaco-editor/react';

import { Card } from '../ui/Card';
import type { CodeLanguage } from '../../types/coding';

interface CodeEditorPanelProps {
  language: CodeLanguage;
  code: string;
  input: string;
  output: string;
  status: string;
  running: boolean;
  onLanguageChange: (language: CodeLanguage) => void;
  onCodeChange: (value: string) => void;
  onInputChange: (value: string) => void;
  onRun: () => void;
  onSubmit: () => void;
}

export function CodeEditorPanel({
  language,
  code,
  input,
  output,
  status,
  running,
  onLanguageChange,
  onCodeChange,
  onInputChange,
  onRun,
  onSubmit,
}: CodeEditorPanelProps) {
  return (
    <Card className="p-0 overflow-hidden" glow="blue" hover={false}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1F2937]/70 bg-[#0F172A]/80">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-[#E5E7EB]">Coding Workspace</h3>
          <select
            className="rounded-lg border border-[#1F2937] bg-[#111827] px-2.5 py-1.5 text-xs text-[#E5E7EB]"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as CodeLanguage)}
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRun}
            disabled={running}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#1F2937] bg-[#1E293B] px-3 py-1.5 text-xs font-medium text-[#E5E7EB] hover:bg-[#263248] disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" />
            Run Code
          </button>
          <button
            onClick={onSubmit}
            disabled={running}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#3B82F6] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2563EB] disabled:opacity-50"
          >
            <SendHorizontal className="h-3.5 w-3.5" />
            Submit
          </button>
        </div>
      </div>

      <Editor
        height="500px"
        language={language === 'cpp' ? 'cpp' : 'java'}
        theme="vs-dark"
        value={code}
        onChange={(value: string | undefined) => onCodeChange(value ?? '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          automaticLayout: true,
          tabSize: 2,
          formatOnType: true,
          formatOnPaste: true,
        }}
      />

      <div className="grid gap-4 border-t border-[#1F2937]/70 bg-[#0F172A]/80 p-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">Input</p>
          <textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            className="h-24 w-full rounded-lg border border-[#1F2937] bg-[#111827] p-2 text-xs text-[#E5E7EB]"
            placeholder="Optional stdin"
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">
            Output Console <span className="text-[#60A5FA]">{status ? `- ${status}` : ''}</span>
          </p>
          <pre className="h-24 overflow-auto rounded-lg border border-[#1F2937] bg-[#111827] p-2 text-xs text-[#D1D5DB]">
            {output || 'Run code to see output.'}
          </pre>
        </div>
      </div>
    </Card>
  );
}
