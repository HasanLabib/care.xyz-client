import Banner from "@/components/ Banner";
import About from "@/components/About";
import CallToAction from "@/components/CallToAction";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";


export default function Home() {
  return (
    <>

      <Banner />
      <About />
      <Services />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      <Contact />

    </>
  );
}
