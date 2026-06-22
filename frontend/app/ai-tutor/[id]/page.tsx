"use client";

import { useEffect, useState } from "react";
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

  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!content.trim()) return;

    setSending(true);
    setNotice("");

    const messageText = content.trim();
    setContent("");

    const { data, error } = await sendUserMessage(
      conversationId,
      userId,
      messageText
    );

    if (error) {
      console.error(error.message);
      setNotice("Message was not saved.");
      setSending(false);
      return;
    }

    setMessages((current) => [...current, data]);
    setNotice("AI response will be connected in the next backend sprint.");
    setSending(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading chat...</p>
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
            className="mb-4 text-sm font-medium text-blue-600"
          >
            ← Back to chats
          </button>

          <h1 className="text-3xl font-bold">AI Tutor Chat</h1>
          <p className="mt-2 text-slate-500">
            Ask a question and save your message history.
          </p>
        </header>

        <div className="flex-1 px-10 py-8">
          <div className="mx-auto flex max-w-4xl flex-col gap-4">
            {messages.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="text-slate-500">
                  No messages yet. Start by asking a question.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === "user"
                      ? "ml-auto max-w-2xl rounded-2xl bg-blue-600 px-5 py-4 text-white"
                      : "mr-auto max-w-2xl rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900"
                  }
                >
                  <p className="text-sm leading-6">{message.content}</p>
                </div>
              ))
            )}

            {notice && (
              <div className="mr-auto max-w-2xl rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-700">
                {notice}
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSend}
          className="border-t border-slate-200 bg-white px-10 py-5"
        >
          <div className="mx-auto flex max-w-4xl gap-3">
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ask AI Tutor something..."
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={sending}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}