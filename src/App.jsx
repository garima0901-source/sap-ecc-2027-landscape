import Hero from './components/Hero'
import HeatMap from './components/HeatMap'
import AdoptionChart from './components/AdoptionChart'
import CostCards from './components/CostCards'
import SelfCheck from './components/SelfCheck'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-ink font-sans">
      <Hero />
      <HeatMap />
      <AdoptionChart />
      <CostCards />
      <SelfCheck />
      <Footer />
    </div>
  )
}
