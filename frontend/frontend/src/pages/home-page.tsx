import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Link } from 'react-router-dom';
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

// Mock data for the homepage
const mockHeroSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    title: 'Summer Collection 2025',
    subtitle: 'Discover the latest trends in summer fashion',
    buttonText: 'Shop Now',
    buttonLink: '/categories/summer'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    title: 'New Arrivals',
    subtitle: 'Be the first to wear our newest styles',
    buttonText: 'Explore',
    buttonLink: '/new-arrivals'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    title: 'Special Offers',
    subtitle: 'Save up to 50% on selected items',
    buttonText: 'Shop Sale',
    buttonLink: '/sale'
  }
];

const mockFeaturedProducts = [
  {
    id: 1,
    name: 'Summer Floral Dress',
    price: 1200,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
    category: 'Women',
    isNew: false,
    isFeatured: true,
    isOnSale: false,
    storeId: 1,
    storeName: 'Fashion Elite',
    sku: 'WD-1001'
  },
  {
    id: 2,
    name: 'Casual Linen Shirt',
    price: 850,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    category: 'Men',
    isNew: true,
    isFeatured: true,
    isOnSale: false,
    storeId: 2,
    storeName: 'Cairo Threads',
    sku: 'MS-2002'
  },
  {
    id: 3,
    name: 'Classic Denim Jeans',
    price: 950,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    category: 'Men',
    isNew: false,
    isFeatured: true,
    isOnSale: false,
    storeId: 1,
    storeName: 'Fashion Elite',
    sku: 'MJ-3003'
  },
  {
    id: 4,
    name: 'Leather Crossbody Bag',
    price: 1500,
    salePrice: 1200,
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Accessories',
    isNew: false,
    isFeatured: true,
    isOnSale: true,
    storeId: 3,
    storeName: 'Luxe Leather',
    sku: 'AB-4004'
  },
  {
    id: 5,
    name: 'Summer Sandals',
    price: 750,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Footwear',
    isNew: true,
    isFeatured: true,
    isOnSale: false,
    storeId: 2,
    storeName: 'Cairo Threads',
    sku: 'FS-5005'
  },
  {
    id: 6,
    name: 'Cotton T-Shirt',
    price: 350,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80',
    category: 'Men',
    isNew: false,
    isFeatured: true,
    isOnSale: false,
    storeId: 1,
    storeName: 'Fashion Elite',
    sku: 'MT-6006'
  },
  {
    id: 7,
    name: 'Pleated Skirt',
    price: 650,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
    category: 'Women',
    isNew: true,
    isFeatured: true,
    isOnSale: false,
    storeId: 2,
    storeName: 'Cairo Threads',
    sku: 'WS-7007'
  },
  {
    id: 8,
    name: 'Aviator Sunglasses',
    price: 450,
    salePrice: 350,
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    category: 'Accessories',
    isNew: false,
    isFeatured: true,
    isOnSale: true,
    storeId: 3,
    storeName: 'Luxe Leather',
    sku: 'AS-8008'
  }
];

const mockNewArrivals = [
  {
    id: 9,
    name: 'Printed Maxi Dress',
    price: 1350,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=873&q=80',
    category: 'Women',
    isNew: true,
    isFeatured: false,
    isOnSale: false,
    storeId: 1,
    storeName: 'Fashion Elite',
    sku: 'WD-9009'
  },
  {
    id: 10,
    name: 'Slim Fit Blazer',
    price: 1800,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    category: 'Men',
    isNew: true,
    isFeatured: false,
    isOnSale: false,
    storeId: 2,
    storeName: 'Cairo Threads',
    sku: 'MB-1010'
  },
  {
    id: 11,
    name: 'Kids Denim Overalls',
    price: 650,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=701&q=80',
    category: 'Kids',
    isNew: true,
    isFeatured: false,
    isOnSale: false,
    storeId: 1,
    storeName: 'Fashion Elite',
    sku: 'KO-1111'
  },
  {
    id: 12,
    name: 'Leather Wallet',
    price: 450,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Accessories',
    isNew: true,
    isFeatured: false,
    isOnSale: false,
    storeId: 3,
    storeName: 'Luxe Leather',
    sku: 'AW-1212'
  },
  {
    id: 13,
    name: 'Canvas Sneakers',
    price: 550,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=796&q=80',
    category: 'Footwear',
    isNew: true,
    isFeatured: false,
    isOnSale: false,
    storeId: 2,
    storeName: 'Cairo Threads',
    sku: 'FS-1313'
  },
  {
    id: 14,
    name: 'Silk Scarf',
    price: 350,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Accessories',
    isNew: true,
    isFeatured: false,
    isOnSale: false,
    storeId: 1,
    storeName: 'Fashion Elite',
    sku: 'AS-1414'
  },
  {
    id: 15,
    name: 'Linen Pants',
    price: 750,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Men',
    isNew: true,
    isFeatured: false,
    isOnSale: false,
    storeId: 2,
    storeName: 'Cairo Threads',
    sku: 'MP-1515'
  },
  {
    id: 16,
    name: 'Straw Hat',
    price: 250,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1565839534477-04a3bfb8b5c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: 'Accessories',
    isNew: true,
    isFeatured: false,
    isOnSale: false,
    storeId: 3,
    storeName: 'Luxe Leather',
    sku: 'AH-1616'
  }
];

