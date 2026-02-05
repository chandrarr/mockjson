'use client';

import { useState } from 'react';
import { parseEDI } from '@/lib/edi-parser';
import { SAMPLES } from '@/lib/samples';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput({ error: 'Please enter an EDI document' });
      return;
    }
    try {
      const result = parseEDI(input);
      setOutput(result);
    } catch (error) {
      setOutput({ error: 'Failed to parse EDI document' });
    }
  };

  const loadSample = (content: string) => {
    setInput(content);
    setOutput(null);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(JSON.stringify(output, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="border-b pb-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            EDI <span className="text-blue-600">to</span> JSON
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            A simple tool to parse Electronic Data Interchange documents into a readable JSON format.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Input EDI</h2>
              <div className="flex gap-2">
                {SAMPLES.map((sample) => (
                  <button
                    key={sample.name}
                    onClick={() => loadSample(sample.content)}
                    className="px-2 py-1 text-xs font-medium bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    {sample.name.split(' ')[0]}...
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your X12, EDIFACT, or generic EDI document here..."
                className="w-full h-[500px] p-4 font-mono text-sm border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            <button
              onClick={handleConvert}
              className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 active:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Convert to JSON
            </button>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Output JSON</h2>
              {output && !output.error && (
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>
              )}
            </div>

            <div className="h-[500px] p-4 overflow-auto bg-slate-900 rounded-lg shadow-inner border border-slate-800">
              {output ? (
                <pre className={`text-sm ${output.error ? 'text-red-400' : 'text-blue-300'}`}>
                  {JSON.stringify(output, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 italic">
                  Converted JSON will appear here
                </div>
              )}
            </div>
          </section>
        </div>

        <footer className="pt-8 border-t text-slate-500 text-sm text-center">
          <p>Supports X12 (ISA/IEA), EDIFACT (UNA/UNB), and generic character-separated formats.</p>
        </footer>
      </div>
    </main>
  );
}
