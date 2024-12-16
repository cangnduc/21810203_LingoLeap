import React from "react";
import { motion, useInView } from "framer-motion";
import Hero from "../components/HomeComponent/Hero";
import FeaturesOverview from "../components/HomeComponent/FeaturesOverview";
import FeaturedTests from "../components/HomeComponent/FeaturedTests";
import CourseHighlights from "../components/HomeComponent/CourseHighlights";
import Testimonials from "../components/HomeComponent/Testimonials";
import CallToAction from "../components/HomeComponent/CallToAction";
import Footer from "../components/HomeComponent/Footer";
import ScrollToTopButton from "../components/ScrollToTopBtn";
const FadeInSection = ({ children, delay = 0 }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

export default function HomePage() {
  return (
    <div>
      <FadeInSection>
        <Hero />
      </FadeInSection>
      <FadeInSection delay={0.1}>
        <FeaturesOverview />
      </FadeInSection>
      <FadeInSection delay={0.2}>
        <FeaturedTests />
      </FadeInSection>
      <FadeInSection delay={0.3}>
        <CourseHighlights />
      </FadeInSection>
      <FadeInSection delay={0.4}>
        <Testimonials />
      </FadeInSection>
      <FadeInSection delay={0.5}>
        <CallToAction />
      </FadeInSection>
      <FadeInSection delay={0.6}>
        <Footer />
      </FadeInSection>
      <ScrollToTopButton />
    </div>
  );
}
