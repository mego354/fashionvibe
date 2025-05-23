import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { useTranslation } from 'react-i18next';
import { Users, Award, Globe2 } from 'lucide-react';

/**
 * AboutPage - Displays information about Fashion Vibe 
 * Responsive and clean code, ready for future content updates.
 */
const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-muted/50 py-12 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2">{t('about.title', 'About Fashion Vibe')}</h1>
        <p className="text-lg text-muted-foreground mb-4">{t('about.subtitle', 'Our mission is to make fashion accessible, affordable, and enjoyable for everyone.')}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Card className="flex flex-col items-center p-6">
          <Users className="h-10 w-10 text-primary mb-2" />
          <CardContent className="text-center">
            <h2 className="font-bold text-xl mb-1">{t('about.community', 'Community')}</h2>
            <p className="text-muted-foreground">{t('about.communityDesc', 'A vibrant community of fashion lovers and creators.')}</p>
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center p-6">
          <Award className="h-10 w-10 text-primary mb-2" />
          <CardContent className="text-center">
            <h2 className="font-bold text-xl mb-1">{t('about.quality', 'Quality')}</h2>
            <p className="text-muted-foreground">{t('about.qualityDesc', 'We curate only the best products and brands for you.')}</p>
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center p-6">
          <Globe2 className="h-10 w-10 text-primary mb-2" />
          <CardContent className="text-center">
            <h2 className="font-bold text-xl mb-1">{t('about.global', 'Global Reach')}</h2>
            <p className="text-muted-foreground">{t('about.globalDesc', 'Connecting fashion trends and talents worldwide.')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage; 