import { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Header } from '../components/Header';
import './OrdersPage.css';
import { Link, useNavigate } from 'react-router-dom'; // ✅ useNavigate added

export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // ✅ initialize navigate

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login'); // ✅ redirect to login page if no token
      return;
    }

    axios.get('http://localhost:3000/api/orderitems', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setOrders(res.data.orders);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);

        // ✅ redirect to login if token is invalid or expired
        if (err.response && err.response.status === 401) {
          navigate('/login');
        } else {
          setError("Failed to fetch orders");
          setLoading(false);
        }
      });
  }, [navigate]);

  return (
    <>
      <title>Orders</title>
      <Header />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        {loading ? (
          <div className="loading-message">Loading orders...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : orders.length === 0 ? (
          <div className="no-orders-message">You have no orders yet.</div>
        ) : (
          <div className="orders-grid">
            {orders.map(order => (
              <div className="order-container" key={order._id}>
                <div className="order-header">
                  <div className="order-header-left-section">
                    <div className="order-date">
                      <div className="order-header-label">Order Placed:</div>
                      <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="order-total">
                      <div className="order-header-label">Total:</div>
                      <div>₦{(order.totalCostCents / 100).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="order-header-right-section">
                    <div className="order-header-label">Order ID:</div>
                    <div>{order._id}</div>
                  </div>
                </div>

                <div className="order-details-grid">
                  {order.products.map(product => (
                    <Fragment key={product._id}>
                      <div className="product-image-container">
                        <img
                          src={product.productId.imageUrl}
                          alt={product.productId.name}
                        />
                      </div>

                      <div className="product-details">
                        <div className="product-name">{product.productId.name}</div>
                        <div className="product-delivery-date">
                          Arriving on:{" "}
                          {new Date(product.estimatedDeliveryTimeMs).toLocaleDateString()}
                        </div>
                        <div className="product-quantity">
                          Quantity: {product.quantity}
                        </div>
                      </div>

                      <div className="product-actions">
                        <Link to={`/tracking/${order._id}/${product.productId._id}`}>
                          <button className="track-package-button button-secondary">
                            Track package
                          </button>
                        </Link>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
