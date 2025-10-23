import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function MeetingMinutesPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <Link href="/#asr">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Button>
        </Link>

        <div className="space-y-4">
          <div className="text-5xl">📋</div>
          <h1 className="text-4xl md:text-5xl font-bold">Meeting Minutes</h1>
          <p className="text-xl text-muted-foreground">
            Generate accurate meeting transcripts and summaries automatically
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Coming Soon</h2>
          <p className="text-muted-foreground leading-relaxed">
            This service page is currently under development. Stay tuned for detailed information about our Meeting Minutes service.
          </p>
        </section>

        <section className="space-y-4 pt-8 border-t border-border">
          <h2 className="text-2xl font-semibold">Interested in this service?</h2>
          <div className="flex gap-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Contact Sales
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
