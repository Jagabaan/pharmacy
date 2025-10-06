import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import './TrackingPage.css';
import axios from 'axios';

export function TrackingPage() {
  const { orderId, productId } = useParams();
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Missing token. Please log in.');
      return;
    }

    axios
      .get(`http://localhost:3000/api/orderitems/${orderId}/${productId}/status`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => setTrackingData(res.data))
      .catch(err => {
        console.error(err);
        setError('Failed to fetch tracking info');
      });
  }, [orderId, productId]);

  const renderProgressClass = (step) => {
    if (!trackingData) return '';

    const steps = ['Preparing', 'Shipped', 'Delivered'];
    const currentIndex = steps.indexOf(trackingData.deliveryStatus);
    const stepIndex = steps.indexOf(step);

    if (stepIndex === currentIndex) return 'progress-label current-status';
    if (stepIndex < currentIndex) return 'progress-label completed-status';
    return 'progress-label';
  };

  return (
    <>
      <Header />

      <div className="tracking-page">
        <div className="order-tracking">
          <a className="back-to-orders-link link-primary" href="/orders">
            View all orders
          </a>

          {error ? (
            <div className="error-message">{error}</div>
          ) : !trackingData ? (
            <div className="loading-message">Loading tracking info...</div>
          ) : (
            <>
              <div className="delivery-date">
                Arriving on {new Date(trackingData.estimatedDeliveryTimeMs).toLocaleDateString()}
              </div>

              <div className="product-info">
                {trackingData.name}
              </div>

              <div className="product-info">
                Quantity: {trackingData.quantity}
              </div>

              <img className="product-image" src={trackingData.imageUrl} alt={trackingData.name} />

              <div className="progress-labels-container">
                <div className={renderProgressClass('Preparing')}>Preparing</div>
                <div className={renderProgressClass('Shipped')}>Shipped</div>
                <div className={renderProgressClass('Delivered')}>Delivered</div>
              </div>

              <div className="progress-bar-container">
                <div
                className="progress-bar"
                style={{
                  width:
                    trackingData.deliveryStatus === 'Preparing'
                      ? '33%'
                      : trackingData.deliveryStatus === 'Shipped'
                      ? '66%'
                      : '100%'
                }}
              ></div>
                            </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
