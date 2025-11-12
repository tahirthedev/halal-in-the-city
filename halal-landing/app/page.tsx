import React from 'react'
import HeroBanner from '@/components/HeroBanner';
import Testimonials from '@/components/Testimonials';
import RecentNews from '@/components/RecentNews';
import FAQ from '@/components/Faqs';
import Pricing from '@/components/Pricing';
import Mockups from '@/components/Mockups';
// import Footer from '@/components/Footer';
import ContactFooter from '@/components/Footer';

function page() {
  return (

    <>
      <div className='heading'>
      <HeroBanner />
      <Mockups />
      <Testimonials />
      <FAQ />
      <Pricing />
      {/* <RecentNews /> */}
      <ContactFooter />
      </div>
    </>

  )
}

export default page