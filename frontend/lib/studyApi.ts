import { supabase } from "@/lib/supabase";

const apiBaseUrl =
  (
    process.env.NEXT_PUBLIC_STUDYAI_API_URL ??
    process.env.NEXT_PUBLIC_API_URL
  )?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000";

type RequestOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: BodyInit | object | null;
  headers?: HeadersInit;
};

export class StudyApiError extends Error {
  status: number;
  detail: unknown;

  constructor(message: string, status = 0, detail: unknown = null) {
    super(message);
    this.name = "StudyApiError";
    this.status = status;
    this.detail = detail;
  }
}

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

export type DocumentType =
  | "essay"
  | "summary"
  | "research"
  | "report"
  | "outline"
  | "notes"
  | "custom";
export type DocumentStatus = "draft" | "generated" | "reviewed" | "archived";
export type DocumentLanguage = "en" | "ru" | "kz";
export type DocumentTone =
  | "academic"
  | "simple"
  | "formal"
  | "concise"
  | "persuasive";
export type DocumentGenerateAction =
  | "outline"
  | "draft"
  | "summarize"
  | "improve";

export type StudyDocument = {
  id: string;
  user_id: string;
  title: string;
  course: string | null;
  document_type: DocumentType | string;
  status: DocumentStatus | string;
  language: DocumentLanguage | string;
  tone: DocumentTone | string;
  progress: number;
  instructions: string;
  source_text: string | null;
  generated_content: string | null;
  word_count: number;
  created_at: string | null;
  updated_at: string | null;
};

export type DocumentPayload = {
  title: string;
  course?: string | null;
  document_type?: DocumentType;
  status?: DocumentStatus;
  language?: DocumentLanguage;
  tone?: DocumentTone;
  progress?: number;
  instructions: string;
  source_text?: string | null;
};

export type DocumentGenerateResponse = {
  document: StudyDocument;
  action: DocumentGenerateAction;
  result: string;
  model_used: string | null;
  fallback_used: boolean;
  ai_requests_used: number;
  monthly_ai_request_limit: number | null;
};

export type ExamPrepMode =
  | "studyPlan"
  | "flashcards"
  | "practiceQuiz"
  | "weakTopics";
export type ExamPrepStatus =
  | "draft"
  | "generated"
  | "in_progress"
  | "completed"
  | "archived";

