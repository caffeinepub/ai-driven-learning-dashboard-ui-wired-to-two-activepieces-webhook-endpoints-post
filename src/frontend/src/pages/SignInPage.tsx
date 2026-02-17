import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

export default function SignInPage() {
  const { login, isLoggingIn, isLoginError, loginError } = useInternetIdentity();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-primary p-3">
          <GraduationCap className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">AI Learning Coach</h1>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign in to continue</CardTitle>
          <CardDescription>
            Access your personalized learning dashboard with AI-powered summaries and quizzes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoginError && loginError && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {loginError.message}
            </div>
          )}
          
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full"
            size="lg"
          >
            {isLoggingIn ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Connecting...
              </>
            ) : (
              'Sign in with Internet Identity'
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Secure authentication powered by the Internet Computer
          </p>
        </CardContent>
      </Card>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname : 'ai-learning-coach'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            caffeine.ai
          </a>
        </p>
        <p className="mt-1">© {new Date().getFullYear()} AI Learning Coach</p>
      </footer>
    </div>
  );
}
