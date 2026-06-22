import { supabase } from "@/lib/supabase";

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

export async function getConversations() {
  return await supabase
    .from("ai_conversations")
    .select("*")
    .order("updated_at", { ascending: false });
}

export async function createConversation(userId: string, title: string) {
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
  return await supabase
    .from("ai_messages")
    .insert({
      conversation_id: conversationId,
      user_id: userId,
      role: "user",
      content,
    })
    .select()
    .single();
}