export type ExamPrep = {
  id: string;
  user_id: string;
  title: string;
  subject: string;
  exam_date: string | null;
  prep_mode: ExamPrepMode | string;
  status: ExamPrepStatus | string;
  progress: number;
  readiness_score: number;
  topics: string;
  current_knowledge: string | null;
  generated_content: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ExamPrepPayload = {
  title: string;
  subject: string;
  exam_date?: string | null;
  prep_mode?: ExamPrepMode;
  status?: ExamPrepStatus;
  progress?: number;
  readiness_score?: number;
  topics: string;
  current_knowledge?: string | null;
};

export type ExamPrepGenerateResponse = {
  exam_prep: ExamPrep;
  mode: ExamPrepMode;
  result: string;
  model_used: string | null;
  fallback_used: boolean;
  ai_requests_used: number;
  monthly_ai_request_limit: number | null;
};

export type ResearchType =
  | "mixed"
  | "quantitative"
  | "qualitative"
  | "theoretical";
export type DiplomaStatus =
  | "draft"
  | "structured"
  | "in_progress"
  | "reviewed"
  | "completed"
  | "archived";
export type ChapterStatus =
  | "notStarted"
  | "inProgress"
  | "draftReady"
  | "reviewed";
export type ChapterKey =
  | "introduction"
  | "literature"
  | "methodology"
  | "results"
  | "discussion"
  | "conclusion";
export type DiplomaGenerateAction =
  | "structure"
  | "researchQuestions"
  | "chapterPlan"
  | "feedback";

export type DiplomaProject = {
  id: string;
  user_id: string;
  topic: string;
  faculty: string | null;
  research_area: string | null;
  supervisor: string | null;
  deadline: string | null;
  research_type: ResearchType | string;
  status: DiplomaStatus | string;
  progress: number;
  research_goal: string | null;
  objectives: string | null;
  chapter_statuses: Record<string, string>;
  generated_structure: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type DiplomaPayload = {
  topic: string;
  faculty?: string | null;
  research_area?: string | null;
  supervisor?: string | null;
  deadline?: string | null;
  research_type?: ResearchType;
  status?: DiplomaStatus;
  progress?: number;
  research_goal?: string | null;
  objectives?: string | null;
  chapter_statuses?: Partial<Record<ChapterKey, ChapterStatus>>;
};

export type DiplomaGenerateResponse = {
  diploma: DiplomaProject;
  action: DiplomaGenerateAction;
  result: string;
  model_used: string | null;
  fallback_used: boolean;
  ai_requests_used: number;
  monthly_ai_request_limit: number | null;
};

export type DashboardPlan = {
  id: string;
  display_name: string;
  audience: string;
  monthly_price_cents: number;
  currency: string;
  daily_ai_request_limit: number | null;
  monthly_ai_request_limit: number | null;
};

export type DashboardData = {
  profile: {
    id: string;
    email: string | null;
    full_name: string | null;
    avatar_url: string | null;
    account_role: string | null;
    subscription_plan: string | null;
  };
  subscription: {
    id: string;
    status: string;
    started_at: string | null;
    expires_at: string | null;
    plan: DashboardPlan;
  };
  usage: {
    period_start: string;
    ai_requests_used: number;
    documents_generated: number;
  };
  recent_activity: Array<{
    id: string;
    event_type: string;
    title: string;
    description: string | null;
    status: string | null;
    resource_type: string | null;
    resource_id: string | null;
    created_at: string | null;
  }>;
};

async function getAccessToken() {
  if (!supabase) {
    throw new StudyApiError(
      "Supabase client is not configured. Add public Supabase env variables to use StudyAI API.",
      0
    );
  }

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new StudyApiError(error.message, 0, error);
  }

  const token = data.session?.access_token;

  if (!token) {
    throw new StudyApiError("You must be signed in to call the StudyAI API.", 401);
  }

  return token;
}

function stringifyDetail(detail: unknown, fallback: string) {
  if (typeof detail === "string") return detail;

  if (
    detail &&
    typeof detail === "object" &&
    "message" in detail &&
    typeof detail.message === "string"
  ) {
    return detail.message;
  }

  return fallback;
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

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers,
      body: requestBody,
    });
  } catch (error) {
    throw new StudyApiError(
      "StudyAI API is unavailable. Please try again later.",
      0,
      error
    );
  }

  if (!response.ok) {
    let message = `StudyAI API request failed with ${response.status}.`;
    let detail: unknown = null;

    try {
      const errorBody = await response.json();
      detail = errorBody.detail ?? errorBody;
      message = stringifyDetail(detail, message);
    } catch {
      const text = await response.text();
      if (text) {
        detail = text;
        message = text;
      }
    }

    throw new StudyApiError(message, response.status, detail);
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

export function createDocument(payload: DocumentPayload) {
  return request<StudyDocument>("/api/v1/documents", {
    method: "POST",
    body: payload,
  });
}

export function listDocuments() {
  return request<StudyDocument[]>("/api/v1/documents");
}

export function getDocument(documentId: string) {
  return request<StudyDocument>(`/api/v1/documents/${documentId}`);
}

export function updateDocument(
  documentId: string,
  payload: Partial<DocumentPayload> & { generated_content?: string | null }
) {
  return request<StudyDocument>(`/api/v1/documents/${documentId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteDocument(documentId: string) {
  return request<void>(`/api/v1/documents/${documentId}`, {
    method: "DELETE",
  });
}

export function generateDocument(
  documentId: string,
  action: DocumentGenerateAction
) {
  return request<DocumentGenerateResponse>(
    `/api/v1/documents/${documentId}/generate`,
    {
      method: "POST",
      body: { action },
    }
  );
}

export function createExamPrep(payload: ExamPrepPayload) {
  return request<ExamPrep>("/api/v1/exam-preps", {
    method: "POST",
    body: payload,
  });
}

export function listExamPreps() {
  return request<ExamPrep[]>("/api/v1/exam-preps");
}

export function getExamPrep(examPrepId: string) {
  return request<ExamPrep>(`/api/v1/exam-preps/${examPrepId}`);
}

export function updateExamPrep(
  examPrepId: string,
  payload: Partial<ExamPrepPayload> & { generated_content?: string | null }
) {
  return request<ExamPrep>(`/api/v1/exam-preps/${examPrepId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteExamPrep(examPrepId: string) {
  return request<void>(`/api/v1/exam-preps/${examPrepId}`, {
    method: "DELETE",
  });
}

export function generateExamPrep(examPrepId: string, mode?: ExamPrepMode) {
  return request<ExamPrepGenerateResponse>(
    `/api/v1/exam-preps/${examPrepId}/generate`,
    {
      method: "POST",
      body: { mode },
    }
  );
}

export function createDiplomaProject(payload: DiplomaPayload) {
  return request<DiplomaProject>("/api/v1/diplomas", {
    method: "POST",
    body: payload,
  });
}

export function listDiplomaProjects() {
  return request<DiplomaProject[]>("/api/v1/diplomas");
}

export function getDiplomaProject(diplomaId: string) {
  return request<DiplomaProject>(`/api/v1/diplomas/${diplomaId}`);
}

export function updateDiplomaProject(
  diplomaId: string,
  payload: Partial<DiplomaPayload> & { generated_structure?: string | null }
) {
  return request<DiplomaProject>(`/api/v1/diplomas/${diplomaId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteDiplomaProject(diplomaId: string) {
  return request<void>(`/api/v1/diplomas/${diplomaId}`, {
    method: "DELETE",
  });
}

export function generateDiplomaProject(
  diplomaId: string,
  action: DiplomaGenerateAction = "structure"
) {
  return request<DiplomaGenerateResponse>(
    `/api/v1/diplomas/${diplomaId}/generate`,
    {
      method: "POST",
      body: { action },
    }
  );
}

export function updateDiplomaChapterStatus(
  diplomaId: string,
  chapter: ChapterKey,
  status: ChapterStatus,
  currentStatuses: Partial<Record<ChapterKey, ChapterStatus>> = {}
) {
  return updateDiplomaProject(diplomaId, {
    chapter_statuses: {
      ...currentStatuses,
      [chapter]: status,
    },
  });
}

export function getDashboardData() {
  return request<DashboardData>("/api/v1/dashboard");
}

export function getDashboardPlans() {
  return request<DashboardPlan[]>("/api/v1/dashboard/plans");
}
