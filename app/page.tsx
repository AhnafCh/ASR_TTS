import { Navbar } from "@/components/navbar"
import { FloatingNavbar } from "@/components/floating-navbar"
import { Hero } from "@/components/hero"
import { Clients } from "@/components/clients"
import { TtsSection } from "@/components/tts-section"
import { AsrSection } from "@/components/asr-section"
import { PricingSection } from "@/components/pricing-section"
import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <FloatingNavbar />
      <main className="min-h-screen bg-background">
        <Hero />
        <Clients />
        <TtsSection />
        <AsrSection />
        <PricingSection />
        <ContactForm />
        <Footer />
      </main>
    </>
  )
}
