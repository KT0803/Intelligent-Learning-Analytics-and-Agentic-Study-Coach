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
                <p className="loading-overlay-sub">AskMyNotes × Study Copilot</p>
            </div>
        </div>
    );
}

type StudyTab = "notes" | "chat" | "study";

interface Subject {
    id: string;
    name: string;
    accent: string;
    description: string;
    fileCount: number;
}

interface SubjectFile {
    id: string;
    fileName: string;
    mimeType: string;
    summary: string;
    chunkCount: number;
    pageCount: number | null;
    byteSize: number;
    lastIngestedAt: string | null;
}

interface Citation {
    fileName: string;
    page: number | null;
    chunkId: string;
}

interface AnswerState {
    answer: string;
    confidence: string;
    evidence: string[];
    citations: Citation[];
}

interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    confidence?: string;
    evidence?: string[];
    citations?: Citation[];
}

interface QuizState {
    mcqs: Array<{
        id: string;
        question: string;
        options: string[];
        correctIndex: number;
        explanation: string;
        citation: string;
    }>;
    shortAnswers: Array<{
        id: string;
        question: string;
        modelAnswer: string;
        citation: string;
    }>;
}

function formatDate(value: string | null): string {
    if (!value) return "Unknown";
    return new Date(value).toLocaleString();
}

function formatSize(bytes: number): string {
    if (!bytes) return "0 KB";
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function createId() {
    return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function StudyPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedId, setSelectedId] = useState("");
    const [activeTab, setActiveTab] = useState<StudyTab>("notes");
    const [newSubject, setNewSubject] = useState("");
    const [subjectDescription, setSubjectDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [question, setQuestion] = useState("");
    const [files, setFiles] = useState<SubjectFile[]>([]);
    const [chatState, setChatState] = useState<Record<string, ChatMessage[]>>({});
    const [quizState, setQuizState] = useState<Record<string, QuizState | null>>({});
    const [error, setError] = useState("");
    const [uploadMessage, setUploadMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingLabel, setLoadingLabel] = useState("Working on it...");
    // Read stored user as state post-mount to avoid SSR/hydration mismatch
    const [storedUser, setStoredUser] = useState<{ name: string; email: string } | null>(null);

    const selectedSubject = useMemo(
        () => subjects.find((subject) => subject.id === selectedId) ?? null,
        [subjects, selectedId]
    );

    const currentMessages = chatState[selectedId] ?? [];
    const currentQuiz = quizState[selectedId] ?? null;

    useEffect(() => {
        if (!getStoredSessionToken()) {
            window.location.href = "/login";
            return;
        }

        // Read user from localStorage after mount
        setStoredUser(getStoredUser());

        Promise.all([
            api<{ user: { name: string; email: string } }>("/api/auth/me"),
            loadSubjects()
        ]).catch((err: unknown) => {
            // Only force logout on a real 401 — not on network errors or backend being down
            const msg = err instanceof Error ? err.message : "";
            if (msg.toLowerCase().includes("unauthorized") || msg.toLowerCase().includes("401")) {
                clearStoredSession();
                window.location.href = "/login";
            }
        });
    }, []);

    useEffect(() => {
        if (selectedId) {
            void loadFiles(selectedId);
        }
    }, [selectedId]);

    async function loadSubjects() {
        const data = await api<{ subjects: Subject[] }>("/api/subjects");
        setSubjects(data.subjects);
        if (!selectedId && data.subjects[0]) {
            setSelectedId(data.subjects[0].id);
        }
    }

    async function loadFiles(subjectId: string) {
        const data = await api<{ files: SubjectFile[] }>(`/api/subjects/${subjectId}/files`);
        setFiles(data.files);
    }

    async function createSubject() {
        setError("");
        setLoading(true);
        setLoadingLabel("Creating subject...");
        try {
            await api("/api/subjects", {
                method: "POST",
                body: JSON.stringify({
                    name: newSubject,
                    description: subjectDescription
                })
            });
            setNewSubject("");
            setSubjectDescription("");
            await loadSubjects();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Failed to create subject");
        } finally {
            setLoading(false);
        }
    }

    async function uploadNote() {
        if (!selectedId || !selectedFile) return;
        setError("");
        setUploadMessage("");
        setLoading(true);
        setLoadingLabel("Uploading and indexing notes...");

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            const data = await api<{
                ingestion: {
                    fileName: string;
                    totalPages: number | null;
                    chunkCount: number;
                    summary: string;
                };
            }>(`/api/subjects/${selectedId}/files`, {
                method: "POST",
                body: formData
            });

            setSelectedFile(null);
            setUploadMessage(`Uploaded ${data.ingestion.fileName}. Extracted ${data.ingestion.chunkCount} chunk(s) and prepared Study Copilot context.`);
            await loadFiles(selectedId);
            await loadSubjects();
            setActiveTab("notes");
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Failed to upload file");
        } finally {
            setLoading(false);
        }
    }

    async function askQuestion() {
        if (!selectedId || !question.trim()) return;
        setError("");
        setLoading(true);
        setLoadingLabel("Asking your notes...");

        const userMessage: ChatMessage = {
            id: createId(),
            role: "user",
            content: question.trim()
        };

        const previousMessages = chatState[selectedId] ?? [];
        const historyPayload = previousMessages.slice(-4).map((msg) => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content
        }));

        setChatState((prev) => ({
            ...prev,
            [selectedId]: [...previousMessages, userMessage]
        }));

        try {
            const data = await api<AnswerState & { found: boolean }>("/api/ask", {
                method: "POST",
                body: JSON.stringify({
                    subjectId: selectedId,
                    question,
                    history: historyPayload
                })
            });

            const assistantMessage: ChatMessage = {
                id: createId(),
                role: "assistant",
                content: data.answer,
                confidence: data.confidence,
                evidence: data.evidence,
                citations: data.citations
            };

            setChatState((prev) => ({
                ...prev,
                [selectedId]: [...(prev[selectedId] ?? []), assistantMessage]
            }));

            setQuestion("");
            setActiveTab("chat");
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Failed to ask question");
        } finally {
            setLoading(false);
        }
    }

    async function buildQuiz() {
        if (!selectedId) return;
        setError("");
        setLoading(true);
        setLoadingLabel("Generating quiz questions...");

        try {
            const data = await api<{ quiz: QuizState }>(`/api/subjects/${selectedId}/quiz`, {
                method: "POST"
            });
            setQuizState((prev) => ({
                ...prev,
                [selectedId]: data.quiz
            }));
            setActiveTab("study");
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Failed to generate quiz");
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
