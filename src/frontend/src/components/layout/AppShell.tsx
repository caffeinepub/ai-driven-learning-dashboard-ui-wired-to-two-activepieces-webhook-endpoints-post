import { Button } from '@/components/ui/button';
import { GraduationCap, LogOut } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  onSignOut: () => void;
}

export default function AppShell({ children, onSignOut }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary p-2">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">AI Learning Coach</h1>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </header>

      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      <footer className="border-t bg-card py-8">
        <div className="container px-4 text-center text-sm text-muted-foreground">
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
        </div>
      </footer>
    </div>
  );
}
