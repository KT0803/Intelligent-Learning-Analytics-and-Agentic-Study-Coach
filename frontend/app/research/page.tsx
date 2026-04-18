"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api, clearStoredSession, getStoredSessionToken, getStoredUser } from "@/src/lib/api";
import { ProjectLogo } from "@/src/components/ProjectLogo";

function LoadingOverlay({ label }: { label: string }) {
    return (
        <div className="loading-overlay">
            <div className="loading-overlay-card">
                <div className="loading-pencil-track">
                    <div className="loading-pencil-track-bar-border" />
                    <div className="loading-pencil-track-fill" />
                </div>
                <span className="loading-overlay-label">{label}</span>
                <p className="loading-overlay-sub">ResearchPilot × AskMyNotes</p>
            </div>
        </div>
    );
}

interface ResearchSource {
    title: string;
    url: string;
    snippet: string;
    domain: string;
    sourceType: string;
    credibility: number;
    publishedAt?: string | null;
}

interface ResearchReport {
    title: string;
    abstract: string;
    keyFindings: string[];
    sources: ResearchSource[];
    conclusion: string;
    followUpQuestions: string[];
    generatedAt: string;
}

interface ResearchResponse {
    sessionId: string;
    report: ResearchReport;
    workflow: {
        searchQuery: string;
        sourcesAnalyzed: number;
        warnings: string[];
        usedSessionMemory: boolean;
        modelUsed: string | null;
        stages: string[];
    };
}

interface TopicExpansion {
    expansions: string[];
    subtopics: string[];
    suggestedQuestions: string[];
}

interface HistoryItem {
    query: string;
    title: string;
    abstract: string;
    generatedAt: string;
    sessionId: string;
    sourceCount: number;
    warnings: string[];
}

function formatDate(value: string): string {
    return new Date(value).toLocaleString();
}

export default function ResearchPage() {
    const [query, setQuery] = useState("");
    const [sessionId, setSessionId] = useState(`research_${Date.now()}`);
    const [result, setResult] = useState<ResearchResponse | null>(null);
    const [expansion, setExpansion] = useState<TopicExpansion | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingLabel, setLoadingLabel] = useState("Working on it...");
    // Read stored user as state after mount to avoid SSR/hydration mismatch
    const [storedUser, setStoredUser] = useState<{ name: string; email: string } | null>(null);

    useEffect(() => {
        if (!getStoredSessionToken()) {
            window.location.href = "/login";
            return;
        }

        // Set user from localStorage immediately after mount
        setStoredUser(getStoredUser());

        Promise.all([
            api<{ user: { name: string; email: string } }>("/api/auth/me"),
            api<{ history: HistoryItem[] }>("/api/research/history")
        ])
            .then(([, historyData]) => setHistory(historyData.history))
            .catch((err: unknown) => {
                // Only force logout on a real 401 — not on network errors or backend being down
                const msg = err instanceof Error ? err.message : "";
                if (msg.toLowerCase().includes("unauthorized") || msg.toLowerCase().includes("401")) {
                    clearStoredSession();
                    window.location.href = "/login";
                }
            });
    }, []);

    const prompts = useMemo(() => [
        "Recent applications of graph neural networks in healthcare diagnostics",
        "How retrieval-augmented generation reduces hallucinations in research assistants",
        "Sustainable aviation fuel adoption barriers in developing economies",
        "Benchmarking multimodal large language models for document reasoning"
    ], []);

    async function refreshHistory() {
        const historyData = await api<{ history: HistoryItem[] }>("/api/research/history");
        setHistory(historyData.history);
    }


    async function handleGenerate(event: React.FormEvent) {

        event.preventDefault();
        setLoading(true);
        setLoadingLabel("Generating research report...");
        setError("");

        try {
            const data = await api<ResearchResponse>("/api/research/report", {
                method: "POST",
                body: JSON.stringify({ query, sessionId })
            });
            setResult(data);
            setSessionId(data.sessionId);
            await refreshHistory();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Failed to generate report");
        } finally {
            setLoading(false);
        }
    }

    async function handleExpand() {
        setLoading(true);
        setLoadingLabel("Expanding topic...");
        setError("");

        try {
            const data = await api<TopicExpansion & { query: string }>("/api/research/expand", {
                method: "POST",
                body: JSON.stringify({ query, sessionId })
            });
            setExpansion({
                expansions: data.expansions,
                subtopics: data.subtopics,
                suggestedQuestions: data.suggestedQuestions
            });
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Failed to expand topic");
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        try {
            await api("/api/auth/logout", { method: "POST" });
        } catch {
            // Clear locally either way.
        }
        clearStoredSession();
        window.location.href = "/";
    }

    function exportMarkdown() {
        if (!result) return;

        const markdown = [
            `# ${result.report.title}`,
            "",
            "## Abstract",
            result.report.abstract,
            "",
            "## Key Findings",
            ...result.report.keyFindings.map((entry) => `- ${entry}`),
            "",
            "## Sources",
            ...result.report.sources.map((source) => `- [${source.title}](${source.url})`),
            "",
            "## Conclusion",
            result.report.conclusion,
            "",
            "## Follow-Up Questions",
            ...result.report.followUpQuestions.map((item) => `- ${item}`)
        ].join("\n");

        const blob = new Blob([markdown], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "research-report.md";
        anchor.click();
        URL.revokeObjectURL(url);
    }