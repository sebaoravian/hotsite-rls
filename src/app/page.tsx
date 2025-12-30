import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Statement from '@/components/Statement'
import About from '@/components/About'
import Capabilities from '@/components/Capabilities'
import Impact from '@/components/Impact'
import Principles from '@/components/Principles'
import Team from '@/components/Team'
import Timeline from '@/components/Timeline'
import Services from '@/components/Services'
import Philosophy from '@/components/Philosophy'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import StackingSection from '@/components/ParallaxSection'
import ClientsSlider from '@/components/ClientsSlider'

export default async function Home() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      <main className="relative pt-[72px]">
        <StackingSection className="bg-[#fafafa] relative z-[1]" index={1}>
          <Hero />
        </StackingSection>
        
        <StackingSection className="bg-[#fafafa] relative z-[2]" index={2}>
          <Statement />
        </StackingSection>
        
        <StackingSection className="bg-[#fafafa] relative z-[3]" index={3}>
          <About />
        </StackingSection>
        
        <StackingSection className="bg-[#fafafa] relative z-[10]" index={10}>
          <ClientsSlider />
        </StackingSection>
        
        <StackingSection className="bg-[#fafafa] relative z-[4]" index={4}>
          <Timeline />
        </StackingSection>
        
        <StackingSection className="bg-[#fafafa] relative z-[4]" index={4}>
          <Services />
        </StackingSection>

        <StackingSection className="bg-[#fafafa] relative z-[5]" index={5}>
          <Capabilities />
        </StackingSection>
        
        <StackingSection className="bg-[#fafafa] relative z-[6]" index={6}>
          <Principles />
        </StackingSection>
        
        <StackingSection className="bg-[#fafafa] relative z-[7]" index={7}>
          <Impact />
        </StackingSection>
        
        <StackingSection className="bg-[#fafafa] relative z-[8]" index={8}>
          <Team />
        </StackingSection>
        
        <StackingSection className="bg-[#fafafa] relative z-[9]" index={9}>
          <Philosophy />
          <Contact />
        </StackingSection>
      </main>
      <Footer />
    </div>
  )
}