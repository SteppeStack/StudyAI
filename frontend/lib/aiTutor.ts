import { supabase } from "@/lib/supabase";
import { sendAiTutorMessage } from "@/lib/studyApi";

export type Conversation = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  user_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
};

function missingSupabaseResponse() {
  return {
    data: null,
    error: new Error(
      "Supabase client is not configured. AI Tutor history is unavailable."
    ),
  };
}

export async function getConversations() {
  if (!supabase) return missingSupabaseResponse();

  return await supabase
    .from("ai_conversations")
    .select("*")
    .order("updated_at", { ascending: false });
}

export async function createConversation(userId: string, title: string) {
  if (!supabase) return missingSupabaseResponse();

  return await supabase
    .from("ai_conversations")
    .insert({
      user_id: userId,
      title,
    })
    .select()
    .single();
}

export async function getMessages(conversationId: string) {
  if (!supabase) return missingSupabaseResponse();

  return await supabase
    .from("ai_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
}

export async function sendUserMessage(
  conversationId: string,
  userId: string,
  content: string
) {
  const response = await sendAiTutorMessage({
    conversation_id: conversationId,
    message: content,
  });

  return {
    data: {
      conversation_id: conversationId,
      user_id: userId,
      ...response.user_message,
    },
    assistantMessage: {
      conversation_id: conversationId,
      user_id: userId,
      ...response.assistant_message,
    },
    usage: response.usage,
    error: null,
  };
}