const mockOnSaleProducts = [
  {
    id: 17,
    name: 'Embroidered Blouse',
    price: 950,
    salePrice: 750,
    image: 'https://images.unsplash.com/photo-1604945234568-86eda11263b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    category: 'Women',
    isNew: false,
    isFeatured: false,
    isOnSale: true,
    storeId: 1,
    storeName: 'Fashion Elite',
    sku: 'WB-1717'
  },
  {
    id: 18,
    name: 'Chino Shorts',
    price: 550,
    salePrice: 450,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    category: 'Men',
    isNew: false,
    isFeatured: false,
    isOnSale: true,
    storeId: 2,
    storeName: 'Cairo Threads',
    sku: 'MS-1818'
  },
  {
    id: 19,
    name: 'Kids Summer Dress',
    price: 450,
    salePrice: 350,
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=772&q=80',
    category: 'Kids',
    isNew: false,
    isFeatured: false,
    isOnSale: true,
    storeId: 1,
    storeName: 'Fashion Elite',
    sku: 'KD-1919'
  },
  {
    id: 20,
    name: 'Leather Belt',
    price: 350,
    salePrice: 250,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Accessories',
    isNew: false,
    isFeatured: false,
    isOnSale: true,
    storeId: 3,
    storeName: 'Luxe Leather',
    sku: 'AB-2020'
  },
  {
    id: 21,
    name: 'Slip-On Loafers',
    price: 850,
    salePrice: 650,
    image: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=765&q=80',
    category: 'Footwear',
    isNew: false,
    isFeatured: false,
    isOnSale: true,
    storeId: 2,
    storeName: 'Cairo Threads',
    sku: 'FL-2121'
  },
  {
    id: 22,
    name: 'Knit Sweater',
    price: 1200,
    salePrice: 950,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
    category: 'Women',
    isNew: false,
    isFeatured: false,
    isOnSale: true,
    storeId: 1,
    storeName: 'Fashion Elite',
    sku: 'WS-2222'
  },
  {
    id: 23,
    name: 'Denim Jacket',
    price: 1500,
    salePrice: 1200,
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Men',
    isNew: false,
    isFeatured: false,
    isOnSale: true,
    storeId: 2,
    storeName: 'Cairo Threads',
    sku: 'MJ-2323'
  },
  {
    id: 24,
    name: 'Woven Tote Bag',
    price: 650,
    salePrice: 500,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=876&q=80',
    category: 'Accessories',
    isNew: false,
    isFeatured: false,
    isOnSale: true,
    storeId: 3,
    storeName: 'Luxe Leather',
    sku: 'AB-2424'
  }
];

