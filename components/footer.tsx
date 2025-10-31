import Image from "next/image"
import { Twitter, Linkedin, Github, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-linear-to-br from-white via-primary/5 to-white dark:from-background dark:via-primary/5 dark:to-background overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-50" />
      
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-16">
        {/* Row 1: Brand Section - Center aligned */}
        <div className="text-center space-y-4 mb-8 sm:mb-10">
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/logo/sv-light-48.svg"
              alt="SenseVoice Logo"
              width={160}
              height={44}
              className="h-10 sm:h-11 w-auto dark:hidden"
            />
            <Image
              src="/logo/sv-dark-48.svg"
              alt="SenseVoice Logo"
              width={160}
              height={44}
              className="h-10 sm:h-11 w-auto hidden dark:block"
            />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Advanced AI voice technology for Bengali language processing. Transform your audio experience with cutting-edge speech recognition and synthesis.
          </p>
        </div>

        {/* Row 2: Product, Legal, Contacts */}
        <div className="grid grid-cols-1 max-[425px]:gap-6 min-[426px]:grid-cols-3 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-10">
          {/* Product */}
          <div className="space-y-3">
            <h3 className="font-bold text-foreground text-sm mb-3 max-[425px]:text-center">Product</h3>
            <ul className="space-y-2 max-[425px]:text-center">
              <li>
                <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-block">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-block">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-block">
                  API Docs
                </a>
              </li>
              <li>
                <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-block">
                  Playground
                </a>
              </li>
              <li>
                <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-block">
                  Use Cases
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="font-bold text-foreground text-sm mb-3 max-[425px]:text-center">Legal</h3>
            <ul className="space-y-2 max-[425px]:text-center">
              <li>
                <a href="/privacy-policy" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-block">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-conditions" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-block">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="space-y-3">
            <h3 className="font-bold text-foreground text-sm mb-3 max-[425px]:text-center">Contacts</h3>
            <ul className="space-y-2.5">
              <li className="flex max-[425px]:flex-col max-[425px]:items-center items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 shrink-0 text-primary" />
                <span className="leading-snug max-[425px]:text-center">Suvastu Mahbuba Heights, House: 82, Road: 23, Block: A, Banani, Dhaka - 1213, Bangladesh</span>
              </li>
              <li className="flex max-[425px]:justify-center items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-primary" />
                <a href="tel:+8801234567890" className="hover:text-primary transition-colors duration-200">
                  +880 123 456 7890
                </a>
              </li>
              <li className="flex max-[425px]:justify-center items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-primary" />
                <a href="mailto:info@sensevoice.ai" className="hover:text-primary transition-colors duration-200 break-all">
                  info@sensevoice.ai
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Social Icons */}
        <div className="border-t border-border pt-5 sm:pt-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()} SenseVoice. All rights reserved.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex gap-2.5 sm:gap-3">
              <a 
                href="#" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-card border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-card border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-card border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-card border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
