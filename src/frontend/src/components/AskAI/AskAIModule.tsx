import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Trash2, AlertCircle, Loader2 } from 'lucide-react';

interface AskAIModuleProps {
  onAsk: (question: string) => void;
  aiAnswer: string;
  isLoading: boolean;
  error: string;
  onClear: () => void;
  hasContext: boolean;
}

export default function AskAIModule({
  onAsk,
  aiAnswer,
  isLoading,
  error,
  onClear,
  hasContext,
}: AskAIModuleProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = () => {
    if (question.trim()) {
      onAsk(question.trim());
    }
  };

  const handleClear = () => {
    setQuestion('');
    onClear();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Ask AI About Your Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasContext && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please upload your notes first to provide context for AI questions.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Textarea
            placeholder="Ask a question about your notes..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isLoading || !hasContext}
            rows={3}
            className="resize-none"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={!question.trim() || isLoading || !hasContext}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AI is thinking...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Ask AI
                </>
              )}
            </Button>
            {(aiAnswer || question) && (
              <Button
                variant="outline"
                onClick={handleClear}
                disabled={isLoading}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {aiAnswer && (
          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="mb-2 font-semibold text-sm text-muted-foreground">AI Response:</h4>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="whitespace-pre-wrap leading-relaxed">{aiAnswer}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
