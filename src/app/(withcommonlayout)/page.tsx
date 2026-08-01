import Banner from '@/src/components/home/Banner';
import FeaturedCategories from '@/src/components/home/FeaturedCategories';
import FeaturedTechnicians from '@/src/components/home/FeaturedTechnicians';
import Faq from '@/src/components/home/Faq';
import React from 'react';

export default function page() {
  return (
    <div>
      <Banner />
      <FeaturedCategories />
      <FeaturedTechnicians />
      <Faq />
    </div>
  );
}
