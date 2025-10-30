import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CTASection() {
  return (
    <div className="mt-12 pt-8 border-t border-border">
      <div className="bg-linear-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-2xl p-8 text-center space-y-4">
        <h3 className="text-2xl font-bold text-foreground">Impressed by our AI voice technology?</h3>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Experience natural, lifelike text-to-speech that brings your content to life. 
          Contact our sales team to learn how we can integrate this technology into your platform.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/#contact">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-8">
              Contact Sales
            </Button>
          </Link>
          <Link href="/playground">
            <Button size="lg" variant="outline" className="font-semibold px-8">
              Try It Yourself
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
