import { useEffect, useState } from 'react';
import { SendHorizontal, Sparkles, BadgeCheck, FileText, Trash2 } from 'lucide-react';
import api from '../lib/api';

export default function WorkerAssistant() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'I can help you inspect maintenance procedures, safety requirements, and operational guidance from the indexed knowledge base.',
    },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await api.get("/chat/history");
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const askQuestion = async (event) => {
    event.preventDefault();
    if (!question.trim()) return;
    const userMessage = { role: 'user', content: question };
    setMessages((current) => [...current, userMessage]);
    setLoading(true);
    try {
      const response = await api.post('/chat', { question });
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: response.data.answer,
          confidence: response.data.confidence,
          sources: response.data.source_documents,
          pages: response.data.page_numbers,
        },
      ]);
    } catch (error) {
      setMessages((current) => [...current, { role: 'assistant', content: 'The assistant could not answer that request right now.' }]);
    } finally {
      setQuestion('');
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await api.delete("/chat/history");

      setMessages([
        {
          role: "assistant",
          content:
            "I can help you inspect maintenance procedures, safety requirements, and operational guidance from the indexed knowledge base.",
        },
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="relative font-['Inter']">

      {/* Blueprint grid background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#5B9BD5 1px, transparent 1px), linear-gradient(90deg, #5B9BD5 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

        {/* Chat panel */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">

          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">

            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-[#F2B705]/30 bg-[#F2B705]/10 p-2.5 text-[#F2B705]">
                <Sparkles size={18} />
              </div>

              <div>
                <p className="font-['JetBrains_Mono'] text-[10px] tracking-[0.2em] text-slate-500">
                  MOD / AI-01
                </p>
                <h2 className="font-['Oswald'] text-xl font-semibold uppercase tracking-wide text-white">
                  Plant Knowledge Assistant
                </h2>
              </div>
            </div>

            <button
              onClick={clearHistory}
              className="flex items-center gap-2 rounded-lg border border-rose-500/30 px-3 py-2 font-['JetBrains_Mono'] text-xs tracking-wide text-rose-400 transition-all duration-200 hover:border-rose-500/60 hover:bg-rose-500/10"
            >
              <Trash2 size={14} />
              CLEAR
            </button>

          </div>

          <div className="space-y-3 rounded-xl border border-white/10 bg-[#0B0E11] p-3 sm:p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-xl p-4 transition-colors duration-200 ${
                  message.role === 'assistant'
                    ? 'border border-white/5 bg-white/[0.03]'
                    : 'border border-[#5B9BD5]/25 bg-[#5B9BD5]/10'
                }`}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span
                    className={`font-['JetBrains_Mono'] text-[10px] tracking-widest ${
                      message.role === 'assistant' ? 'text-[#F2B705]' : 'text-[#5B9BD5]'
                    }`}
                  >
                    {message.role === 'assistant' ? 'ASSISTANT' : 'YOU'}
                  </span>
                </div>

                <p className="text-sm leading-7 text-slate-200">{message.content}</p>

                {message.confidence ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-['JetBrains_Mono'] text-xs text-emerald-300">
                      <BadgeCheck size={13} />
                      Confidence {message.confidence}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-3 py-1 font-['JetBrains_Mono'] text-xs text-slate-400">
                      <FileText size={13} />
                      Pages {message.pages?.join(', ') || 'n/a'}
                    </span>
                  </div>
                ) : null}

                {message.sources?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.sources.map((source) => (
                      <span
                        key={source}
                        className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-1 font-['JetBrains_Mono'] text-xs text-slate-300"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            {loading ? (
              <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] p-4 text-sm text-slate-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#F2B705]" />
                Reasoning over the indexed documents...
              </div>
            ) : null}
          </div>

          <form onSubmit={askQuestion} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about maintenance, safety, or equipment procedures"
              className="flex-1 rounded-lg border border-white/10 bg-[#0B0E11] px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-[#F2B705]/60 focus:shadow-[0_0_0_3px_rgba(242,183,5,0.12)]"
            />
            <button
              disabled={loading}
              className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#F2B705] px-5 py-3 font-['JetBrains_Mono'] text-sm font-semibold tracking-wide text-[#0B0E11] transition-all duration-300 hover:shadow-[0_0_20px_-4px_#F2B705] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="relative z-10 flex items-center gap-2">
                <SendHorizontal size={16} />
                Ask
              </span>
              <span className="absolute inset-0 -translate-x-full bg-white/30 transition-transform duration-500 group-hover:translate-x-0" />
            </button>
          </form>
        </div>

        {/* Capabilities panel */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="font-['JetBrains_Mono'] text-[10px] tracking-[0.2em] text-slate-500">
            SPEC SHEET
          </p>
          <h3 className="mt-1 font-['Oswald'] text-lg font-semibold uppercase tracking-wide text-white">
            What the assistant can do
          </h3>

          <ul className="mt-4 space-y-3">
            {[
              'Answer questions with citations and page references.',
              'Display confidence scores and related document sources.',
              'Support owner-driven document upload and re-index workflows.',
            ].map((item, i) => (
              <li
                key={i}
                className="group flex items-start gap-3 rounded-lg border border-white/10 bg-[#0B0E11] p-3 text-sm text-slate-400 transition-all duration-200 hover:border-[#F2B705]/40 hover:text-slate-300"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B9BD5] transition-colors duration-200 group-hover:bg-[#F2B705]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}