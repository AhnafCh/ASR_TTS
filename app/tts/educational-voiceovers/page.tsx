"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import AudioPlayer from "@/components/audio-player"
import CTASection from "@/components/cta-section"

export default function EBookReadoutPage() {
  return (
    <div className="min-h-screen py-20 px-4 pb-32">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <Link href="/#tts">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Button>
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <h1 className="pt-4 text-3xl md:text-4xl font-bold">A Bangla Rhyme: মোদের বাংলা ভাষা</h1>
          <h2 className="text-2xl font-medium mt-8 mb-4">- সুফিয়া কামাল</h2>
          {/* <p className="text-lg text-muted-foreground">
            প্রথম অধ্যায় – লড়ায়ের আগে
          </p> */}
        </div>

        {/* Article Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none space-y-6">

<p className="leading-relaxed text-foreground text-lg italic">
মোদের দেশের সরল মানুষ<br/>
কামার কুমার জেলে চাষা<br/>
তাদের তরে সহজ হবে<br/>
মোদের বাংলা ভাষা।<br/>
<br/>
বিদেশ হতে বিজাতীয়<br/>
নানান কথার ছড়াছড়ি<br/>
আর কতকাল দেশের মানুষ<br/>
থাকবে বল সহ্য করি।<br/>
<br/>
যারা আছেন সামনে আজও<br/>
গুণী, জ্ঞানী, মনীষীরা<br/>
আমার দেশের সব মানুষের<br/>
এই বেদন বুঝুন তারা।<br/>
<br/>
ভাষার তরে প্রাণ দিল যে<br/>
কত মায়ের কোলের ছেলে<br/>
তাদের রক্ত-পিছল পথে<br/>
এবার যেন মুক্তি মেলে।<br/>
সহজ সরল বাংলা ভাষা<br/>
সব মানুষের মিটাক আশা।
</p>
                  </article>

        {/* CTA Section */}
        <CTASection />
      </div>

      {/* Audio Player */}
      <AudioPlayer audioSrc="/usecase/edu.mp3" />
    </div>
  )
}
