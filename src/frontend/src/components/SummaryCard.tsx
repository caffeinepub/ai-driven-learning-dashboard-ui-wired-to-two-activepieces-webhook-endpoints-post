import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Trash2 } from 'lucide-react';

interface SummaryCardProps {
  summary: string;
  onDelete?: () => void;
}

export default function SummaryCard({ summary, onDelete }: SummaryCardProps) {
  if (!summary) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p>No summary available. Upload your notes to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Summary
          </CardTitle>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              aria-label="Delete summary"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="whitespace-pre-wrap break-words leading-relaxed">{summary}</p>
        </div>
      </CardContent>
    </Card>
  );
}
