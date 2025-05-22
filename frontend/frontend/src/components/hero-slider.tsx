import React from 'react';
import { useTranslation } from 'react-i18next';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

interface HeroSliderProps {
  slides: {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
  }[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ slides }) => {
  const { t } = useTranslation();

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className="relative h-[500px] w-full overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                <div className="container">
                  <div className="max-w-lg text-white p-6">
                    <h2 className="text-4xl font-bold mb-2">{slide.title}</h2>
                    <p className="text-lg mb-6">{slide.subtitle}</p>
                    <Button asChild size="lg">
                      <Link to={slide.buttonLink}>{slide.buttonText}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
};

export default HeroSlider;
