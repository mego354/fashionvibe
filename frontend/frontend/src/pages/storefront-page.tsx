import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import HeroSlider from '../components/hero-slider';
import FeatureCards from '../components/feature-cards';
import ProductTabs from '../components/product-tabs';
import CategoryBanner from '../components/category-banner';
import CategoryGrid from '../components/category-grid';
import TestimonialCarousel from '../components/testimonial-carousel';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';
import { storeAPI } from '../services/api';

const StorefrontPage: React.FC = () => {
  const { t } = useTranslation();
  const { storeId } = useParams();
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    storeAPI.getStorefront(storeId)
      .then(res => {
        setStoreData(res.data);
        setError(null);
      })
      .catch(() => setError(t('storefront.loadError')))
      .finally(() => setLoading(false));
  }, [storeId, t]);

  if (loading) return <div className="text-center py-12">{t('common.loading')}</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;
  if (!storeData) return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <Header />
      <main className="flex-grow">
        {/* Hero Slider */}
        <section>
          <HeroSlider slides={storeData.heroSlides} />
        </section>
        {/* Feature Cards */}
        <section className="container py-12">
          <FeatureCards features={storeData.features} />
        </section>
        {/* Product Tabs */}
        <section className="container py-12">
          <ProductTabs 
            featuredProducts={storeData.featuredProducts}
            newArrivals={storeData.newArrivals}
            onSaleProducts={storeData.onSaleProducts}
          />
        </section>
        {/* Category Banner 1 */}
        <section className="container py-12">
          <CategoryBanner category={storeData.categoryBanners[0]} />
        </section>
        {/* Category Grid */}
        <section className="container py-12">
          <CategoryGrid categories={storeData.categories} />
        </section>
        {/* Category Banner 2 */}
        <section className="container py-12">
          <CategoryBanner category={storeData.categoryBanners[1]} reverse={true} />
        </section>
        {/* Testimonials */}
        <section className="py-12">
          <TestimonialCarousel testimonials={storeData.testimonials} />
        </section>
        {/* Newsletter */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">{t('storefront.joinOurNewsletter')}</h2>
            <p className="max-w-2xl mx-auto mb-8">{t('storefront.newsletterDescription')}</p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('storefront.emailPlaceholder')}
                className="flex-1 px-4 py-2 rounded-md border border-primary-foreground/20 bg-transparent placeholder:text-primary-foreground/60"
                required
              />
              <Button variant="secondary">{t('storefront.subscribe')}</Button>
            </form>
          </div>
        </section>
        {/* Brands */}
        <section className="container py-12">
          <h2 className="text-2xl font-bold text-center mb-8">{t('storefront.featuredBrands')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {storeData.brands.map((brand: any, idx: number) => (
              <div key={idx} className="flex justify-center">
                <div className="h-12 w-24 bg-muted rounded flex items-center justify-center">{brand.name}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default StorefrontPage; 