"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Loader2, FileText, AlertCircle } from "lucide-react";
import { startAnalysis, uploadPaper } from "@/lib/api";

const ALLOWED = [".pdf", ".docx", ".txt"];
const MAX_MB = 20;

export function Uploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);

  const validate = (file: File): string | null => {
    const ok = ALLOWED.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!ok) return `Unsupported file type. Allowed: ${ALLOWED.join(", ")}`;
    if (file.size > MAX_MB * 1024 * 1024) return `File exceeds ${MAX_MB}MB limit.`;
    return null;
  };

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      const validationError = validate(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setBusy(true);
      setFilename(file.name);
      setProgress(15);

      try {
        setProgress(45);
        const upload = await uploadPaper(file);
        setProgress(80);
        await startAnalysis(upload.paper_id);
        setProgress(100);
        router.push(`/dashboard/${upload.paper_id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
        setBusy(false);
        setProgress(0);
      }
    },
    [router]
  );

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !busy && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !busy) inputRef.current?.click();
        }}
        className={`paper-card flex cursor-pointer flex-col items-center justify-center gap-4 border-2 border-dashed px-8 py-16 text-center transition-colors ${
          dragging
            ? "border-rust bg-rust/5 dark:border-rust-light"
            : "border-ink/20 dark:border-parchment/20"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED.join(",")}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        {busy ? (
          <>
            <Loader2 className="animate-spin text-navy dark:text-navy-light" size={28} />
            <div>
              <p className="font-body text-sm text-ink/80 dark:text-parchment/80">
                Uploading <span className="font-medium">{filename}</span>…
              </p>
              <div className="mt-3 h-1.5 w-56 overflow-hidden rounded-full bg-ink/10 dark:bg-parchment/10">
                <div
                  className="h-full rounded-full bg-rust transition-all duration-300 dark:bg-rust-light"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <FileUp className="text-navy dark:text-navy-light" size={28} strokeWidth={1.5} />
            <div>
              <p className="font-display text-lg text-ink dark:text-parchment">
                Drop your manuscript here
              </p>
              <p className="mt-1 font-body text-sm text-ink/55 dark:text-parchment/55">
                or click to browse — PDF, DOCX, or TXT, up to {MAX_MB}MB
              </p>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-sm border border-rust/30 bg-rust/5 px-4 py-3 text-sm text-rust dark:border-rust-light/30 dark:bg-rust-light/10 dark:text-rust-light">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-6 font-mono text-xs text-ink/40 dark:text-parchment/40">
        {ALLOWED.map((ext) => (
          <span key={ext} className="flex items-center gap-1.5">
            <FileText size={13} /> {ext}
          </span>
        ))}
      </div>
    </div>
  );
}
