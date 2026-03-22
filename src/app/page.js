import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import HowItWorks from '@/components/HowItWorks'
import TestimonialsSection from '@/components/TestimonialsSection'
import NewsletterSection from '@/components/NewsletterSection'
import CTABanner from '@/components/CTABanner'
import ScrollReveal from '@/components/ScrollReveal'

export default function Home() {
  return (
    <>
      <HeroSection />
      <ScrollReveal direction="up">
        <FeaturesSection />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={100}>
        <HowItWorks />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={100}>
        <TestimonialsSection />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={100}>
        <NewsletterSection />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={100}>
        <CTABanner />
      </ScrollReveal>
    </>
  )
}