import { getWebhookUrl } from './env';
import type { UploadResponse, AskAIResponse } from './types';

export async function uploadFile(file: File): Promise<UploadResponse> {
  const endpointUrl = getWebhookUrl();
  
  // Process via webhook
  const formData = new FormData();
  formData.append('file', file);
  formData.append('action', 'process_notes');

  const response = await fetch(endpointUrl, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Webhook request failed with status ${response.status}`);
  }

  const data = await response.json();
  
  // Strict validation: summary must be non-empty string, quiz_array must be array
  if (!data.summary || typeof data.summary !== 'string' || data.summary.trim() === '') {
    throw new Error('Invalid webhook response: missing or empty summary');
  }
  
  if (!Array.isArray(data.quiz_array)) {
    throw new Error('Invalid webhook response: quiz_array must be an array');
  }

  // Return webhook response with whitespace trimming only
  return {
    summary: data.summary.trim(),
    quiz_array: data.quiz_array,
  };
}

export async function askAI(
  userQuestion: string,
  uploadedNotes: string
): Promise<AskAIResponse> {
  const endpointUrl = getWebhookUrl();

  const response = await fetch(endpointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'ask_ai',
      user_question: userQuestion,
      uploaded_notes: uploadedNotes,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  // Strict validation: ai_answer must be non-empty string
  if (!data.ai_answer || typeof data.ai_answer !== 'string' || data.ai_answer.trim() === '') {
    throw new Error('Invalid response format: missing or empty ai_answer');
  }

  return {
    ai_answer: data.ai_answer,
  };
}
