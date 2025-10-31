export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-linear-to-br from-white via-primary/5 to-white dark:from-background dark:via-primary/5 dark:to-background">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-sm sm:prose-base max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using SenseVoice services, you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Description of Service</h2>
            <p className="leading-relaxed">
              SenseVoice provides advanced AI-powered voice technology services including speech recognition, 
              text-to-speech synthesis, and audio processing specifically optimized for the Bengali language. 
              Our services are provided "as is" and we reserve the right to modify or discontinue services at 
              any time without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
            <p className="leading-relaxed mb-4">
              To access certain features of our service, you may be required to create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Acceptable Use</h2>
            <p className="leading-relaxed mb-4">
              You agree not to use our services to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others, including intellectual property rights</li>
              <li>Transmit any harmful, offensive, or unlawful content</li>
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Use the service for any commercial purpose without authorization</li>
              <li>Submit false, misleading, or fraudulent information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Intellectual Property</h2>
            <p className="leading-relaxed">
              All content, features, and functionality of SenseVoice services, including but not limited to text, 
              graphics, logos, software, and AI models, are owned by SenseVoice and are protected by international 
              copyright, trademark, and other intellectual property laws. You retain ownership of any audio content 
              you submit to our services, and grant us a limited license to process it for the purpose of providing 
              our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">6. API Usage and Limitations</h2>
            <p className="leading-relaxed mb-4">
              If you use our API services, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Comply with rate limits and usage quotas specified in your plan</li>
              <li>Not reverse engineer or attempt to extract our AI models</li>
              <li>Properly attribute SenseVoice when required</li>
              <li>Monitor your usage and upgrade your plan as needed</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Payment and Billing</h2>
            <p className="leading-relaxed">
              Certain features of our services require payment. You agree to provide accurate billing information 
              and authorize us to charge your payment method for all fees incurred. Subscription fees are billed 
              in advance and are non-refundable except as required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Privacy and Data Processing</h2>
            <p className="leading-relaxed">
              Your use of our services is also governed by our Privacy Policy. We process audio data solely for 
              the purpose of providing our services and do not use your data to train our models without explicit 
              consent. Please review our Privacy Policy to understand our data practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Disclaimer of Warranties</h2>
            <p className="leading-relaxed">
              Our services are provided "as is" without warranties of any kind, either express or implied. We do 
              not guarantee that our services will be uninterrupted, secure, or error-free. While we strive for 
              high accuracy in our AI models, we cannot guarantee perfect results for all inputs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Limitation of Liability</h2>
            <p className="leading-relaxed">
              To the maximum extent permitted by law, SenseVoice shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred 
              directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Termination</h2>
            <p className="leading-relaxed">
              We may terminate or suspend your account and access to our services immediately, without prior notice 
              or liability, for any reason, including breach of these Terms. Upon termination, your right to use 
              the services will immediately cease.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">12. Changes to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of any material changes 
              by posting the new Terms on this page and updating the "Last updated" date. Your continued use of 
              our services after such modifications constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">13. Governing Law</h2>
            <p className="leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Bangladesh, without 
              regard to its conflict of law provisions. Any disputes arising from these Terms or your use of our 
              services shall be subject to the exclusive jurisdiction of the courts of Bangladesh.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">14. Contact Information</h2>
            <p className="leading-relaxed mb-4">
              If you have any questions about these Terms & Conditions, please contact us:
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
