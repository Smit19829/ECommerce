import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then(data => setProducts(data.products));
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  
  const addToCart = (product) => {
    const index = cart.findIndex(item => item.id === product.id);
    if (index !== -1) {
      const updatedCart = [...cart];
      updatedCart[index].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };
  
  const updateQuantity = (productId, amount) => {
    const index = cart.findIndex(item => item.id === productId);
    if (index === -1) return; // not found
  
    const updatedCart = [...cart];
    updatedCart[index].quantity += amount;
  
    if (updatedCart[index].quantity <= 0) {
      updatedCart.splice(index, 1);
    }
  
    setCart(updatedCart);
  };
  

  const removeItem = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="container mt-5 position-relative">
      <h2 className="text-center mb-4">
        All Products
        <span
          className="badge bg-success ms-3"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowCart(true)}
        >
          <i className="bi bi-cart me-1"></i> Cart: {getTotalQuantity()}
        </span>
      </h2>

      <div className="row">
        {products.map(product => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={product.thumbnail}
                className="card-img-top"
                alt={product.title}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text text-truncate">{product.description}</p>
                <p className="card-text">
                  <strong>${product.price}</strong>{' '}
                  <small className="text-muted">({product.discountPercentage}% off)</small>
                </p>
                <p className="card-text mb-1">⭐ {product.rating}</p>
                <p className="card-text text-muted">In stock: {product.stock}</p>
                <button className="btn btn-primary mt-auto" onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${showCart ? 'open' : ''}`}>
        <div className="cart-header d-flex justify-content-between align-items-center px-3 py-2 bg-dark text-white">
          <h5 className="m-0">Your Cart</h5>
          <button className="btn-close btn-close-white" onClick={() => setShowCart(false)}></button>
        </div>
        <div className="cart-body p-3">
          {cart.length === 0 ? (
            <p className="text-muted">Your cart is empty.</p>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="mb-3 border-bottom pb-2">
                  <div className="fw-bold">{item.title}</div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => updateQuantity(item.id, -1)}>-</button>
                      {item.quantity}
                      <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                    <button className="btn btn-sm btn-danger" onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                  <div>Price: ${item.price} x {item.quantity}</div>
                  <div>Total: ${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
              <h6 className="text-end mt-3">Total: ${getTotalPrice()}</h6>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
