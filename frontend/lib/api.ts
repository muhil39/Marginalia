import type { PipelineStatus, UploadResponse } from "./types";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

export async function uploadPaper(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: formData,
  });
  return handle<UploadResponse>(res);
}

export async function startAnalysis(paperId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/analyze/${paperId}`, {
    method: "POST",
  });
  await handle(res);
}

export async function getStatus(paperId: string): Promise<PipelineStatus> {
  const res = await fetch(`${API_BASE}/api/status/${paperId}`, {
    cache: "no-store",
  });
  return handle<PipelineStatus>(res);
}

export function reportMarkdownUrl(paperId: string): string {
  return `${API_BASE}/api/report/${paperId}/markdown`;
}
