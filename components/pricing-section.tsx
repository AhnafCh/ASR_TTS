"use client"

import { Button } from "@/components/ui/button"
import { Check, Building2, Mail, Phone, Copy } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function PricingSection() {
  const { toast } = useToast()
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard`,
      })
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }
  const scrollToContact = () => {
    const element = document.getElementById("contact")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const features = [
    "Custom API Integration",
    "Unlimited API Calls",
    "Premium Voice Models",
    "24/7 Technical Support",
    "Service Level Agreement (SLA)",
    "Dedicated Account Manager",
    "Custom Voice Training",
    "On-Premise Deployment Options",
  ]

  return (
    <section id="pricing" className="py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 bg-muted scroll-mt-20">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <p className="text-primary text-xs sm:text-sm font-semibold uppercase mb-3 sm:mb-4">Pricing</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-foreground">
            Enterprise <span className="text-primary">Solutions</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4">
            Tailored pricing for businesses. Contact us for a custom quote based on your specific requirements.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-4xl mx-auto">
          <div className="card-gradient dark:bg-card border border-border rounded-lg p-6 sm:p-8 md:p-12 elevation-2 card-hover-lift">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
              {/* Left side - Info */}
              <div className="space-y-5 sm:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  <span className="text-primary text-xs sm:text-sm font-semibold">B2B Only</span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">Enterprise Plan</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    Custom pricing based on your usage, requirements, and scale
                  </p>
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 sm:pt-4">
                  <Button 
                    onClick={scrollToContact}
                    size="lg"
                    className="ai-gradient-button text-white font-semibold rounded-lg shadow-lg w-full md:w-auto min-h-11"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Request Quote
                  </Button>
                </div>
              </div>

              {/* Right side - Contact Info */}
              <div className="space-y-4 sm:space-y-6">
                <div className="card-gradient dark:bg-card border border-border rounded-lg p-5 sm:p-6 elevation-1">
                  <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-foreground">Get in Touch</h4>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">Email</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs sm:text-sm text-muted-foreground break-all flex-1">enterprise@sensevoice.com</p>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 shrink-0"
                            onClick={() => copyToClipboard("enterprise@sensevoice.com", "Email")}
                          >
                            <Copy className={`h-3.5 w-3.5 ${copiedField === "Email" ? "text-green-500" : "text-muted-foreground"}`} />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">Phone</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs sm:text-sm text-muted-foreground flex-1">+880 1XXX-XXXXXX</p>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 shrink-0"
                            onClick={() => copyToClipboard("+880 1XXX-XXXXXX", "Phone")}
                          >
                            <Copy className={`h-3.5 w-3.5 ${copiedField === "Phone" ? "text-green-500" : "text-muted-foreground"}`} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-gradient dark:bg-card border border-border rounded-lg p-5 sm:p-6 elevation-1">
                  <h4 className="font-semibold text-sm mb-2.5 sm:mb-3 text-foreground">What's Included</h4>
                  <ul className="text-xs sm:text-sm text-muted-foreground space-y-1.5 sm:space-y-2">
                    <li>• Volume-based discounts</li>
                    <li>• Flexible payment terms</li>
                    <li>• No hidden fees</li>
                    <li>• Monthly or annual billing</li>
                  </ul>
                </div>

                <div className="text-center p-5 sm:p-6 card-gradient dark:bg-card border border-border rounded-lg elevation-1">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">Trusted by</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">50+ Enterprises</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Hint */}
        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <p className="text-xs sm:text-sm text-muted-foreground px-4">
            Have questions? <button onClick={scrollToContact} className="text-primary hover:text-secondary font-medium transition-colors duration-200 min-h-11">Contact our sales team</button>
          </p>
        </div>
      </div>
    </section>
  )
}
