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
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          {/* Desktop full logo (md: 768px+) */}
          <Image
            src="/logo/sv-light-48.svg"
            alt="SenseVoice Logo"
            width={120}
            height={32}
            className="h-8 w-auto dark:hidden hidden md:block"
          />
          <Image
            src="/logo/sv-dark-48.svg"
            alt="SenseVoice Logo"
            width={120}
            height={32}
            className="h-8 w-auto hidden dark:block md:dark:block"
          />
          
          {/* Mobile: Full logo (sm) or Icon (xs) with smooth transition */}
          <Image
            src="/logo/sv-light-48.svg"
            alt="SenseVoice Logo"
            width={120}
            height={32}
            className="h-8 dark:hidden block md:hidden"
            style={{ width: 'auto', maxWidth: 'min(120px, max(32px, 25vw))' }}
          />
          <Image
            src="/logo/sv-dark-48.svg"
            alt="SenseVoice Logo"
            width={120}
            height={32}
            className="h-8 hidden dark:block md:hidden"
            style={{ width: 'auto', maxWidth: 'min(120px, max(32px, 25vw))' }}
          />
        </a>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("tts")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
          >
            TTS
          </button>
          <button
            onClick={() => scrollToSection("asr")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
          >
            ASR
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
          >
            FAQ
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
          >
            Contact
          </button>
        </div>

        {/* Mobile hamburger menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <div className="flex flex-col gap-6 mt-8">
              <button
                onClick={() => scrollToSection("tts")}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                TTS
              </button>
              <button
                onClick={() => scrollToSection("asr")}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                ASR
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                FAQ
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Contact
              </button>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          <Button
            size="sm"
            variant="outline"
            className="border border-border text-foreground hover:bg-muted rounded-lg hidden sm:inline-flex transition-colors duration-200"
            onClick={() => window.location.href = '/playground'}
          >
            Playground
          </Button>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-white">
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
                className="border border-border text-foreground hover:bg-muted rounded-lg transition-colors duration-200"
                onClick={() => router.push("/login")}
              >
                Login
              </Button> */}
              <Button
                size="sm"
                className="bg-primary hover:bg-secondary text-white rounded-lg font-semibold transition-colors duration-200"
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
