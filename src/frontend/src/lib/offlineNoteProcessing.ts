import type { UploadResponse, QuizItem } from './types';
import { extractPdfText } from './pdfTextExtraction';

/**
 * Extracts plain text content from supported file types (.txt, .md, .pdf)
 */
async function extractTextContent(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
    return await file.text();
  }
  
  if (fileName.endsWith('.pdf')) {
    return await extractPdfText(file);
  }
  
  throw new Error(
    `Unsupported file type. Please upload a PDF, text, or markdown file (.pdf, .txt, .md).`
  );
}

/**
 * Generates a comprehensive summary from text content
 */
function generateSummary(text: string): string {
  const cleanText = text.trim();
  
  if (cleanText.length === 0) {
    return 'This document appears to be empty.';
  }
  
  // Split by paragraphs (double newlines) or sentences for better content extraction
  const paragraphs = cleanText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  // If we have clear paragraphs, use them
  if (paragraphs.length > 0) {
    // Take up to 8 paragraphs or 5000 characters, whichever comes first
    let summary = '';
    let charCount = 0;
    const maxChars = 5000;
    const maxParagraphs = 8;
    
    for (let i = 0; i < Math.min(paragraphs.length, maxParagraphs); i++) {
      const para = paragraphs[i].trim();
      if (charCount + para.length > maxChars && summary.length > 0) {
        break;
      }
      summary += para + '\n\n';
      charCount += para.length + 2;
    }
    
    // If we have more content, add a note
    if (paragraphs.length > maxParagraphs || charCount >= maxChars) {
      summary += '[Summary truncated - full content available in original document]';
    }
    
    return summary.trim();
  }
  
  // Fallback: if no clear paragraphs, split by sentences
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  if (sentences.length > 0) {
    // Take up to 20 sentences or 5000 characters
    let summary = '';
    let charCount = 0;
    const maxChars = 5000;
    const maxSentences = 20;
    
    for (let i = 0; i < Math.min(sentences.length, maxSentences); i++) {
      const sentence = sentences[i].trim();
      if (charCount + sentence.length > maxChars && summary.length > 0) {
        break;
      }
      summary += sentence + '. ';
      charCount += sentence.length + 2;
    }
    
    if (sentences.length > maxSentences || charCount >= maxChars) {
      summary += '\n\n[Summary truncated - full content available in original document]';
    }
    
    return summary.trim();
  }
  
  // Last resort: take first 5000 characters
  if (cleanText.length > 5000) {
    return cleanText.substring(0, 5000) + '\n\n[Summary truncated - full content available in original document]';
  }
  
  return cleanText;
}

/**
 * Generates up to 10 quiz questions from text content
 */
