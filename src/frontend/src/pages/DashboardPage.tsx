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
import { ENABLE_ASK_AI_SECTION } from '../config/features';

export default function DashboardPage() {
  const { clear } = useInternetIdentity();
  
  // State for uploaded content
  const [summary, setSummary] = useState<string>('');
  const [quizArray, setQuizArray] = useState<QuizItem[]>([]);
  
  // UI state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  
  // Ask AI state
  const [aiAnswer, setAiAnswer] = useState<string>('');
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [askAIError, setAskAIError] = useState<string>('');

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError('');
    setSummary('');
    setQuizArray([]);
    
    try {
      const result = await uploadFile(file);
      setSummary(result.summary);
      setQuizArray(result.quiz_array);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteSummary = () => {
    setSummary('');
  };

  const handleDeleteQuiz = () => {
    setQuizArray([]);
  };

  const handleAskAI = async (question: string) => {
    if (!summary) {
      setAskAIError('Please upload notes first to provide context.');
      return;
    }

    setIsAskingAI(true);
    setAskAIError('');
    setAiAnswer('');

    try {
      const response = await askAI(question, summary);
      setAiAnswer(response.ai_answer);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get AI response';
      setAskAIError(errorMessage);
    } finally {
      setIsAskingAI(false);
    }
  };

  const handleClearAI = () => {
    setAiAnswer('');
    setAskAIError('');
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
            <div className="mt-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            </div>
          )}
        </section>

        {/* Summary Section */}
        {summary && (
          <section>
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-2xl font-bold">Summary</h2>
            </div>
            <SummaryCard summary={summary} onDelete={handleDeleteSummary} />
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

        {/* Ask AI Section - Conditionally rendered based on feature flag */}
        {ENABLE_ASK_AI_SECTION && summary && (
          <section>
            <AskAIModule
              onAsk={handleAskAI}
              aiAnswer={aiAnswer}
              isLoading={isAskingAI}
              error={askAIError}
              onClear={handleClearAI}
              hasContext={!!summary}
            />
          </section>
        )}
      </div>
    </AppShell>
  );
}
