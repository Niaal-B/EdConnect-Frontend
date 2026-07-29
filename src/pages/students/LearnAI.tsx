import { FormEvent, useEffect, useMemo, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  AlertCircle,
  Clock,
  FileText,
  Loader2,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { learnAIApi, LearnAISummary } from "@/lib/api";

const fallbackError =
  "Something went wrong while generating notes. Please try again.";

const formatGeneratedDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const getErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return fallbackError;
  }

  const detail = error.response?.data?.detail;
  if (typeof detail === "string") {
    return detail;
  }

  const youtubeUrlError = error.response?.data?.youtube_url;
  if (Array.isArray(youtubeUrlError) && youtubeUrlError.length > 0) {
    return youtubeUrlError[0];
  }

  return fallbackError;
};

export default function LearnAI() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [summaries, setSummaries] = useState<LearnAISummary[]>([]);
  const [selectedSummary, setSelectedSummary] = useState<LearnAISummary | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await learnAIApi.getHistory();
        setSummaries(response.data);
        setSelectedSummary(response.data[0] ?? null);
      } catch (historyError) {
        setError(getErrorMessage(historyError));
      } finally {
        setIsHistoryLoading(false);
      }
    };

    loadHistory();
  }, []);

  const generatedLabel = useMemo(() => {
    if (!selectedSummary) {
      return "";
    }

    return formatGeneratedDate(selectedSummary.created_at);
  }, [selectedSummary]);

  const handleGenerate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedUrl = youtubeUrl.trim();

    if (!trimmedUrl) {
      setError("Paste a YouTube lecture URL to generate notes.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await learnAIApi.generateNotes(trimmedUrl);
      const generatedSummary = response.data;

      setSummaries((current) => [
        generatedSummary,
        ...current.filter((summary) => summary.id !== generatedSummary.id),
      ]);
      setSelectedSummary(generatedSummary);
      setYoutubeUrl("");
    } catch (generateError) {
      setError(getErrorMessage(generateError));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (summaryId: number) => {
    try {
      await learnAIApi.deleteSummary(summaryId);

      setSummaries((current) => {
        const nextSummaries = current.filter((summary) => summary.id !== summaryId);

        if (selectedSummary?.id === summaryId) {
          setSelectedSummary(nextSummaries[0] ?? null);
        }

        return nextSummaries;
      });
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="flex flex-col gap-4 border-b border-gray-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            <Sparkles className="h-4 w-4" />
            LearnAI
          </div>
          <h1 className="text-3xl font-semibold tracking-normal text-gray-950">
            Turn YouTube lectures into study notes.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            Paste a public lecture URL and LearnAI will extract the transcript,
            generate structured Markdown notes, and save them to your study history.
          </p>
        </div>
      </section>

      <form
        onSubmit={handleGenerate}
        className="grid gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto]"
      >
        <Input
          value={youtubeUrl}
          onChange={(event) => setYoutubeUrl(event.target.value)}
          placeholder="https://youtu.be/xxxxxxxx"
          aria-label="YouTube lecture URL"
          disabled={isGenerating}
          className="h-11"
        />
        <Button type="submit" disabled={isGenerating} className="h-11 px-5">
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating notes...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Notes
            </>
          )}
        </Button>
      </form>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="rounded-lg border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            {selectedSummary ? (
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-950">
                    {selectedSummary.video_title}
                  </CardTitle>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    Generated {generatedLabel}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(selectedSummary.id)}
                  className="w-fit text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            ) : (
              <CardTitle className="text-xl text-gray-950">
                Markdown Notes
              </CardTitle>
            )}
          </CardHeader>
          <CardContent className="p-6">
            {isGenerating ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 text-center text-gray-600">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="font-medium">Generating notes...</p>
              </div>
            ) : selectedSummary ? (
              <article className="prose prose-slate max-w-none prose-headings:scroll-m-20 prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-p:leading-7 prose-li:my-1">
                <ReactMarkdown>{selectedSummary.summary}</ReactMarkdown>
              </article>
            ) : (
              <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 text-center text-gray-500">
                <FileText className="h-10 w-10 text-gray-300" />
                <p className="max-w-sm text-sm">
                  Your generated study notes will appear here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <aside className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-normal text-gray-500">
            Saved Notes
          </h2>

          {isHistoryLoading ? (
            <Card className="rounded-lg border-gray-200 shadow-sm">
              <CardContent className="flex items-center gap-3 p-4 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading saved notes...
              </CardContent>
            </Card>
          ) : summaries.length > 0 ? (
            <div className="space-y-2">
              {summaries.map((summary) => {
                const isSelected = selectedSummary?.id === summary.id;

                return (
                  <button
                    key={summary.id}
                    type="button"
                    onClick={() => setSelectedSummary(summary)}
                    className={`w-full rounded-lg border p-4 text-left transition ${
                      isSelected
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="line-clamp-2 text-sm font-medium text-gray-950">
                      {summary.video_title}
                    </span>
                    <span className="mt-2 block text-xs text-gray-500">
                      {formatGeneratedDate(summary.created_at)}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <Card className="rounded-lg border-gray-200 shadow-sm">
              <CardContent className="p-4 text-sm text-gray-500">
                No saved LearnAI notes yet.
              </CardContent>
            </Card>
          )}
        </aside>
      </section>
    </main>
  );
}
