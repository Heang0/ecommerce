import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        console.log('🔄 Loading cart from localStorage:', savedCart); // DEBUG
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                console.log('✅ Cart loaded:', parsedCart); // DEBUG
                setCart(parsedCart);
            } catch (error) {
                console.error('❌ Error parsing cart:', error);
            }
        } else {
            console.log('📭 No cart found in localStorage'); // DEBUG
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        console.log('💾 Saving cart to localStorage:', cart); // DEBUG
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Add to cart
    const addToCart = (product, quantity = 1) => {
        console.log('➕ Adding to cart:', product.nameEn, 'quantity:', quantity); // DEBUG
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item._id === product._id);

            if (existingItem) {
                console.log('🔄 Updating existing item'); // DEBUG
                return prevCart.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                console.log('🆕 Adding new item'); // DEBUG
                return [...prevCart, { ...product, quantity }];
            }
        });
    };

    const removeFromCart = (productId) => {
        console.log('❌ Removing from cart:', productId); // DEBUG
        setCart(prevCart => prevCart.filter(item => item._id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        console.log('🔄 Updating quantity:', productId, 'to', newQuantity); // DEBUG
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        setCart(prevCart =>
            prevCart.map(item =>
                item._id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const clearCart = () => {
        console.log('🗑️ Clearing cart'); // DEBUG
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => {
            const price = item.salePrice || item.price;
            return total + (price * item.quantity);
        }, 0);
    };

    const getItemCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    const toggleCart = () => {
        setIsOpen(!isOpen);
    };

    return (
        <CartContext.Provider value={{
            cart,
            isOpen,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getItemCount,
            toggleCart,
            setIsOpen
        }}>
            {children}
        </CartContext.Provider>
    );
};