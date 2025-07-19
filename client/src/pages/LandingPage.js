import {
  Header,
  Hero,
  Features,
  HowItWorks,
  Testimonials,
  CTA,
  Footer
} from '../components/landingpage';

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

export default LandingPage; 