import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin } from 'lucide-react';

/**
 * ContactPage - Provides contact information and a simple contact form for Fashion Vibe.
 * Responsive and clean code, ready for future enhancements.
 */
const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-muted/50 py-12 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2">{t('contact.title', 'Contact Us')}</h1>
        <p className="text-lg text-muted-foreground mb-4">{t('contact.subtitle', 'Have questions or feedback? Reach out to Fashion Vibe!')}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="p-6 flex flex-col justify-center">
          <CardContent>
            <form className="space-y-4">
              <input className="w-full border p-2 rounded" type="text" placeholder={t('contact.name', 'Your Name')} />
              <input className="w-full border p-2 rounded" type="email" placeholder={t('contact.email', 'Your Email')} />
              <textarea className="w-full border p-2 rounded" placeholder={t('contact.message', 'Your Message')} rows={4} />
              <button className="bg-black text-white px-4 py-2 rounded w-full" type="submit">{t('contact.send', 'Send')}</button>
            </form>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-6 justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Mail className="h-5 w-5" /> support@fashionvibe.com
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Phone className="h-5 w-5" /> +20 123 456 7890
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <MapPin className="h-5 w-5" /> Cairo, Egypt
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
// @ts-expect-error: generated file, no type declaration needed 