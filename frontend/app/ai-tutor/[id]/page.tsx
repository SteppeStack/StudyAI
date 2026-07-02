"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";
import { useLanguage } from "@/components/LanguageProvider";
import { supabase } from "@/lib/supabase";
import { Message, getMessages, sendUserMessage } from "@/lib/aiTutor";

export default function AiTutorChatPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const conversationId = params.id;
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMessages() {
      if (!supabase) {
        setError("Supabase client is not configured. Chat history is unavailable.");
        setLoading(false);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        router.push("/login");
        return;
      }

      setUserId(sessionData.session.user.id);

      const { data } = await getMessages(conversationId);

      setMessages((data || []) as Message[]);
      setLoading(false);
    }

    loadMessages();
  }, [conversationId, router]);

  async function handleSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!input.trim() || !userId) return;

    const messageText = input.trim();

    setSending(true);
    setInput("");
    setError("");

    try {
      const { data, assistantMessage } = await sendUserMessage(
        conversationId,
        userId,
        messageText
      );

      if (data) {
        setMessages((currentMessages) => [
          ...currentMessages,
          data as Message,
          assistantMessage as Message,
        ]);
      }
    } catch (sendError) {
      setInput(messageText);
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Failed to send message."
      );
    } finally {
      setSending(false);
    }
  }

  function fillPrompt(prompt: string) {
    setInput(prompt);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <AppSidebar />

        <section className="min-h-screen px-4 pt-20 lg:ml-[300px] lg:flex lg:items-center lg:justify-center lg:pt-0">
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
            <p className="text-sm font-medium text-slate-600">
              {t.aiTutorPage.loadingMessages}
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AppSidebar />

      <section className="flex min-h-screen flex-col pt-16 lg:ml-[300px] lg:pt-0">
        <header className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 lg:px-10">
          <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/ai-tutor"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                ← {t.aiTutorPage.backToChats}
              </Link>

              <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
                {t.aiTutorPage.chatTitle}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                {t.aiTutorPage.subtitle}
              </p>
            </div>

            <div className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
              {t.aiTutorPage.assistantBadge}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-5xl space-y-5">
            {messages.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-600">
                  AI
                </div>

                <h2 className="text-2xl font-bold">
                  {t.aiTutorPage.startLearning}
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500">
                  {t.aiTutorPage.startLearningSubtitle}
                </p>

                <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    onClick={() => fillPrompt(t.aiTutorPage.promptOne)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    {t.aiTutorPage.promptOne}
                  </button>

                  <button
                    onClick={() => fillPrompt(t.aiTutorPage.promptTwo)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    {t.aiTutorPage.promptTwo}
                  </button>

                  <button
                    onClick={() => fillPrompt(t.aiTutorPage.promptThree)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    {t.aiTutorPage.promptThree}
                  </button>

                  <button
                    onClick={() => fillPrompt(t.aiTutorPage.promptFour)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    {t.aiTutorPage.promptFour}
                  </button>
                </div>
              </div>
            ) : (
              messages.map((message) => (
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
                        ? "max-w-[85%] rounded-3xl bg-blue-600 px-5 py-4 text-sm leading-6 text-white sm:max-w-[70%]"
                        : "max-w-[85%] rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm leading-6 text-slate-700 shadow-sm sm:max-w-[70%]"
                    }
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-10">
          <form
            onSubmit={handleSend}
            className="mx-auto flex w-full max-w-5xl gap-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-w-0 flex-1 rounded-2xl border border-slate-300 bg-white px-5 py-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t.aiTutorPage.inputPlaceholder}
            />

            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="rounded-2xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? "..." : t.aiTutorPage.send}
            </button>
          </form>

          {error && (
            <p className="mx-auto mt-3 w-full max-w-5xl text-sm font-medium text-red-600">
              {error}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
