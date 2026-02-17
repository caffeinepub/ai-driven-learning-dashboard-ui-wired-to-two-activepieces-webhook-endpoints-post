import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AppShell from '../components/layout/AppShell';
import FileUpload from '../components/FileUpload';
import SummaryCard from '../components/SummaryCard';
import QuizSection from '../components/Quiz/QuizSection';
import { uploadFile } from '../lib/activepieces';
import type { QuizItem } from '../lib/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';

export default function DashboardPage() {
  const { clear } = useInternetIdentity();
  
  // State for uploaded content
  const [summary, setSummary] = useState<string>('');
  const [quizArray, setQuizArray] = useState<QuizItem[]>([]);
  const [summaryFallbackInfo, setSummaryFallbackInfo] = useState<string>('');
  
  // UI state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError('');
    setSummaryFallbackInfo('');
    
    try {
      const result = await uploadFile(file);
      setSummary(result.summary);
      setQuizArray(result.quiz_array);
      
      // Handle fallback messaging
      if (result.summaryFallbackUsed) {
        setSummaryFallbackInfo('The original summary was brief, so we generated a more detailed one from your document.');
      } else if (result.summaryFallbackError) {
        setSummaryFallbackInfo(result.summaryFallbackError);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteSummary = () => {
    setSummary('');
    setSummaryFallbackInfo('');
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
            <h2 className="mb-4 text-2xl font-bold">Summary</h2>
            {summaryFallbackInfo && (
              <div className="mb-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>{summaryFallbackInfo}</AlertDescription>
                </Alert>
              </div>
            )}
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
