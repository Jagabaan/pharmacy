import { Header } from '../components/Header';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './HomePage.css';

export function HomePage({ cart, fetchProducts }) {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: parseInt(value)
    }));
  };

  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <title>Pharmacy Project</title>

      <Header cart={cart} onSearchChange={setSearchQuery} />

      <div className="home-page">
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const selectedQty = quantities[product._id] || 1;

            return (
              <div className="product-container" key={product._id}>
                <div className="product-image-container">
                  <img className="product-image" src={product.imageUrl} />
                </div>

                <div className="product-name limit-text-to-2-lines">
                  {product.name}
                </div>

                <div className="product-rating-container">
                  <p>Expires on: {new Date(product.epirationDate).toLocaleDateString()}</p>
                </div>

                <div className="product-price">
                  ₦{product.price.toLocaleString()}
                </div>

                <div className="product-quantity-container">
                  <select
                    value={selectedQty}
                    onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                  >
                    {[...Array(100)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="product-spacer"></div>

                <div className="added-to-cart">
                  <img src="images/icons/checkmark.png" />
                  Added
                </div>

                <button
                  type="button"
                  className="add-to-cart-button button-primary"
                  onClick={async () => {
                    const token = localStorage.getItem('token');

                    if (!token) {
                      alert('Please register or log in to add items to your cart.');
                      window.location.href = '/register';
                      return;
                    }

                    const quantityToSend = quantities[product._id] || 1;

                    try {
                      await axios.post(
                        'http://localhost:3000/api/cartupload',
                        {
                          productId: product._id,
                          quantity: quantityToSend
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${token}`
                          }
                        }
                      );

                      console.log('Product added to cart.');
                      fetchProducts();
                    } catch (error) {
                      if (error.response?.status === 401) {
                        alert("Session expired. Please log in again.");
                        window.location.href = "/register";
                      } else {
                        console.error('Error adding product to cart:', error);
                        alert("❌ Failed to add to cart.");
                      }
                    }
                  }}
                >
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
