import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SummaryCardProps {
  summary: string;
  onDelete: () => void;
}

export default function SummaryCard({ summary, onDelete }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="text-lg">📄</span>
            Summary
          </span>
          <CardAction>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              aria-label="Delete summary"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardAction>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap break-words">
            {summary}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
