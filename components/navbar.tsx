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
import { User, Settings, LogOut, Menu, X } from "lucide-react"
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
        isScrolled ? "bg-white/95 dark:bg-background/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
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

        {/* Hamburger menu on LEFT for screens 420px-820px */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="[@media(max-width:419px)]:hidden [@media(min-width:821px)]:hidden min-h-11 min-w-11"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <div className="flex flex-col gap-6 mt-8">
              {/* Theme Toggle in mobile menu */}
              <div className="flex items-center justify-between px-2 py-2 border-b border-border">
                <span className="text-sm font-medium text-foreground">Theme</span>
                <ThemeToggle />
              </div>
              
              <button
                onClick={() => scrollToSection("tts")}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors text-left min-h-11 px-2"
              >
                TTS
              </button>
              <button
                onClick={() => scrollToSection("asr")}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors text-left min-h-11 px-2"
              >
                ASR
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors text-left min-h-11 px-2"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors text-left min-h-11 px-2"
              >
                FAQ
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors text-left min-h-11 px-2"
              >
                Contact
              </button>
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

          {/* Hamburger menu on RIGHT for screens under 420px only */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="[@media(min-width:420px)]:hidden min-h-11 min-w-11"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <div className="flex flex-col gap-6 mt-8">
                {/* Theme Toggle in mobile menu */}
                <div className="flex items-center justify-between px-2 py-2 border-b border-border">
                  <span className="text-sm font-medium text-foreground">Theme</span>
                  <ThemeToggle />
                </div>
                
                {/* Playground button in mobile menu for screens under 420px */}
                <button
                  onClick={() => {
                    window.location.href = '/playground'
                    setIsMobileMenuOpen(false)
                  }}
                  className="[@media(min-width:420px)]:hidden text-lg font-medium text-muted-foreground hover:text-foreground transition-colors text-left min-h-11 px-2"
                >
                  Playground
                </button>
                
                <button
                  onClick={() => scrollToSection("tts")}
                  className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors text-left min-h-11 px-2"
                >
                  TTS
                </button>
                <button
                  onClick={() => scrollToSection("asr")}
                  className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors text-left min-h-11 px-2"
                >
                  ASR
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors text-left min-h-11 px-2"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors text-left min-h-11 px-2"
                >
                  FAQ
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors text-left min-h-11 px-2"
                >
                  Contact
                </button>

                {/* Auth buttons in mobile menu for screens under 375px */}
                {isAuthenticated && user ? (
                  <div className="[@media(min-width:375px)]:hidden flex flex-col gap-3 mt-4 px-2">
                    <div className="flex items-center gap-3 p-2 border border-border rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-primary text-white text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push("/profile")
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push("/settings")
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 dark:text-red-400"
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <div className="[@media(min-width:375px)]:hidden mt-4 px-2">
                    <Button
                      size="sm"
                      className="w-full bg-primary hover:bg-secondary text-white rounded-lg font-semibold transition-colors duration-200 min-h-9"
                      onClick={() => {
                        router.push("/signup")
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

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
