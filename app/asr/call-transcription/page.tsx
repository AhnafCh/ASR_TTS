import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CallTranscriptionPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Back Button */}
        <Link href="/#asr">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Button>
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <div className="text-5xl">☎️</div>
          <h1 className="text-4xl md:text-5xl font-bold">Call Transcription</h1>
          <p className="text-xl text-muted-foreground">
            Automatically transcribe phone calls and voice conversations with high accuracy
          </p>
        </div>

        {/* Overview Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            Transform your phone calls and voice conversations into accurate, searchable text with our advanced ASR technology. 
            Perfect for customer service, sales calls, compliance recording, and quality assurance.
          </p>
        </section>

        {/* Features Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Key Features</h2>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-accent">✓</span>
              <span className="text-muted-foreground">Real-time and batch transcription support</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent">✓</span>
              <span className="text-muted-foreground">Speaker diarization to identify different speakers</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent">✓</span>
              <span className="text-muted-foreground">High accuracy for Bengali accents and dialects</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent">✓</span>
              <span className="text-muted-foreground">Automatic punctuation and formatting</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent">✓</span>
              <span className="text-muted-foreground">Support for various audio formats and quality levels</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent">✓</span>
              <span className="text-muted-foreground">Timestamp generation for easy navigation</span>
            </li>
          </ul>
        </section>

        {/* Use Cases Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Use Cases</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-card border border-border">
              <h3 className="font-semibold mb-2">Customer Support</h3>
              <p className="text-sm text-muted-foreground">
                Transcribe support calls for training, quality assurance, and documentation
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <h3 className="font-semibold mb-2">Sales Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Analyze sales calls to improve conversion rates and customer engagement
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <h3 className="font-semibold mb-2">Compliance Recording</h3>
              <p className="text-sm text-muted-foreground">
                Maintain accurate records for regulatory compliance requirements
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <h3 className="font-semibold mb-2">Call Centers</h3>
              <p className="text-sm text-muted-foreground">
                Monitor and improve agent performance with detailed call transcripts
              </p>
            </div>
          </div>
        </section>

        {/* API Integration Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">API Integration</h2>
          <div className="bg-secondary/50 rounded-lg p-6 space-y-4">
            <p className="text-muted-foreground">
              Integrate call transcription into your system with our simple API:
            </p>
            <pre className="bg-background p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
{`// Example API call
const response = await fetch('https://api.sensevoice.ai/asr/transcribe', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    audio_url: 'https://example.com/call-recording.mp3',
    language: 'bn',
    speaker_diarization: true,
    format: 'json'
  })
});

const result = await response.json();
// Returns: { transcript, speakers, timestamps }`}
              </code>
            </pre>
          </div>
        </section>

        {/* CTA Section */}
        <section className="space-y-4 pt-8 border-t border-border">
          <h2 className="text-2xl font-semibold">Ready to get started?</h2>
          <div className="flex gap-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get API Access
            </Button>
            <Button size="lg" variant="outline">
              View Documentation
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