function generateQuiz(text: string): QuizItem[] {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  if (lines.length === 0 || wordCount < 10) {
    return [];
  }
  
  const quiz: QuizItem[] = [];
  
  // Question 1: Main topic (always included)
  quiz.push({
    question: 'What is the main topic of this document?',
    options: [
      'The content uploaded in the notes',
      'Unrelated topic A',
      'Unrelated topic B',
      'Unrelated topic C'
    ],
    correct_answer: 'The content uploaded in the notes'
  });
  
  // Question 2: Document structure
  quiz.push({
    question: 'How many main sections or paragraphs does this document contain?',
    options: [
      `Approximately ${Math.max(1, Math.ceil(lines.length / 3))} sections`,
      'Only one section',
      'More than 100 sections',
      'No clear sections'
    ],
    correct_answer: `Approximately ${Math.max(1, Math.ceil(lines.length / 3))} sections`
  });
  
  // Question 3: Document type
  quiz.push({
    question: 'What type of document is this?',
    options: [
      'A text-based note or document',
      'A video file',
      'An audio recording',
      'A spreadsheet'
    ],
    correct_answer: 'A text-based note or document'
  });
  
  // Question 4: Word count estimation
  const roundedCount = Math.max(50, Math.round(wordCount / 50) * 50);
  quiz.push({
    question: 'Approximately how many words does this document contain?',
    options: [
      `Around ${roundedCount} words`,
      'Less than 10 words',
      'More than 10,000 words',
      'Exactly 5 words'
    ],
    correct_answer: `Around ${roundedCount} words`
  });
  
  // Question 5: Document length
  quiz.push({
    question: 'How would you describe the length of this document?',
    options: [
      lines.length > 50 ? 'Lengthy and detailed' : lines.length > 20 ? 'Moderate length' : 'Brief and concise',
      'Extremely short',
      'Just a single word',
      'Empty document'
    ],
    correct_answer: lines.length > 50 ? 'Lengthy and detailed' : lines.length > 20 ? 'Moderate length' : 'Brief and concise'
  });
  
  // Question 6: Content format
  quiz.push({
    question: 'How is the content organized in this document?',
    options: [
      text.includes('\n\n') || lines.length > 5 ? 'Multiple paragraphs or sections' : 'Continuous text',
      'Single continuous line',
      'Only bullet points',
      'No organization'
    ],
    correct_answer: text.includes('\n\n') || lines.length > 5 ? 'Multiple paragraphs or sections' : 'Continuous text'
  });
  
  // Question 7: First line content
  if (lines.length > 0 && lines[0].length > 5) {
    const firstLinePreview = lines[0].substring(0, Math.min(40, lines[0].length));
    quiz.push({
      question: 'What does the document begin with?',
      options: [
        `Text starting with: "${firstLinePreview}..."`,
        'A blank page',
        'An image',
        'A table of contents'
      ],
      correct_answer: `Text starting with: "${firstLinePreview}..."`
    });
  }
  
  // Question 8: Character count
  const roundedChars = Math.max(100, Math.round(text.length / 100) * 100);
  quiz.push({
    question: 'Approximately how many characters are in this document?',
    options: [
      `Around ${roundedChars} characters`,
      'Less than 50 characters',
      'More than 1 million characters',
      'Exactly 10 characters'
    ],
    correct_answer: `Around ${roundedChars} characters`
  });
  
  // Question 9: Content density
  const avgWordLength = Math.max(1, Math.round(text.replace(/\s/g, '').length / Math.max(1, wordCount)));
  quiz.push({
    question: 'What is the average word length in this document?',
    options: [
      `Approximately ${avgWordLength} characters per word`,
      'Less than 2 characters per word',
      'More than 20 characters per word',
      'Exactly 1 character per word'
    ],
    correct_answer: `Approximately ${avgWordLength} characters per word`
  });
  
  // Question 10: Document completeness
  quiz.push({
    question: 'Based on the structure, does this document appear complete?',
    options: [
      'Yes, it has a clear structure with content',
      'No, it appears to be empty',
      'It only contains a title',
      'It is corrupted and unreadable'
    ],
    correct_answer: 'Yes, it has a clear structure with content'
  });
  
  // Return exactly 10 questions (or fewer only if document is extremely minimal)
  return quiz.slice(0, 10);
}

/**
 * Processes a file offline (client-side) without external webhook
 * Supports .txt, .md, and .pdf files
 */
export async function processFileOffline(file: File): Promise<UploadResponse> {
  try {
    const textContent = await extractTextContent(file);
    
    if (!textContent || textContent.trim().length === 0) {
      throw new Error('The uploaded file appears to be empty. Please upload a file with content.');
    }
    
    const summary = generateSummary(textContent);
    const quiz_array = generateQuiz(textContent);
    
    return {
      summary,
      quiz_array
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to process file. Please try again.');
  }
}

/**
 * Generates an expanded summary from a file (for webhook fallback)
 * Returns only the summary without generating quiz questions
 */
export async function generateExpandedSummary(file: File): Promise<string> {
  const textContent = await extractTextContent(file);
  
  if (!textContent || textContent.trim().length === 0) {
    throw new Error('The uploaded file appears to be empty or contains no extractable text.');
  }
  
  return generateSummary(textContent);
}
