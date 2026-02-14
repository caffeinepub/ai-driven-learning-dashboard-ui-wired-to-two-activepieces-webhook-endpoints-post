import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import InteractiveQuiz from './InteractiveQuiz';
import type { QuizItem } from '../../lib/types';
import { Eye, EyeOff, Trash2 } from 'lucide-react';

interface QuizSectionProps {
  quizArray: QuizItem[];
  onDelete: () => void;
}

export default function QuizSection({ quizArray, onDelete }: QuizSectionProps) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Quiz ({quizArray.length} questions)</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVisible(!isVisible)}
              className="gap-2"
            >
              {isVisible ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  View
                </>
              )}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      {isVisible && (
        <CardContent>
          <InteractiveQuiz quizArray={quizArray} />
        </CardContent>
      )}
    </Card>
  );
}
