import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useSearch } from '../context/SearchContext'; // Add this
import { translations } from '../context/translations';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';

const FLAGS = {
    km: 'https://flagcdn.com/w40/kh.png',
    en: 'https://flagcdn.com/w40/us.png'
};

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [localSearch, setLocalSearch] = useState('');
    const navigate = useNavigate();
    const { getItemCount, toggleCart } = useCart();
    const { language, toggleLanguage } = useLanguage();
    const { setSearchQuery } = useSearch(); // Use search context
    const t = translations[language];

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setLocalSearch(query);
        setSearchQuery(query); // Update global search state
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (localSearch.trim()) {
            navigate('/');
        }
        setIsSearchOpen(false);
    };

    const clearSearch = () => {
        setLocalSearch('');
        setSearchQuery('');
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a href="/" className="block">
                            <img src={logo} alt="Logo" className="h-10 sm:h-12 w-auto" />
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="/" className={`${language === 'km' ? 'font-khmer' : 'font-sans'} text-gray-700 hover:text-[#005E7B] text-sm font-medium`}>
                            {t.home}
                        </a>
                        <a href="/sale" className={`${language === 'km' ? 'font-khmer' : 'font-sans'} text-gray-700 hover:text-[#005E7B] text-sm font-medium`}>
                            {t.sale}
                        </a>
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        {/* Search Toggle */}
                        <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="md:hidden p-2 text-gray-600">
                            <Search size={20} />
                        </button>

                        {/* Desktop Search Form */}
                        <form onSubmit={handleSearchSubmit} className="hidden md:block relative">
                            <input
                                type="text"
                                value={localSearch}
                                onChange={handleSearchChange}
                                placeholder="Search products..."
                                className="w-64 lg:w-80 pl-10 pr-10 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#005E7B] font-sans"
                            />
                            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                            {localSearch && (
                                <button type="button" onClick={clearSearch} className="absolute right-3 top-2.5 text-gray-400">
                                    <X size={16} />
                                </button>
                            )}
                        </form>

                        {/* Language Toggle */}
                        <button onClick={toggleLanguage} className="hidden md:flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border">
                            <img src={language === 'km' ? FLAGS.en : FLAGS.km} alt="flag" className="w-full h-full object-cover" />
                        </button>

                        {/* Cart */}
                        <button onClick={toggleCart} className="relative p-2 text-gray-600">
                            <ShoppingCart size={20} />
                            {getItemCount() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#E1232E] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {getItemCount()}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Button */}
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                {isSearchOpen && (
                    <div className="md:hidden py-3 border-t">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                type="text"
                                value={localSearch}
                                onChange={handleSearchChange}
                                placeholder="Search products..."
                                className="w-full pl-10 pr-10 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#005E7B]"
                                autoFocus
                            />
                            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                            {localSearch && (
                                <button type="button" onClick={clearSearch} className="absolute right-3 top-2.5">
                                    <X size={16} />
                                </button>
                            )}
                        </form>
                    </div>
                )}

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <div className="flex flex-col space-y-3">
                            <a href="/" className="px-3 py-2 text-gray-700">{t.home}</a>
                            <a href="/sale" className="px-3 py-2 text-gray-700">{t.sale}</a>
                            <button onClick={toggleLanguage} className="px-3 py-2 text-gray-700 text-left">
                                {language === 'km' ? 'English' : 'ខ្មែរ'}
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;