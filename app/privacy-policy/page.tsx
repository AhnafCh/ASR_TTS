export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-linear-to-br from-white via-primary/5 to-white dark:from-background dark:via-primary/5 dark:to-background">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-sm sm:prose-base max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Introduction</h2>
            <p className="leading-relaxed">
              Welcome to SenseVoice. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our 
              website and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Information We Collect</h2>
            <p className="leading-relaxed mb-4">
              We may collect, use, store and transfer different kinds of personal data about you which we have 
              grouped together as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
              <li><strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location.</li>
              <li><strong>Usage Data:</strong> includes information about how you use our website and services.</li>
              <li><strong>Audio Data:</strong> includes voice recordings submitted for processing through our AI services.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">How We Use Your Information</h2>
            <p className="leading-relaxed mb-4">
              We will only use your personal data when the law allows us to. Most commonly, we will use your 
              personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and improve our AI voice processing services</li>
              <li>To process and respond to your inquiries and support requests</li>
              <li>To send you service-related communications and updates</li>
              <li>To analyze and improve our website and services</li>
              <li>To comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Data Security</h2>
            <p className="leading-relaxed">
              We have put in place appropriate security measures to prevent your personal data from being accidentally 
              lost, used or accessed in an unauthorized way, altered or disclosed. We use industry-standard encryption 
              and security protocols to protect your data during transmission and storage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Data Retention</h2>
            <p className="leading-relaxed">
              We will only retain your personal data for as long as necessary to fulfill the purposes we collected 
              it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. 
              Audio data processed through our services is retained only for the duration necessary to complete 
              the processing and is then securely deleted.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Your Legal Rights</h2>
            <p className="leading-relaxed mb-4">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Third-Party Links</h2>
            <p className="leading-relaxed">
              Our website may include links to third-party websites, plug-ins and applications. Clicking on those 
              links or enabling those connections may allow third parties to collect or share data about you. We do 
              not control these third-party websites and are not responsible for their privacy statements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="font-semibold text-foreground">SenseVoice</p>
              <p>Email: info@sensevoice.ai</p>
              <p>Phone: +880 123 456 7890</p>
              <p>Address: Dhaka, Bangladesh</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
