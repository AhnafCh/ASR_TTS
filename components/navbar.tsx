"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, LogOut, Menu, X, Mic2, Headphones, DollarSign, HelpCircle, Mail, Gamepad2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled ? "bg-white/95 dark:bg-background/85 backdrop-blur-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          {/* Desktop full logo (md: 1024px+) - Light mode */}
          <Image
            src="/logo/sv-light-48.svg"
            alt="SenseVoice Logo"
            width={100}
            height={32}
            className="h-7 md:h-8 w-auto hidden md:block dark:md:hidden"
          />
          {/* Desktop full logo (md: 1024px+) - Dark mode */}
          <Image
            src="/logo/sv-dark-48.svg"
            alt="SenseVoice Logo"
            width={100}
            height={32}
            className="h-7 md:h-8 w-auto hidden md:dark:block"
          />
          
          {/* Mobile responsive logo (< 805px) - Light mode */}
          <Image
            src="/logo/sv-light-48.svg"
            alt="SenseVoice Logo"
            width={80}
            height={24}
            className="h-6 [@media(min-width:805px)]:h-7 w-auto block md:hidden dark:hidden"
          />
          {/* Mobile responsive logo (< 805px) - Dark mode */}
          <Image
            src="/logo/sv-dark-48.svg"
            alt="SenseVoice Logo"
            width={80}
            height={24}
            className="h-6 [@media(min-width:805px)]:h-7 w-auto hidden md:hidden dark:block dark:md:hidden"
          />
        </a>

        {/* Desktop navigation */}
        <div className="hidden [@media(min-width:821px)]:flex items-center gap-2 [@media(min-width:870px)]:gap-4 lg:gap-6">
          <button
            onClick={() => scrollToSection("tts")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer min-h-11 px-1 [@media(min-width:870px)]:px-2"
          >
            TTS
          </button>
          <button
            onClick={() => scrollToSection("asr")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer min-h-11 px-1 [@media(min-width:870px)]:px-2"
          >
            ASR
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer min-h-11 px-1 [@media(min-width:870px)]:px-2"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer min-h-11 px-1 [@media(min-width:870px)]:px-2"
          >
            FAQ
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer min-h-11 px-1 [@media(min-width:870px)]:px-2"
          >
            Contact
          </button>
        </div>

        {/* Spacer to push content to the right on mobile */}
        <div className="flex-1 [@media(min-width:821px)]:hidden" />

        {/* Mobile Hamburger Menu for screens under 821px */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="[@media(min-width:821px)]:hidden min-h-11 min-w-11"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="pt-6 pb-4 px-2 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Menu</h2>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-6 px-2">
                <nav className="flex flex-col gap-1">
                  {/* Playground button in mobile menu for screens under 420px */}
                  <button
                    onClick={() => {
                      window.location.href = '/playground'
                      setIsMobileMenuOpen(false)
                    }}
                    className="[@media(min-width:420px)]:hidden flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground bg-primary/10 hover:bg-primary/20 rounded-lg transition-all duration-200 mb-2"
                  >
                    <Gamepad2 className="h-4 w-4" />
                    <span>Playground</span>
                  </button>

                  <button
                    onClick={() => scrollToSection("tts")}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-all duration-200"
                  >
                    <Mic2 className="h-4 w-4" />
                    <span>Text-to-Speech</span>
                  </button>
                  <button
                    onClick={() => scrollToSection("asr")}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-all duration-200"
                  >
                    <Headphones className="h-4 w-4" />
                    <span>Speech Recognition</span>
                  </button>
                  <button
                    onClick={() => scrollToSection("pricing")}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-all duration-200"
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Pricing</span>
                  </button>
                  <button
                    onClick={() => scrollToSection("faq")}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-all duration-200"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>FAQ</span>
                  </button>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-all duration-200"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Contact</span>
                  </button>

                  {/* Auth section in mobile menu for screens under 375px */}
                  {isAuthenticated && user ? (
                    <div className="[@media(min-width:375px)]:hidden flex flex-col gap-2 mt-6 pt-6 border-t border-border">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mb-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-primary text-white text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col overflow-hidden">
                          <p className="text-sm font-semibold truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          router.push("/profile")
                          setIsMobileMenuOpen(false)
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-all duration-200"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          router.push("/settings")
                          setIsMobileMenuOpen(false)
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-all duration-200"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          logout()
                          setIsMobileMenuOpen(false)
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all duration-200"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Log out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="[@media(min-width:375px)]:hidden mt-6 pt-6 border-t border-border">
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-lg font-semibold transition-all duration-200 shadow-md"
                        onClick={() => {
                          router.push("/signup")
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        Get Started
                      </Button>
                    </div>
                  )}
                </nav>
              </div>

              {/* Footer */}
              <div className="mt-auto border-t border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden [@media(min-width:821px)]:block">
            <ThemeToggle />
          </div>
          <Button
            size="sm"
            variant="outline"
            className="hidden [@media(min-width:420px)]:inline-flex border border-border text-foreground hover:bg-muted rounded-lg transition-colors duration-200 min-h-9"
            onClick={() => window.location.href = '/playground'}
          >
            Playground
          </Button>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full [@media(max-width:374px)]:hidden">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-white text-xs sm:text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              {/* <Button
                size="sm"
                variant="outline"
                className="border border-border text-foreground hover:bg-muted rounded-lg transition-colors duration-200 min-h-9"
                onClick={() => router.push("/login")}
              >
                Login
              </Button> */}
              <Button
                size="sm"
                className="[@media(max-width:374px)]:hidden bg-primary hover:bg-secondary text-white rounded-lg font-semibold transition-colors duration-200 min-h-9"
                onClick={() => router.push("/signup")}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
