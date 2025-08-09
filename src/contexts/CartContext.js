"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Cart Context
const CartContext = createContext();

// Cart Provider Component
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (
    product,
    selectedColor = "",
    selectedSize = "",
    quantity = 1
  ) => {
    setIsLoading(true);

    // Create unique item key based on product, color, and size
    const itemKey = `${product.id}-${selectedColor}-${selectedSize}`;

    const newItem = {
      id: itemKey,
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price,
      image: product.main_image,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      category: product.category_name,
    };

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === itemKey
      );

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // New item, add to cart
        return [...prevItems, newItem];
      }
    });

    setIsLoading(false);

    // Show success message (you can customize this)
    showCartNotification("Item added to cart successfully!");
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get cart totals
  const getCartTotals = () => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      subtotal,
      itemCount,
      shipping: subtotal > 100000 ? 0 : 10000, // Free shipping over ₦100,000
      tax: subtotal * 0.03, // 3% tax
    };
  };

  // Simple notification function (you can replace with a toast library)
  const showCartNotification = (message) => {
    // Create a simple notification
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-0 transition-transform duration-300";
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(-10px)";
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(400px)";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotals,
    isLoading,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
