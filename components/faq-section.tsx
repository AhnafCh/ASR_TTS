"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What are TTS and ASR, and how do they benefit my business?",
    answer: "TTS (Text-to-Speech) converts written text into spoken audio, while ASR (Automatic Speech Recognition) converts spoken audio into written text. For your business, these technologies can revolutionize customer interactions, automate processes, and enhance accessibility, especially in the Bangla language."
  },
  {
    question: "Why should I choose your company's TTS and ASR models for Bangla?",
    answer: "Our models are specifically developed for their excellence in the Bangla language. We prioritize accuracy, natural-sounding speech (for TTS), and robust recognition (for ASR) to ensure that your business receives the highest quality service tailored to the nuances of Bangla."
  },
  {
    question: "What types of businesses can benefit from your TTS and ASR services?",
    answer: "Our services are designed for a wide range of businesses. This includes, but is not limited to, call centers, media companies, educational platforms, customer service departments, and any organization looking to leverage voice technology for improved efficiency and customer engagement in the Bangla-speaking market."
  },
  {
    question: "How can I integrate your TTS and ASR models into my existing systems?",
    answer: "We offer flexible integration options, including APIs and SDKs, to ensure seamless adoption with your current business infrastructure. Our team can provide technical support and guidance throughout the integration process."
  },
  {
    question: "Can your TTS model generate different voices or speaking styles in Bangla?",
    answer: "Yes, our TTS model offers a variety of voices and speaking styles to choose from, allowing you to customize the output to match your brand's voice and specific use cases. We can also discuss custom voice development options."
  },
  {
    question: "How accurate is your ASR model for spoken Bangla, including different dialects and accents?",
    answer: "Our ASR model is trained on extensive Bangla datasets to achieve high accuracy across various dialects and accents commonly found in the region. We continuously update and refine our models to ensure optimal performance."
  },
  {
    question: "What are some practical applications for your TTS and ASR services in a business setting?",
    answer: "Practical applications include automated customer support (chatbots with voice capabilities), interactive voice response (IVR) systems, content narration for e-learning or audiobooks, voice-controlled applications, and transcription services for meetings or interviews."
  },
  {
    question: "Is there a limit to the amount of text or audio I can process with your services?",
    answer: "We offer various service tiers with different processing capacities to meet the diverse needs of our clients. Please contact our sales team to discuss your specific requirements and find the most suitable plan for your business."
  },
  {
    question: "What kind of support do you offer for businesses using your TTS and ASR models?",
    answer: "We provide comprehensive technical support, including documentation, troubleshooting assistance, and dedicated account management. Our team is committed to ensuring your success with our services."
  },
  {
    question: "How can I get started with your TTS and ASR services for my business?",
    answer: "To get started, please contact our sales team through our website. We'll be happy to discuss your specific needs, provide a demonstration, and help you choose the best solution for your business."
  }
]

export function FaqSection() {
  return (
    <section id="faq" className="py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 bg-muted/30 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-3 sm:mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4">
            Find answers to common questions about our TTS and ASR services for Bangla language
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card border border-border rounded-lg px-4 sm:px-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-5 min-h-11">
                <span className="font-semibold text-foreground pr-3 sm:pr-4 text-sm sm:text-base">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-4 sm:pb-5 text-sm sm:text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* CTA */}
        <div className="mt-8 sm:mt-10 md:mt-12 text-center">
          <p className="text-muted-foreground mb-4 text-sm sm:text-base px-4">
            Still have questions?
          </p>
        </div>
      </div>
    </section>
  )
}
