import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-6">{t('notFound.title')}</h2>
        <p className="text-lg mb-8">{t('notFound.message')}</p>
        <Link 
          to="/" 
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary-dark transition-colors"
        >
          {t('notFound.backToHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
