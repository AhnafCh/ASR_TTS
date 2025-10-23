import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewsAnchorPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <Link href="/#cloning">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Button>
        </Link>
        <div className="space-y-4">
          <div className="text-5xl">📡</div>
          <h1 className="text-4xl md:text-5xl font-bold">News Anchor Generation</h1>
          <p className="text-xl text-muted-foreground">
            Automated news anchor voice generation
          </p>
        </div>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Coming Soon</h2>
          <p className="text-muted-foreground leading-relaxed">
            This service page is currently under development.
          </p>
        </section>
      </div>
    </div>
  )
}
