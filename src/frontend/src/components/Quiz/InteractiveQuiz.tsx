import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { QuizItem } from '../../lib/types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface InteractiveQuizProps {
  quizArray: QuizItem[];
}

interface QuestionState {
  selectedOption: string | null;
  isCorrect: boolean | null;
}

export default function InteractiveQuiz({ quizArray }: InteractiveQuizProps) {
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>({});

  const handleOptionClick = (questionIndex: number, option: string, correctAnswer: string) => {
    const isCorrect = option === correctAnswer;
    setQuestionStates((prev) => ({
      ...prev,
      [questionIndex]: {
        selectedOption: option,
        isCorrect,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {quizArray.map((quiz, index) => {
        const state = questionStates[index];
        
        return (
          <Card key={index} className="p-6">
            <div className="mb-4">
              <div className="mb-2 flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <h3 className="pt-1 text-lg font-semibold leading-tight">
                  {quiz.question}
                </h3>
              </div>
            </div>

            <div className="space-y-2">
              {quiz.options.map((option, optionIndex) => {
                const isSelected = state?.selectedOption === option;
                const isCorrectOption = option === quiz.correct_answer;
                const showFeedback = isSelected && state;

                let buttonVariant: 'outline' | 'default' | 'destructive' = 'outline';
                let buttonClass = '';

                if (showFeedback) {
                  if (state.isCorrect) {
                    buttonVariant = 'default';
                    buttonClass = 'bg-green-600 hover:bg-green-700 border-green-600 text-white';
                  } else {
                    buttonVariant = 'destructive';
                  }
                }

                return (
                  <Button
                    key={optionIndex}
                    variant={buttonVariant}
                    className={`w-full justify-start text-left h-auto py-3 px-4 ${buttonClass}`}
                    onClick={() => handleOptionClick(index, option, quiz.correct_answer)}
                    disabled={!!state}
                  >
                    <span className="mr-3 font-bold">
                      {String.fromCharCode(65 + optionIndex)}.
                    </span>
                    <span className="flex-1">{option}</span>
                    {showFeedback && (
                      <span className="ml-2 flex items-center gap-1">
                        {state.isCorrect ? (
                          <>
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="font-semibold">Correct Answer</span>
                          </>
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
