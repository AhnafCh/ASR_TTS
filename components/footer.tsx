import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border py-10 sm:py-12 px-4 sm:px-6 md:px-8 bg-white dark:bg-background">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-12">
          {/* Brand */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <Image
                src="/logo/sv-light-48.svg"
                alt="SenseVoice Logo"
                width={130}
                height={36}
                className="h-8 sm:h-9 w-auto dark:hidden"
              />
              <Image
                src="/logo/sv-dark-48.svg"
                alt="SenseVoice Logo"
                width={130}
                height={36}
                className="h-8 sm:h-9 w-auto hidden dark:block"
              />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Advanced AI voice technology for Bengali language processing.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors duration-200 inline-block min-h-11 py-1">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors duration-200 inline-block min-h-11 py-1">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors duration-200 inline-block min-h-11 py-1">
                  API Docs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors duration-200 inline-block min-h-11 py-1">
                  Playground
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors duration-200 inline-block min-h-11 py-1">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors duration-200 inline-block min-h-11 py-1">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors duration-200 inline-block min-h-11 py-1">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors duration-200 inline-block min-h-11 py-1">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors duration-200 inline-block min-h-11 py-1">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors duration-200 inline-block min-h-11 py-1">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors duration-200 inline-block min-h-11 py-1">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors duration-200 inline-block min-h-11 py-1">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-muted-foreground">
          <p>&copy; 2025 SenseVoice. All rights reserved.</p>
          <div className="flex gap-4 sm:gap-6">
            <a href="#" className="hover:text-primary transition-colors duration-200 min-h-11 inline-flex items-center">
              Twitter
            </a>
            <a href="#" className="hover:text-primary transition-colors duration-200 min-h-11 inline-flex items-center">
              LinkedIn
            </a>
            <a href="#" className="hover:text-primary transition-colors duration-200 min-h-11 inline-flex items-center">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