const mockCategories = [
  {
    id: 1,
    name: 'Men\'s Shirts',
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    link: '/categories/men/shirts',
    productCount: 42
  },
  {
    id: 2,
    name: 'Men\'s Pants',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    link: '/categories/men/pants',
    productCount: 36
  },
  {
    id: 3,
    name: 'Women\'s Dresses',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=783&q=80',
    link: '/categories/women/dresses',
    productCount: 58
  },
  {
    id: 4,
    name: 'Women\'s Tops',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=705&q=80',
    link: '/categories/women/tops',
    productCount: 47
  },
  {
    id: 5,
    name: 'Kids\' Clothing',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=701&q=80',
    link: '/categories/kids',
    productCount: 63
  },
  {
    id: 6,
    name: 'Footwear',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80',
    link: '/categories/footwear',
    productCount: 39
  },
  {
    id: 7,
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80',
    link: '/categories/accessories',
    productCount: 52
  },
  {
    id: 8,
    name: 'Activewear',
    image: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1441&q=80',
    link: '/categories/activewear',
    productCount: 28
  }
];

const mockCategoryBanners = [
  {
    id: 1,
    name: 'Women\'s Collection',
    description: 'Discover our latest women\'s fashion collection featuring elegant dresses, stylish tops, and comfortable bottoms.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    link: '/categories/women'
  },
  {
    id: 2,
    name: 'Men\'s Collection',
    description: 'Explore our men\'s fashion range with premium shirts, pants, and accessories for every occasion.',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    link: '/categories/men'
  }
];

const mockTestimonials = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    text: 'I\'ve been shopping with Fashion Hub for over a year now and I\'m always impressed with the quality of their products. The delivery is always on time and the customer service is excellent.',
    date: 'May 15, 2025'
  },
  {
    id: 2,
    name: 'Fatima Ali',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4.5,
    text: 'Great selection of clothes and accessories. I especially love their summer collection. The prices are reasonable and the quality is good.',
    date: 'April 28, 2025'
  },
  {
    id: 3,
    name: 'Mohamed Ibrahim',
    avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
    rating: 5,
    text: 'The website is easy to navigate and the checkout process is smooth. I received my order within 2 days and everything fit perfectly. Will definitely shop here again!',
    date: 'April 10, 2025'
  },
  {
    id: 4,
    name: 'Nour Ahmed',
    avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    rating: 4,
    text: 'I love the variety of styles available. The return process was also very easy when I needed to exchange a size. Great customer service!',
    date: 'March 22, 2025'
  },
  {
    id: 5,
    name: 'Karim Mahmoud',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    rating: 5,
    text: 'Fashion Hub has become my go-to store for all my clothing needs. The quality is consistent and the designs are always trendy.',
    date: 'March 5, 2025'
  }
];

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Slider */}
        <section>
          <HeroSlider slides={mockHeroSlides} />
        </section>

        {/* Feature Cards */}
        <section className="container py-12">
          <FeatureCards />
        </section>

        {/* Product Tabs */}
        <section className="container py-12">
          <ProductTabs 
            featuredProducts={mockFeaturedProducts}
            newArrivals={mockNewArrivals}
            onSaleProducts={mockOnSaleProducts}
          />
        </section>

        {/* Category Banner 1 */}
        <section className="container py-12">
          <CategoryBanner category={mockCategoryBanners[0]} />
        </section>

        {/* Category Grid */}
        <section className="container py-12">
          <CategoryGrid categories={mockCategories} />
        </section>

        {/* Category Banner 2 */}
        <section className="container py-12">
          <CategoryBanner category={mockCategoryBanners[1]} reverse={true} />
        </section>

        {/* Testimonials */}
        <section className="py-12">
          <TestimonialCarousel testimonials={mockTestimonials} />
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
            {/* These would be brand logos */}
            <div className="flex justify-center">
              <div className="h-12 w-24 bg-muted rounded flex items-center justify-center">Brand 1</div>
            </div>
            <div className="flex justify-center">
              <div className="h-12 w-24 bg-muted rounded flex items-center justify-center">Brand 2</div>
            </div>
            <div className="flex justify-center">
              <div className="h-12 w-24 bg-muted rounded flex items-center justify-center">Brand 3</div>
            </div>
            <div className="flex justify-center">
              <div className="h-12 w-24 bg-muted rounded flex items-center justify-center">Brand 4</div>
            </div>
            <div className="flex justify-center">
              <div className="h-12 w-24 bg-muted rounded flex items-center justify-center">Brand 5</div>
            </div>
            <div className="flex justify-center">
              <div className="h-12 w-24 bg-muted rounded flex items-center justify-center">Brand 6</div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
