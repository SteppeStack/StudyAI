"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";
import { useLanguage } from "@/components/LanguageProvider";
import { supabase } from "@/lib/supabase";
import {
  Conversation,
  createConversation,
  getConversations,
} from "@/lib/aiTutor";

export default function AiTutorPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    async function loadConversations() {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        router.push("/login");
        return;
      }

      setUserId(sessionData.session.user.id);

      const { data } = await getConversations();

      setConversations((data || []) as Conversation[]);
      setLoading(false);
    }

    loadConversations();
  }, [router]);

  async function handleNewChat() {
    if (!userId) return;

    setCreating(true);

    const { data } = await createConversation(userId, t.aiTutorPage.newChat);

    if (data) {
      router.push(`/ai-tutor/${data.id}`);
      return;
    }

    setCreating(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <AppSidebar />

        <section className="min-h-screen px-4 pt-20 lg:ml-[300px] lg:flex lg:items-center lg:justify-center lg:pt-0">
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
            <p className="text-sm font-medium text-slate-600">
              {t.aiTutorPage.loadingChats}
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AppSidebar />

      <section className="min-h-screen px-4 pb-8 pt-20 sm:px-6 lg:ml-[300px] lg:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-[1680px]">
          <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{t.aiTutorPage.title}</h1>
              <p className="mt-2 text-slate-500">{t.aiTutorPage.subtitle}</p>
            </div>

            <button
              onClick={handleNewChat}
              disabled={creating}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {creating ? t.common.loading : t.aiTutorPage.newChat}
            </button>
          </header>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold">{t.aiTutorPage.savedChats}</h2>

            {conversations.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => router.push(`/ai-tutor/${conversation.id}`)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <p className="font-bold text-slate-900">
                      {conversation.title || t.aiTutorPage.newChat}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      {new Date(conversation.updated_at).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
                <p className="font-semibold text-slate-700">
                  {t.aiTutorPage.noChats}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  {t.aiTutorPage.noChatsSubtitle}
                </p>

                <button
                  onClick={handleNewChat}
                  disabled={creating}
                  className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {creating ? t.common.loading : t.aiTutorPage.newChat}
                </button>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}