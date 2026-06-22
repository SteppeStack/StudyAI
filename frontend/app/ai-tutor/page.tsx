"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";
import { supabase } from "@/lib/supabase";
import { getMessages, Message, sendUserMessage } from "@/lib/aiTutor";

export default function AiTutorChatPage() {
  const router = useRouter();
  const params = useParams();

  const conversationId = params.id as string;

  const [userId, setUserId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    async function loadChat() {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        router.push("/login");
        return;
      }

      setUserId(sessionData.session.user.id);

      const { data, error } = await getMessages(conversationId);

      if (error) {
        console.error(error.message);
      } else {
        setMessages(data || []);
      }

      setLoading(false);
    }

    loadChat();
  }, [conversationId, router]);

  async function handleSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const messageText = content.trim();

    if (!messageText || sending) return;

    setSending(true);
    setNotice("");
    setContent("");

    const { data, error } = await sendUserMessage(
      conversationId,
      userId,
      messageText
    );

    if (error) {
      console.error(error.message);
      setNotice("Message was not saved. Please try again.");
      setSending(false);
      return;
    }

    if (data) {
      setMessages((current) => [...current, data]);
    }

    setNotice("AI response will be available after the next backend sprint.");
    setSending(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <AppSidebar />

        <section className="ml-[270px] flex min-h-screen items-center justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
            <p className="text-sm font-medium text-slate-600">
              Loading AI Tutor chat...
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AppSidebar />

      <section className="ml-[270px] flex min-h-screen flex-col">
        <header className="border-b border-slate-200 bg-white px-10 py-6">
          <button
            onClick={() => router.push("/ai-tutor")}
            className="mb-4 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to chats
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                AI Tutor Chat
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Ask questions, save your learning history, and continue anytime.
              </p>
            </div>

            <div className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-medium text-blue-600">
              StudyAI Assistant
            </div>
          </div>
        </header>

        <div className="flex-1 px-10 py-8">
          <div className="mx-auto flex max-w-5xl flex-col">
            {messages.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
                <div className="mx-auto flex max-w-xl flex-col items-center text-center">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-sm font-bold text-blue-600">
                    AI
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Start learning with AI Tutor
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Ask a question about your homework, exam topic, lecture
                    notes, or any concept you want to understand better.
                  </p>

                  <div className="mt-6 grid w-full gap-3 text-left sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() =>
                        setContent("Explain quadratic equations step by step.")
                      }
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Explain quadratic equations
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setContent("Help me prepare for my economics exam.")
                      }
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Prepare for an exam
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setContent("Summarize this topic in simple words.")
                      }
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Summarize a topic
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setContent("Create practice questions for this topic.")
                      }
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Create practice questions
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.role === "user"
                        ? "flex justify-end"
                        : "flex justify-start"
                    }
                  >
                    <div
                      className={
                        message.role === "user"
                          ? "max-w-2xl rounded-3xl bg-blue-600 px-5 py-4 text-white shadow-sm"
                          : "max-w-2xl rounded-3xl border border-slate-200 bg-white px-5 py-4 text-slate-900 shadow-sm"
                      }
                    >
                      <div className="mb-2 text-xs font-medium opacity-70">
                        {message.role === "user" ? "You" : "StudyAI"}
                      </div>

                      <p className="text-sm leading-6">{message.content}</p>
                    </div>
                  </div>
                ))}

                {notice && (
                  <div className="flex justify-start">
                    <div className="max-w-2xl rounded-3xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm leading-6 text-blue-700">
                      {notice}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSend}
          className="sticky bottom-0 border-t border-slate-200 bg-white/95 px-10 py-5 backdrop-blur"
        >
          <div className="mx-auto flex max-w-5xl items-end gap-3">
            <div className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Ask AI Tutor something..."
                rows={1}
                className="max-h-32 w-full resize-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={sending || !content.trim()}
              className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}