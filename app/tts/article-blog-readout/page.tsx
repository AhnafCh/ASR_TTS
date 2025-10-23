import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ArticleBlogReadoutPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Back Button */}
        <Link href="/#tts">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Button>
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <div className="text-5xl">📰</div>
          <h1 className="text-4xl md:text-5xl font-bold">Article & Blog Readout</h1>
          <p className="text-xl text-muted-foreground">
            Convert written content into natural-sounding audio for accessibility and engagement
          </p>
        </div>

        {/* Overview Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            Transform your articles and blog posts into engaging audio content with our advanced Text-to-Speech technology. 
            Perfect for accessibility, reaching audio-first audiences, and providing an alternative content consumption method.
          </p>
        </section>

        {/* Features Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Key Features</h2>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-accent">✓</span>
              <span className="text-muted-foreground">Natural-sounding Bengali voice with proper pronunciation</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent">✓</span>
              <span className="text-muted-foreground">Support for multiple voice styles and tones</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent">✓</span>
              <span className="text-muted-foreground">Automatic text formatting and punctuation handling</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent">✓</span>
              <span className="text-muted-foreground">High-quality audio output in various formats</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent">✓</span>
              <span className="text-muted-foreground">Fast processing for real-time audio generation</span>
            </li>
          </ul>
        </section>

        {/* Use Cases Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Use Cases</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-card border border-border">
              <h3 className="font-semibold mb-2">News Websites</h3>
              <p className="text-sm text-muted-foreground">
                Provide audio versions of news articles for commuters and busy readers
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <h3 className="font-semibold mb-2">Content Platforms</h3>
              <p className="text-sm text-muted-foreground">
                Offer audio playback options for blog posts and long-form content
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <h3 className="font-semibold mb-2">Accessibility</h3>
              <p className="text-sm text-muted-foreground">
                Make content accessible to visually impaired users
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <h3 className="font-semibold mb-2">Education</h3>
              <p className="text-sm text-muted-foreground">
                Convert educational materials into audio for better learning
              </p>
            </div>
          </div>
        </section>

        {/* API Integration Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">API Integration</h2>
          <div className="bg-secondary/50 rounded-lg p-6 space-y-4">
            <p className="text-muted-foreground">
              Integrate our TTS API into your platform with just a few lines of code:
            </p>
            <pre className="bg-background p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
{`// Example API call
const response = await fetch('https://api.sensevoice.ai/tts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'আপনার টেক্সট এখানে লিখুন',
    voice: 'bengali-female-1',
    format: 'mp3'
  })
});

const audio = await response.blob();`}
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
