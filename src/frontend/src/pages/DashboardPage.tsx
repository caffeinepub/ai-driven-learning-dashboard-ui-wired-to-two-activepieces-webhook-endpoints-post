import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AppShell from '../components/layout/AppShell';
import FileUpload from '../components/FileUpload';
import SummaryCard from '../components/SummaryCard';
import QuizSection from '../components/Quiz/QuizSection';
import WebhookSetupHelpPanel from '../components/WebhookSetupHelpPanel';
import { uploadFile } from '../lib/activepieces';
import { MISSING_WEBHOOK_ERROR } from '../lib/env';
import type { QuizItem } from '../lib/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const { clear } = useInternetIdentity();
  
  // State for uploaded content
  const [summary, setSummary] = useState<string>('');
  const [quizArray, setQuizArray] = useState<QuizItem[]>([]);
  
  // UI state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  const isUploadWebhookError = uploadError === MISSING_WEBHOOK_ERROR;

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError('');
    
    try {
      const result = await uploadFile(file);
      setSummary(result.summary);
      setQuizArray(result.quiz_array);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload file');
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

  const handleWebhookSaved = () => {
    // Clear errors when webhook is saved so user can retry
    setUploadError('');
  };

  const handleWebhookCleared = () => {
    // When webhook is cleared, show the configuration error again
    setUploadError(MISSING_WEBHOOK_ERROR);
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
            <div className="mt-4 space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
              {isUploadWebhookError && (
                <WebhookSetupHelpPanel 
                  onWebhookSaved={handleWebhookSaved}
                  onWebhookCleared={handleWebhookCleared}
                />
              )}
            </div>
          )}
        </section>

        {/* Summary Section */}
        {summary && (
          <section>
            <h2 className="mb-4 text-2xl font-bold">Summary</h2>
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
      </div>
    </AppShell>
  );
}
