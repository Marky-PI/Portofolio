import React, { useEffect, useRef, useState } from 'react';
import { Download, FileText, Loader2, ZoomIn, ZoomOut, X } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface PdfViewerModalProps {
  open: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
  darkMode: boolean;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  open,
  onClose,
  pdfUrl,
  title,
  darkMode,
}) => {
  const [zoom, setZoom] = useState<number>(1.25);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const pagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);
    setErrorMsg(null);

    const renderPdf = async () => {
      try {
        const response = await fetch(pdfUrl);
        if (!response.ok) {
          throw new Error(`Gagal mengunduh berkas PDF (${response.status})`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const container = pagesContainerRef.current;
        if (!container) return;
        container.innerHTML = '';

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          if (cancelled) return;

          const viewport = page.getViewport({ scale: zoom * dpr });
          const displayViewport = page.getViewport({ scale: zoom });

          const pageWrapper = document.createElement('div');
          pageWrapper.className =
            'bg-white shadow-lg rounded-lg overflow-hidden mx-auto mb-6 last:mb-0 border border-zinc-200';
          pageWrapper.style.width = `${displayViewport.width}px`;
          pageWrapper.style.maxWidth = '100%';

          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = '100%';
          canvas.style.height = 'auto';
          canvas.style.display = 'block';

          pageWrapper.appendChild(canvas);
          container.appendChild(pageWrapper);

          const ctx = canvas.getContext('2d');
          if (ctx) {
            await page.render({
              canvasContext: ctx,
              viewport,
              canvas,
            }).promise;
          }
        }

        if (!cancelled) {
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(
            err instanceof Error ? err.message : 'Gagal memuat dokumen PDF.'
          );
          setLoading(false);
        }
      }
    };

    renderPdf();

    return () => {
      cancelled = true;
    };
  }, [open, pdfUrl, zoom]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl rounded-2xl border p-4 sm:p-6 flex flex-col h-[88vh] shadow-2xl ${
          darkMode
            ? 'bg-zinc-900 border-white/15 text-zinc-100'
            : 'bg-white border-zinc-900/15 text-zinc-900'
        }`}
      >
        {/* Top Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-current/10 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                darkMode
                  ? 'bg-zinc-800 border-white/10 text-zinc-100'
                  : 'bg-zinc-100 border-zinc-900/10 text-zinc-900'
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div
              className={`hidden sm:inline-flex items-center rounded-xl border px-1 py-0.5 ${
                darkMode
                  ? 'border-white/15 bg-zinc-800/60'
                  : 'border-zinc-900/15 bg-zinc-100/80'
              }`}
            >
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.75, +(z - 0.2).toFixed(2)))}
                aria-label="Perkecil PDF"
                className="p-1.5 rounded-lg hover:bg-current/10 cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs px-2 tabular-nums">
                {Math.round(zoom * 80)}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(2.0, +(z + 0.2).toFixed(2)))}
                aria-label="Perbesar PDF"
                className="p-1.5 rounded-lg hover:bg-current/10 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <a
              href={pdfUrl}
              download="CV_Mahesa_Rizky_Putra_Irdiansyah.pdf"
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                darkMode
                  ? 'bg-white text-zinc-950 hover:bg-zinc-200'
                  : 'bg-zinc-950 text-white hover:bg-zinc-800'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh PDF</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup Penampil CV"
              className="p-2 rounded-xl border border-current/15 hover:bg-current/5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable PDF Pages Viewport */}
        <div
          className={`mt-4 flex-1 min-h-0 overflow-y-auto rounded-xl border p-4 sm:p-6 ${
            darkMode
              ? 'bg-zinc-950/70 border-white/10'
              : 'bg-zinc-100 border-zinc-900/10'
          }`}
        >
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 opacity-75">
              <Loader2 className="w-6 h-6 animate-spin" />
              <p className="font-mono text-xs">Memuat dokumen PDF...</p>
            </div>
          )}

          {errorMsg && (
            <div className="text-center py-12 text-sm text-red-500">
              {errorMsg}
            </div>
          )}

          <div ref={pagesContainerRef} className="flex flex-col items-center" />
        </div>
      </div>
    </div>
  );
};
