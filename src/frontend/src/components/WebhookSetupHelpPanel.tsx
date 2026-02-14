import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info, Terminal, Rocket, Check, X } from 'lucide-react';
import { 
  saveWebhookOverride, 
  clearWebhookOverride, 
  getWebhookOverride 
} from '@/lib/webhookOverride';

interface WebhookSetupHelpPanelProps {
  onWebhookSaved?: () => void;
  onWebhookCleared?: () => void;
}

export default function WebhookSetupHelpPanel({ 
  onWebhookSaved, 
  onWebhookCleared 
}: WebhookSetupHelpPanelProps) {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [validationError, setValidationError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const savedUrl = getWebhookOverride();

  const handleSave = () => {
    setValidationError('');
    setSaveSuccess(false);

    const result = saveWebhookOverride(webhookUrl);
    
    if (result.success) {
      setSaveSuccess(true);
      setWebhookUrl('');
      setTimeout(() => setSaveSuccess(false), 3000);
      onWebhookSaved?.();
    } else {
      setValidationError(result.error || 'Failed to save webhook URL');
    }
  };

  const handleClear = () => {
    clearWebhookOverride();
    setWebhookUrl('');
    setValidationError('');
    setSaveSuccess(false);
    onWebhookCleared?.();
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Info className="h-5 w-5 text-primary" />
          Webhook Configuration Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertDescription>
            This application requires a webhook URL to process notes and answer questions. 
            You can configure it directly below, or set it in your environment variables.
          </AlertDescription>
        </Alert>

        {/* In-App Configuration */}
        <div className="space-y-3 rounded-lg border bg-background p-4">
          <h4 className="flex items-center gap-2 font-semibold text-sm">
            <Rocket className="h-4 w-4 text-primary" />
            Configure Webhook URL (Recommended)
          </h4>
          
          {savedUrl ? (
            <div className="space-y-3">
              <Alert className="border-green-500/50 bg-green-500/10">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm">
                  <strong>Webhook URL is configured!</strong>
                  <div className="mt-1 font-mono text-xs break-all">{savedUrl}</div>
                </AlertDescription>
              </Alert>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClear}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear Saved URL
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Paste your webhook URL here:</Label>
                <Input
                  id="webhook-url"
                  type="text"
                  placeholder="https://cloud.activepieces.com/api/v1/webhooks/..."
                  value={webhookUrl}
                  onChange={(e) => {
                    setWebhookUrl(e.target.value);
                    setValidationError('');
                  }}
                  className="font-mono text-sm"
                />
              </div>

              {validationError && (
                <Alert variant="destructive">
                  <AlertDescription className="text-sm">{validationError}</AlertDescription>
                </Alert>
              )}

              {saveSuccess && (
                <Alert className="border-green-500/50 bg-green-500/10">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-sm">
                    Webhook URL saved successfully! You can now upload notes and ask AI questions.
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleSave}
                disabled={!webhookUrl.trim()}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                Save Webhook URL
              </Button>
            </div>
          )}

          <div className="rounded-md bg-muted p-3 text-xs">
            <p className="mb-2 font-semibold">Example webhook URL:</p>
            <code className="break-all">
              https://cloud.activepieces.com/api/v1/webhooks/arB5MIDx32mR1vdmBIC0r/sync
            </code>
          </div>
        </div>

        {/* Alternative: Environment Variables */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 font-semibold text-sm text-muted-foreground">
              <Terminal className="h-4 w-4" />
              Alternative: Environment Variables
            </h4>
            <p className="text-xs text-muted-foreground">
              If you have access to your hosting environment's settings, you can also configure 
              the webhook URL using the <code className="rounded bg-muted px-1 py-0.5">VITE_WEBHOOK_URL</code> environment 
              variable. Note that this requires rebuilding and redeploying your application.
            </p>
          </div>

          {/* Additional Info */}
          <div className="rounded-md border border-muted bg-background p-3 text-xs text-muted-foreground">
            <p className="mb-2">
              <strong>Note:</strong> The same webhook URL is used for both file processing and AI questions. 
              The application automatically includes an "action" field in each request to distinguish between operations.
            </p>
            <p>
              For more details, see <code className="rounded bg-muted px-1 py-0.5">frontend/WEBHOOK_SETUP.md</code> in your project.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
