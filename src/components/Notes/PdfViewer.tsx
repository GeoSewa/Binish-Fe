import React from 'react';
import geosewaLogo from '@Assets/images/Geosewa_logo.png';

interface PdfViewerProps {
  url: string; // blob URL
}

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const PDFJS_CDN =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const PDFJS_WORKER_CDN =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

export default function PdfViewer({ url }: PdfViewerProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [windowWidth, setWindowWidth] = React.useState<number>(window.innerWidth);

  // Handle window resize for responsive PDF rendering
  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load pdf.js from CDN once
  React.useEffect(() => {
    let isCancelled = false;

    function ensurePdfJs(): Promise<void> {
      return new Promise(resolve => {
        if (window.pdfjsLib) return resolve();

        const script = document.createElement('script');
        script.src = PDFJS_CDN;
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    }

    async function render() {
      try {
        setLoading(true);
        setError(null);
        await ensurePdfJs();

        if (isCancelled) return;

        // Configure worker
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN;
        }

        const pdfjsLib = window.pdfjsLib;
        const pdf = await pdfjsLib.getDocument({ url }).promise;
        if (!containerRef.current) return;

        // Clear existing pages
        containerRef.current.innerHTML = '';

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
          const page = await pdf.getPage(pageNum);
          // Responsive scale: smaller on mobile, larger on desktop
          const scale = windowWidth < 768 ? 1.0 : 1.3;
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = '100%';
          canvas.style.height = 'auto';
          canvas.style.display = 'block';
          canvas.style.background = 'transparent';

          if (containerRef.current) {
            const wrapper = document.createElement('div');
            wrapper.style.margin = '0 auto 16px auto';
            wrapper.style.position = 'relative';
            // Responsive max width: smaller on mobile, larger on desktop
            wrapper.style.maxWidth = windowWidth < 768 ? '100%' : '900px';
            wrapper.appendChild(canvas);
            
            // Add watermark overlay to each page
            const watermarkOverlay = document.createElement('div');
            watermarkOverlay.style.position = 'absolute';
            watermarkOverlay.style.top = '50%';
            watermarkOverlay.style.left = '50%';
            watermarkOverlay.style.transform = 'translate(-50%, -50%)';
            watermarkOverlay.style.width = '200px';
            watermarkOverlay.style.height = '200px';
            watermarkOverlay.style.opacity = '0.3';
            watermarkOverlay.style.pointerEvents = 'none';
            watermarkOverlay.style.zIndex = '10';
            watermarkOverlay.style.display = 'flex';
            watermarkOverlay.style.alignItems = 'center';
            watermarkOverlay.style.justifyContent = 'center';
            
            // Create img element for watermark
            const watermarkImg = document.createElement('img');
            // Use bundled asset URL so it works in production builds
            watermarkImg.src = geosewaLogo;
            watermarkImg.style.width = '100%';
            watermarkImg.style.height = '100%';
            watermarkImg.style.objectFit = 'contain';
            // No alternative path fallback needed when using imported asset
            watermarkOverlay.appendChild(watermarkImg);
            
            wrapper.appendChild(watermarkOverlay);
            containerRef.current.appendChild(wrapper);
          }

          await page.render({ canvasContext: context, viewport }).promise;
        }
      } catch (e: any) {
        if (!isCancelled) {
          setError(e?.message || 'Failed to render PDF');
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    render();
    return () => {
      isCancelled = true;
    };
  }, [url, windowWidth]);

  // Basic deterrents: block context menu and common shortcuts
  React.useEffect(() => {
    function preventContext(e: MouseEvent) {
      e.preventDefault();
    }
    function preventKeys(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      const meta = e.ctrlKey || e.metaKey;
      if (
        (meta && (key === 's' || key === 'p' || key === 'c' || key === 'u')) ||
        (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j'))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
    const node = containerRef.current;
    node?.addEventListener('contextmenu', preventContext);
    window.addEventListener('keydown', preventKeys, { capture: true });

    // Hide all content in print media
    const style = document.createElement('style');
    style.setAttribute('data-pdf-print-block', '');
    style.innerHTML = '@media print { body { display: none !important; } }';
    document.head.appendChild(style);

    return () => {
      node?.removeEventListener('contextmenu', preventContext);
      window.removeEventListener('keydown', preventKeys, { capture: true } as any);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="naxatw-w-full naxatw-h-full naxatw-overflow-auto naxatw-bg-gray-100 pdf-watermark">
      {loading && (
        <div className="naxatw-p-4 naxatw-text-center">Loading PDF…</div>
      )}
      {error && (
        <div className="naxatw-p-4 naxatw-text-center naxatw-text-red-600">{error}</div>
      )}
      <div ref={containerRef} className="naxatw-select-none" />
    </div>
  );
}


