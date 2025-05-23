import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { selectCartItemsCount } from '../store/cartSlice';
import { selectIsAuthenticated, logout } from '../store/authSlice';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import ThemeSelector from './theme-selector';
import LanguageSelector from './language-selector';
import {
  Search,
  ShoppingCart,
  Menu,
  User,
  LogOut,
  Settings,
  Package,
  Heart,
  Store,
  LayoutDashboard,
} from 'lucide-react';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isStorefront = Boolean(useMatch('/store/:storeId/*'));
  
  // Redux selectors
  const cartItemsCount = useSelector(selectCartItemsCount);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Local state
  const [searchQuery, setSearchQuery] = React.useState('');

  // Navigation links based on context
  const companyLinks = [
    { to: '/', label: t('common.home') },
    { to: '/about', label: t('about') },
    { to: '/contact', label: t('contact') },
    { to: '/plans', label: t('subscriptionPlans') },
    { to: '/how-to-use', label: t('howToUse') },
    { to: '/how-to-subscribe', label: t('howToSubscribe') },
  ];

  const storeLinks = [
    { to: '/', label: t('common.home') },
    { to: '/categories', label: t('common.categories') },
    { to: '/wishlist', label: t('common.wishlist') },
    { to: '/new-arrivals', label: t('storefront.newArrivals') },
    { to: '/sale', label: t('storefront.onSale') },
  ];
  
  // Current navigation links based on page context
  const currentLinks = isLanding ? companyLinks : storeLinks;

  // Event handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    console.log('Search for:', searchQuery);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  // Component sections
  const renderLogo = () => (
    <Link to="/" className="flex items-center space-x-2">
      <span className="text-xl font-extrabold tracking-tight">Fashion Vibe</span>
    </Link>
  );

  const renderDesktopNav = () => (
    <nav className="hidden md:flex items-center space-x-6">
      {currentLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );

  const renderMobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-6 border-r">
        <nav className="flex flex-col gap-4 mt-8">
          {currentLinks.map((link) => (
            <Link key={link.to} to={link.to} className="text-base font-medium py-2">
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );

  const renderSearchBar = () => {
    if (!isStorefront) return null;
    
    return (
      <form onSubmit={handleSearch} className="hidden lg:flex w-64">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('common.search')}
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>
    );
  };

  const renderCartButton = () => {
    if (!isStorefront) return null;
    
    return (
      <Link to="/cart" aria-label={t('common.cart')}>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartItemsCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -right-1 -top-1 h-4 w-4 text-xs p-0 flex items-center justify-center rounded-full"
            >
              {cartItemsCount}
            </Badge>
          )}
          <span className="sr-only">{t('common.cart')}</span>
        </Button>
      </Link>
    );
  };

  const renderUserMenu = () => {
    if (!isStorefront) return null;

    if (!isAuthenticated) {
      return (
        <Link to="/login">
          <Button variant="ghost" size="sm">
            {t('common.login')}
          </Button>
        </Link>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar_url || '/placeholder-avatar.jpg'} alt="User" />
              <AvatarFallback>
                {(user?.first_name?.[0] || '') + (user?.last_name?.[0] || '')}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t('common.myAccount')}</DropdownMenuLabel>
          
          <Link to="/account/profile">
            <DropdownMenuItem className="flex items-center cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>{t('account.profile')}</span>
            </DropdownMenuItem>
          </Link>
          
          <Link to="/account/orders">
            <DropdownMenuItem className="flex items-center cursor-pointer">
              <Package className="mr-2 h-4 w-4" />
              <span>{t('account.orders')}</span>
            </DropdownMenuItem>
          </Link>
          
          <Link to="/wishlist">
            <DropdownMenuItem className="flex items-center cursor-pointer">
              <Heart className="mr-2 h-4 w-4" />
              <span>{t('account.wishlist')}</span>
            </DropdownMenuItem>
          </Link>
          
          <Link to="/account/settings">
            <DropdownMenuItem className="flex items-center cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>{t('account.accountSettings')}</span>
            </DropdownMenuItem>
          </Link>
          
          {user?.is_store_owner && (
            <>
              <DropdownMenuSeparator />
              <Link to="/store/dashboard">
                <DropdownMenuItem className="flex items-center cursor-pointer">
                  <Store className="mr-2 h-4 w-4" />
                  <span>{t('common.myStore')}</span>
                </DropdownMenuItem>
              </Link>
            </>
          )}
          
          {user?.is_superuser && (
            <>
              <DropdownMenuSeparator />
              <Link to="/admin/dashboard">
                <DropdownMenuItem className="flex items-center cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>{t('common.adminDashboard')}</span>
                </DropdownMenuItem>
              </Link>
            </>
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleLogout}
            className="flex items-center cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t('common.logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Section: Logo + Nav */}
        <div className="flex items-center gap-6">
          {renderLogo()}
          {renderDesktopNav()}
        </div>

        {/* Right Section: Controls */}
        <div className="flex items-center gap-3">
          {renderSearchBar()}
          {renderCartButton()}
          <ThemeSelector />
          <LanguageSelector />
          {renderUserMenu()}
          {renderMobileNav()}
        </div>
      </div>
    </header>
  );
};

export default Header;
