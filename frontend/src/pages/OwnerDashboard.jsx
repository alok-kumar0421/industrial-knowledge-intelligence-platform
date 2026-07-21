import { useEffect, useState } from 'react';
import { FileText, Layers3, HardHat, UploadCloud, MessageSquareText, Trash2, X } from 'lucide-react';
import api from '../lib/api';

export default function OwnerDashboard() {
  const [summary, setSummary] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const loadData = async () => {
    const [
      dashboardResponse,
      documentsResponse,
    ] = await Promise.all([
      api.get("/dashboard"),
      api.get("/documents"),
    ]);

    setSummary(dashboardResponse.data);
    setDocuments(documentsResponse.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Document processed successfully.');
      setFile(null);
      await loadData();
    } catch (error) {
      setMessage('Document upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    try {
      await api.delete(`/documents/${documentId}`);
      await loadData();
      setMessage('Document removed successfully.');
    } catch (error) {
      setMessage('Unable to remove the document.');
    }
  };

  return (
    <div className="relative space-y-6 font-['Inter']">

      {/* Blueprint grid background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#5B9BD5 1px, transparent 1px), linear-gradient(90deg, #5B9BD5 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Header + upload */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-2 font-['JetBrains_Mono'] text-[11px] tracking-[0.25em] text-[#F2B705]">
              <HardHat size={14} />
              OWNER WORKSPACE
            </p>
            <h2 className="mt-2 font-['Oswald'] text-3xl font-semibold uppercase tracking-wide text-white">
              Industrial Knowledge Command Center
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              Inspect uploaded manuals, track document intelligence, and keep daily operations aligned with the latest SOPs.
            </p>
          </div>

          <form onSubmit={handleUpload} className="flex flex-col gap-3 sm:flex-row">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-white/20 bg-[#0B0E11] px-4 py-3 text-sm text-slate-300 transition-colors duration-200 hover:border-[#F2B705]/50">
              <UploadCloud size={16} className="text-[#5B9BD5]" />
              <span>{file ? file.name : 'Choose PDF'}</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
              />
            </label>
            <button
              disabled={loading}
              className="group relative overflow-hidden rounded-lg bg-[#F2B705] px-5 py-3 font-['JetBrains_Mono'] text-sm font-semibold tracking-wide text-[#0B0E11] transition-all duration-300 hover:shadow-[0_0_20px_-4px_#F2B705] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="relative z-10">{loading ? 'Processing...' : 'Upload PDF'}</span>
              <span className="absolute inset-0 -translate-x-full bg-white/30 transition-transform duration-500 group-hover:translate-x-0" />
            </button>
          </form>
        </div>

        {message ? (
          <p className="mt-4 inline-flex items-center gap-2 rounded-md border border-[#F2B705]/30 bg-[#F2B705]/10 px-3 py-1.5 font-['JetBrains_Mono'] text-xs text-[#F2B705]">
            {message}
          </p>
        ) : null}
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={FileText} label="Total PDFs" value={summary?.total_pdfs ?? 0} accent="#F2B705" />
        <StatCard icon={Layers3} label="Total Chunks" value={summary?.total_chunks ?? 0} accent="#5B9BD5" />
        <StatCard icon={HardHat} label="Equipment" value={summary?.total_equipment ?? 0} accent="#F2B705" />
      </div>

      <div className="space-y-6">

        {/* Latest uploads */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-['Oswald'] text-lg font-semibold uppercase tracking-wide text-white">
              Latest Uploads
            </h3>
            <span className="font-['JetBrains_Mono'] text-xs tracking-wide text-slate-500">
              INDEXED DOCUMENTS
            </span>
          </div>

          <div className="space-y-3">
            {documents.map((document) => (
              <div
                key={document.id}
                className="rounded-xl border border-white/10 bg-[#0B0E11] p-4 transition-colors duration-200 hover:border-white/20"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{document.file_name}</p>
                    <p className="mt-1 font-['JetBrains_Mono'] text-xs text-slate-500">
                      Uploaded {document.uploaded_at}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="rounded-full border border-[#5B9BD5]/30 bg-[#5B9BD5]/10 px-3 py-1 font-['JetBrains_Mono'] text-xs text-[#5B9BD5]">
                      {document.chunk_count} chunks
                    </div>
                    <button
                      onClick={() => handleDelete(document.id)}
                      className="rounded-full border border-white/10 p-2 text-slate-500 transition-colors duration-200 hover:border-rose-500/40 hover:text-rose-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-400">{document.summary}</p>

                {/* Equipment */}
                {document.equipment?.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 font-['JetBrains_Mono'] text-[10px] tracking-widest text-slate-500">
                      EQUIPMENT FOUND
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {document.equipment.map((item) => (
                        <span
                          key={item}
                          onClick={() => {
                            setSelectedEquipment(item);
                            setSelectedDocument(document);
                          }}
                          className="cursor-pointer rounded-full border border-[#F2B705]/30 bg-[#F2B705]/10 px-3 py-1 text-xs text-[#F2B705] transition-all duration-200 hover:border-[#F2B705]/60 hover:bg-[#F2B705]/20"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keywords */}
                {document.keywords?.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 font-['JetBrains_Mono'] text-[10px] tracking-widest text-slate-500">
                      SAFETY KEYWORDS
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {document.keywords.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent worker questions */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-['Oswald'] text-lg font-semibold uppercase tracking-wide text-white">
              Recent Worker Questions
            </h3>
            <MessageSquareText size={18} className="text-[#5B9BD5]" />
          </div>

          <div className="space-y-3">
            {(summary?.recent_worker_questions || []).length === 0 ? (
              <p className="rounded-lg border border-white/5 bg-[#0B0E11] p-4 text-sm text-slate-500">
                No worker questions yet.
              </p>
            ) : (
              summary.recent_worker_questions.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-[#0B0E11] p-4 transition-colors duration-200 hover:border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-['JetBrains_Mono'] text-sm font-semibold text-[#5B9BD5]">
                        {item.worker}
                      </p>
                      <p className="font-['JetBrains_Mono'] text-xs text-slate-500">
                        @{item.username}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-white">{item.question}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Equipment detail modal */}
      {selectedEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-[500px] overflow-hidden rounded-2xl border border-white/10 bg-[#0B0E11] p-6 shadow-2xl">

            {/* corner brackets */}
            <span className="absolute left-3 top-3 h-4 w-4 border-l border-t border-[#F2B705]/40" />
            <span className="absolute right-3 top-3 h-4 w-4 border-r border-t border-[#F2B705]/40" />
            <span className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-[#F2B705]/40" />
            <span className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-[#F2B705]/40" />

            <div className="flex items-start justify-between">
              <div>
                <p className="font-['JetBrains_Mono'] text-[10px] tracking-[0.2em] text-[#F2B705]">
                  EQUIPMENT
                </p>
                <h2 className="mt-1 font-['Oswald'] text-2xl font-semibold uppercase tracking-wide text-white">
                  {selectedEquipment}
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedEquipment(null);
                  setSelectedDocument(null);
                }}
                className="rounded-md border border-white/10 p-1.5 text-slate-500 transition-colors duration-200 hover:border-white/30 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="font-['JetBrains_Mono'] text-[10px] tracking-widest text-slate-500">
                  SOURCE DOCUMENT
                </p>
                <p className="mt-1 text-white">{selectedDocument?.file_name}</p>
              </div>

              <div>
                <p className="font-['JetBrains_Mono'] text-[10px] tracking-widest text-slate-500">
                  DOCUMENT SUMMARY
                </p>
                <p className="mt-1 text-sm text-slate-300">{selectedDocument?.summary}</p>
              </div>

              <div>
                <p className="font-['JetBrains_Mono'] text-[10px] tracking-widest text-slate-500">
                  RELATED SAFETY KEYWORDS
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedDocument?.keywords?.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-300"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedEquipment(null);
                setSelectedDocument(null);
              }}
              className="group relative mt-6 w-full overflow-hidden rounded-lg bg-[#F2B705] py-3 font-['JetBrains_Mono'] font-semibold tracking-wide text-[#0B0E11] transition-all duration-300 hover:shadow-[0_0_20px_-4px_#F2B705]"
            >
              <span className="relative z-10">Close</span>
              <span className="absolute inset-0 -translate-x-full bg-white/30 transition-transform duration-500 group-hover:translate-x-0" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent = '#F2B705' }) {
  return (
    <div
      className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-1"
      style={{ '--accent': accent }}
    >
      <div className="flex items-center gap-3">
        <div
          className="rounded-lg border p-3 transition-transform duration-300 group-hover:scale-105"
          style={{
            borderColor: `${accent}4D`,
            backgroundColor: `${accent}1A`,
            color: accent,
          }}
        >
          <Icon size={18} />
        </div>
        <div>
          <p className="font-['JetBrains_Mono'] text-xs tracking-wide text-slate-500">{label}</p>
          <p className="mt-0.5 font-['Oswald'] text-2xl font-semibold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}