import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AppShell from '../components/layout/AppShell';
import FileUpload from '../components/FileUpload';
import SummaryCard from '../components/SummaryCard';
import QuizSection from '../components/Quiz/QuizSection';
import AskAIModule from '../components/AskAI/AskAIModule';
import { uploadFile, askAI } from '../lib/activepieces';
import type { QuizItem } from '../lib/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const { clear } = useInternetIdentity();
  
  // State for uploaded content
  const [summary, setSummary] = useState<string>('');
  const [quizArray, setQuizArray] = useState<QuizItem[]>([]);
  const [uploadedNotes, setUploadedNotes] = useState<string>('');
  const [aiAnswer, setAiAnswer] = useState<string>('');
  
  // UI state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [aiError, setAiError] = useState<string>('');

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError('');
    
    try {
      const result = await uploadFile(file);
      setSummary(result.summary);
      setQuizArray(result.quiz_array);
      
      // Read file content for AI context
      const text = await file.text();
      setUploadedNotes(text);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAskAI = async (question: string) => {
    if (!uploadedNotes) {
      setAiError('Please upload notes first to provide context for AI');
      return;
    }

    setIsAskingAI(true);
    setAiError('');
    
    try {
      const result = await askAI(question, uploadedNotes);
      setAiAnswer(result.ai_answer);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'Failed to get AI response');
    } finally {
      setIsAskingAI(false);
    }
  };

  const handleClearAI = () => {
    setAiAnswer('');
    setAiError('');
  };

  const handleDeleteQuiz = () => {
    setQuizArray([]);
  };

  return (
    <AppShell onSignOut={clear}>
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        {/* File Upload Section */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Upload Your Notes</h2>
          <FileUpload
            onFileSelect={handleFileUpload}
            isUploading={isUploading}
            disabled={isUploading}
          />
          {uploadError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
        </section>

        {/* Summary Section */}
        {summary && (
          <section>
            <h2 className="mb-4 text-2xl font-bold">Summary</h2>
            <SummaryCard summary={summary} />
          </section>
        )}

        {/* Quiz Section */}
        {quizArray.length > 0 && (
          <section>
            <h2 className="mb-4 text-2xl font-bold">Interactive Quiz</h2>
            <QuizSection
              quizArray={quizArray}
              onDelete={handleDeleteQuiz}
            />
          </section>
        )}

        {/* Ask AI Section */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Ask AI</h2>
          <AskAIModule
            onAsk={handleAskAI}
            aiAnswer={aiAnswer}
            isLoading={isAskingAI}
            error={aiError}
            onClear={handleClearAI}
            hasContext={!!uploadedNotes}
          />
        </section>
      </div>
    </AppShell>
  );
}
