import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/header';
import Footer from '../components/footer';
import { Button } from '../components/ui/button';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted px-4">
        <section className="text-center py-16">
          <h1 className="text-5xl font-extrabold mb-4">Fashion Vibe</h1>
          <p className="text-lg mb-8">{t('landing.slogan', 'Elevate your style. Discover the vibe.')}</p>
          <Button size="lg" asChild>
            <a href="/register">{t('landing.getStarted', 'Get Started')}</a>
          </Button>
        </section>
        <section className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          <div className="bg-card rounded-lg p-6 shadow text-center">
            <h2 className="text-xl font-bold mb-2">{t('landing.feature1', 'Curated Collections')}</h2>
            <p>{t('landing.feature1Desc', 'Handpicked styles for every occasion.')}</p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow text-center">
            <h2 className="text-xl font-bold mb-2">{t('landing.feature2', 'Bilingual Experience')}</h2>
            <p>{t('landing.feature2Desc', 'Switch languages seamlessly.')}</p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow text-center">
            <h2 className="text-xl font-bold mb-2">{t('landing.feature3', 'Multiple Themes')}</h2>
            <p>{t('landing.feature3Desc', 'Personalize your store with unique themes.')}</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
