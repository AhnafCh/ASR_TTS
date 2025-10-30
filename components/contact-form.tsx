"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Reset form
    setFormData({ name: "", email: "", company: "", message: "" })
  }

  return (
    <section id="contact" className="py-12 px-4 border-t border-border scroll-mt-20 bg-white dark:bg-background">
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Get in Touch</h2>
          <p className="text-muted-foreground text-1xl leading-relaxed">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 card-gradient dark:bg-card border border-border rounded-lg p-8 elevation-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="bg-white dark:bg-background border-border text-foreground placeholder:text-muted-foreground focus-glow rounded-lg transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="bg-white dark:bg-background border-border text-foreground placeholder:text-muted-foreground focus-glow rounded-lg transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium text-foreground">
              Company
            </label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Your company"
              className="bg-white dark:bg-background border-border text-foreground placeholder:text-muted-foreground focus-glow rounded-lg transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-foreground">
              Message (Optional)
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your project..."
              rows={5}
              className="bg-white dark:bg-background border-border text-foreground placeholder:text-muted-foreground focus-glow rounded-lg transition-all duration-200 resize-none"
            />
          </div>

          <Button type="submit" className="w-full ai-gradient-button text-white rounded-lg shadow-lg">
            Send Message
          </Button>
        </form>
      </div>
    </section>
  )
}
