import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Flex, FlexColumn, FlexRow } from "@Components/common/Layouts";
import { getNotes } from "@Services/exam";
import PdfViewer from "./PdfViewer";

interface NoteItem {
  id: number;
  title: string;
  file: string; // URL to PDF
  uploaded_at: string;
}

export default function Notes() {
  const [activeNote, setActiveNote] = React.useState<NoteItem | null>(null);
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);
  const [isPdfLoading, setIsPdfLoading] = React.useState<boolean>(false);
  const [pdfError, setPdfError] = React.useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await getNotes();
      return response.data as NoteItem[];
    },
  });

  React.useEffect(() => {
    if (data && data.length > 0 && !activeNote) {
      setActiveNote(data[0]);
    }
  }, [data]);

  // Fetch the selected PDF as a blob and create a same-origin URL
  React.useEffect(() => {
    let isCancelled = false;
    const prevUrl = pdfUrl;
    if (!activeNote) {
      setPdfUrl(null);
      return () => {};
    }

    setIsPdfLoading(true);
    setPdfError(null);

    fetch(activeNote.file, {
      // Rely on CORS headers from the server
      headers: { Accept: "application/pdf" },
      credentials: "omit",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load PDF (${res.status})`);
        const blob = await res.blob();
        if (isCancelled) return;
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      })
      .catch((e: any) => {
        if (isCancelled) return;
        setPdfError(e?.message || "Unable to load PDF");
      })
      .finally(() => {
        if (!isCancelled) setIsPdfLoading(false);
      });

    return () => {
      isCancelled = true;
      if (prevUrl) URL.revokeObjectURL(prevUrl);
    };
  }, [activeNote]);

  if (isLoading) {
    return (
      <main className="notes naxatw-h-screen-nav naxatw-w-full">
        <Flex className="naxatw-h-full naxatw-justify-center naxatw-items-center">
          <span>Loading notes...</span>
        </Flex>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="notes naxatw-h-screen-nav naxatw-w-full">
        <Flex className="naxatw-h-full naxatw-justify-center naxatw-items-center">
          <span>Error: {(error as Error).message}</span>
        </Flex>
      </main>
    );
  }

  return (
    <main className="notes naxatw-h-screen-nav naxatw-w-full naxatw-bg-white">
      <div className="naxatw-container naxatw-h-full naxatw-py-4">
        <FlexRow className="naxatw-gap-4 naxatw-h-full naxatw-flex-col lg:naxatw-flex-row">
          <FlexColumn className="naxatw-w-full lg:naxatw-w-1/3 naxatw-gap-2 naxatw-max-h-[calc(100vh-140px)] naxatw-max-h-[35vh] lg:naxatw-max-h-[calc(100vh-140px)] naxatw-overflow-auto naxatw-border lg:naxatw-border-0 naxatw-rounded-md lg:naxatw-rounded-none naxatw-p-3 lg:naxatw-p-0">
            <div className="naxatw-font-semibold naxatw-text-lg naxatw-block lg:naxatw-hidden naxatw-mb-3 naxatw-text-center">Notes List</div>
            {data && data.length > 0 ? data.map((note: NoteItem) => (
              <button
                key={note.id}
                onClick={() => setActiveNote(note)}
                className={`naxatw-text-left naxatw-w-full naxatw-border naxatw-rounded-md naxatw-p-3 hover:naxatw-bg-gray-50 naxatw-text-sm lg:naxatw-text-base ${
                  activeNote?.id === note.id ? "naxatw-border-blue-500 naxatw-bg-blue-50" : "naxatw-border-gray-200"
                }`}
              >
                <div className="naxatw-font-semibold naxatw-truncate">{note.title}</div>
                <div className="naxatw-text-xs naxatw-text-gray-500">
                  Uploaded: {new Date(note.uploaded_at).toLocaleString()}
                </div>
              </button>
            )) : (
              <div className="naxatw-text-center naxatw-text-gray-500 naxatw-py-8">
                <div className="naxatw-text-lg naxatw-font-semibold naxatw-mb-2">No Notes Available</div>
                <div className="naxatw-text-sm">There are currently no notes to display.</div>
              </div>
            )}
          </FlexColumn>

          <FlexColumn className="naxatw-flex-1 naxatw-min-h-[60vh] lg:naxatw-min-h-[60vh] naxatw-border naxatw-rounded-md naxatw-overflow-hidden">
            {!activeNote ? (
              <Flex className="naxatw-h-full naxatw-justify-center naxatw-items-center">
                <span>Select a note to preview</span>
              </Flex>
            ) : isPdfLoading ? (
              <Flex className="naxatw-h-full naxatw-justify-center naxatw-items-center">
                <span>Loading PDF…</span>
              </Flex>
            ) : pdfError ? (
              <Flex className="naxatw-h-full naxatw-justify-center naxatw-items-center naxatw-text-red-600">
                <span>{pdfError}</span>
              </Flex>
            ) : pdfUrl ? (
              <PdfViewer url={pdfUrl} />
            ) : null}
          </FlexColumn>
        </FlexRow>
      </div>
    </main>
  );
}
