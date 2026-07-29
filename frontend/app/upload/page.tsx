import { Uploader } from "@/components/uploader";

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <p className="mb-3 text-center font-mono text-xs uppercase tracking-[0.25em] text-rust dark:text-rust-light">
        Step 1 of 2
      </p>
      <h1 className="text-center font-display text-4xl text-ink dark:text-parchment">
        Upload your manuscript
      </h1>
      <p className="mx-auto mt-4 max-w-md text-center font-body text-sm leading-relaxed text-ink/60 dark:text-parchment/60">
        The Planning Agent will start orchestrating the full review the moment
        your file finishes uploading. You'll land on a live dashboard next.
      </p>

      <div className="mt-12">
        <Uploader />
      </div>
    </div>
  );
}
