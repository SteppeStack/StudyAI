import { supabase } from "@/lib/supabase";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_STUDYAI_API_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000";

type RequestOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: BodyInit | object | null;
  headers?: HeadersInit;
};

export type ApiMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
};

export type AiChatResponse = {
  conversation_id: string;
  user_message: ApiMessage;
  assistant_message: ApiMessage;
  usage: {
    ai_requests_used: number;
    monthly_ai_request_limit: number;
  };
};

export type UserFile = {
  id: string;
  user_id: string;
  bucket_id: string;
  storage_path: string;
  original_name: string;
  content_type: string;
  file_type: string;
  size_bytes: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export type FileAnalysisAction =
  | "summarize"
  | "key_points"
  | "flashcards"
  | "quiz"
  | "ask"
  | "create_notes";

export type FileAnalysisResponse = {
  file_id: string;
  action: FileAnalysisAction;
  result: string;
  ai_requests_used: number;
  monthly_ai_request_limit: number;
};

export type AssignmentStatus = "draft" | "in_progress" | "submitted";
export type AssignmentPriority = "low" | "medium" | "high";
export type AssignmentHelpType =
  | "solution_plan"
  | "key_points"
  | "answer_check";

export type Assignment = {
  id: string;
  user_id: string;
  title: string;
  subject: string;
  help_type: AssignmentHelpType;
  deadline: string | null;
  priority: AssignmentPriority;
  status: AssignmentStatus;
  progress: number;
  description: string;
  student_answer: string | null;
  generated_solution_plan: string | null;
  generated_key_points: string | null;
  ai_feedback: string | null;
  created_at: string;
  updated_at: string;
};

export type AssignmentPayload = {
  title: string;
  subject: string;
  help_type: AssignmentHelpType;
  deadline?: string | null;
  priority?: AssignmentPriority;
  status?: AssignmentStatus;
  progress?: number;
  description?: string;
  student_answer?: string | null;
};

export type AssignmentGenerateResponse = {
  assignment: Assignment;
  action: AssignmentHelpType;
  result: string;
  ai_requests_used: number;
  monthly_ai_request_limit: number;
};

async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  const token = data.session?.access_token;

  if (!token) {
    throw new Error("You must be signed in to call the StudyAI API.");
  }

  return token;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = await getAccessToken();
  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;
  const requestBody: BodyInit | null | undefined =
    options.body && !isFormData && typeof options.body !== "string"
      ? JSON.stringify(options.body)
      : (options.body as BodyInit | null | undefined);

  headers.set("Authorization", `Bearer ${token}`);

  if (options.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers,
    body: requestBody,
  });

  if (!response.ok) {
    let message = `StudyAI API request failed with ${response.status}.`;

    try {
      const errorBody = await response.json();
      message = errorBody.detail ?? message;
    } catch {
      const text = await response.text();
      if (text) message = text;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function sendAiTutorMessage(payload: {
  message: string;
  conversation_id?: string;
  title?: string;
}) {
  return request<AiChatResponse>("/api/v1/ai/chat", {
    method: "POST",
    body: payload,
  });
}

export function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return request<UserFile>("/api/v1/files/upload", {
    method: "POST",
    body: formData,
  });
}

export function listFiles() {
  return request<UserFile[]>("/api/v1/files");
}

export function createFileSignedUrl(fileId: string, expiresIn = 3600) {
  return request<{ signed_url: string; expires_in: number }>(
    `/api/v1/files/${fileId}/signed-url?expires_in=${expiresIn}`,
    { method: "POST" }
  );
}

export function deleteFile(fileId: string) {
  return request<void>(`/api/v1/files/${fileId}`, { method: "DELETE" });
}

export function analyzeFile(
  fileId: string,
  payload: { action: FileAnalysisAction; question?: string | null }
) {
  return request<FileAnalysisResponse>(`/api/v1/files/${fileId}/analyze`, {
    method: "POST",
    body: payload,
  });
}

export function createAssignment(payload: AssignmentPayload) {
  return request<Assignment>("/api/v1/assignments", {
    method: "POST",
    body: payload,
  });
}

export function listAssignments() {
  return request<Assignment[]>("/api/v1/assignments");
}

export function getAssignment(assignmentId: string) {
  return request<Assignment>(`/api/v1/assignments/${assignmentId}`);
}

export function updateAssignment(
  assignmentId: string,
  payload: Partial<AssignmentPayload>
) {
  return request<Assignment>(`/api/v1/assignments/${assignmentId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteAssignment(assignmentId: string) {
  return request<void>(`/api/v1/assignments/${assignmentId}`, {
    method: "DELETE",
  });
}

export function generateAssignmentHelp(
  assignmentId: string,
  action: AssignmentHelpType
) {
  return request<AssignmentGenerateResponse>(
    `/api/v1/assignments/${assignmentId}/generate`,
    {
      method: "POST",
      body: { action },
    }
  );
}
