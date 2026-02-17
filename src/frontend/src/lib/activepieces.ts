import { getWebhookUrl } from './env';
import { processFileOffline, generateExpandedSummary } from './offlineNoteProcessing';
import type { UploadResponse, AskAIResponse } from './types';

// Minimum summary length threshold (in characters)
// If webhook returns a summary shorter than this, we'll generate an expanded one
const MIN_SUMMARY_LENGTH = 200;

export async function uploadFile(file: File): Promise<UploadResponse> {
  try {
    const endpointUrl = getWebhookUrl();
    
    // If no webhook is configured, use offline processing
    if (!endpointUrl) {
      return await processFileOffline(file);
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('action', 'process_notes');

    const response = await fetch(endpointUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Strict validation: summary must be non-empty string, quiz_array must be array
    if (!data.summary || typeof data.summary !== 'string' || data.summary.trim() === '') {
      throw new Error('Invalid response format: missing or empty summary');
    }
    
    if (!Array.isArray(data.quiz_array)) {
      throw new Error('Invalid response format: quiz_array must be an array');
    }

    // Check if the webhook-provided summary is too short
    const webhookSummary = data.summary.trim();
    
    if (webhookSummary.length < MIN_SUMMARY_LENGTH) {
      // Summary is too short - try to generate an expanded one client-side
      try {
        const expandedSummary = await generateExpandedSummary(file);
        
        // Return expanded summary with webhook quiz_array
        return {
          summary: expandedSummary,
          quiz_array: data.quiz_array,
          summaryFallbackUsed: true
        };
      } catch (fallbackError) {
        // If we can't generate an expanded summary (e.g., image-only PDF),
        // return the webhook summary with an informational message
        const errorMsg = fallbackError instanceof Error 
          ? fallbackError.message 
          : 'Could not extract text from the file to expand the summary.';
        
        return {
          summary: webhookSummary,
          quiz_array: data.quiz_array,
          summaryFallbackUsed: false,
          summaryFallbackError: `Note: The summary provided is brief. ${errorMsg}`
        };
      }
    }

    // Summary is adequate - use webhook response as-is
    return {
      summary: webhookSummary,
      quiz_array: data.quiz_array,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to upload file. Please try again.');
  }
}

export async function askAI(
  userQuestion: string,
  uploadedNotes: string
): Promise<AskAIResponse> {
  try {
    const endpointUrl = getWebhookUrl();
    
    // If no webhook is configured, provide a helpful message
    if (!endpointUrl) {
      throw new Error('AI question answering requires a webhook URL to be configured. This feature is not available in offline mode.');
    }

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
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to get AI response. Please try again.');
  }
}
