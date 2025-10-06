import './checkout-header.css';
import './checkoutPage.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

export function CheckoutPage({ cart }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [summary, setSummary] = useState({});
  const [selectedDeliveryOptions, setSelectedDeliveryOptions] = useState({});

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:3000/api/deliveryoptions'),
      axios.get('http://localhost:3000/api/summary', authHeader)
    ])
      .then(([deliveryRes, summaryRes]) => {
        const options = deliveryRes.data;
        setDeliveryOptions(options);
        setSummary(summaryRes.data);

        const validOptionIds = new Set(options.map(opt => opt._id));
        const stored = localStorage.getItem('selectedDeliveryOptions');
        let parsed = {};

        try {
          parsed = stored ? JSON.parse(stored) : {};
        } catch {
          localStorage.removeItem('selectedDeliveryOptions');
        }

        const updated = { ...parsed };
        let changed = false;

        cart.forEach(item => {
          const current = parsed[item._id];
          if (!current || !validOptionIds.has(current._id)) {
            const fallback = options[0];
            updated[item._id] = {
              _id: fallback._id,
              deliveryDate: fallback.deliveryDate,
              priceCents: fallback.priceCents
            };
            axios.put(
              `http://localhost:3000/api/cartitems/${item._id}`,
              { deliveryOptionId: fallback._id },
              authHeader
            );
            changed = true;
          }
        });

        if (changed) {
          localStorage.setItem('selectedDeliveryOptions', JSON.stringify(updated));
        }

        setSelectedDeliveryOptions(updated);
      })
      .catch(error => console.error("Fetch failed:", error));
  }, [cart]);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/api/cartitems/${id}`, authHeader)
      .then(() => window.location.reload())
      .catch(err => console.error("Delete failed:", err));
  };

  const handleQuantityUpdate = (id, currentQty) => {
    const newQty = prompt("Enter new quantity:", currentQty);
    if (!newQty || isNaN(newQty) || parseInt(newQty) < 1) return;

    axios.put(
      `http://localhost:3000/api/cartitems/${id}`,
      { quantity: parseInt(newQty) },
      authHeader
    )
      .then(() => window.location.reload())
      .catch(err => console.error("Update failed:", err));
  };

  const handleDeliveryOptionChange = (cartItemId, option) => {
    axios.put(
      `http://localhost:3000/api/cartitems/${cartItemId}`,
      { deliveryOptionId: option._id },
      authHeader
    )
      .then(() => {
        const updated = {
          ...selectedDeliveryOptions,
          [cartItemId]: option
        };
        setSelectedDeliveryOptions(updated);
        localStorage.setItem('selectedDeliveryOptions', JSON.stringify(updated));
      })
      .catch(err => console.error("Delivery update failed:", err));
  };

  const handlePlaceOrder = async () => {
    if (!window.confirm("Are you sure you want to place this order?")) return;

    try {
      const products = cart.map(item => {
        const selected = selectedDeliveryOptions[item._id];
        if (!selected) {
          throw new Error("Missing delivery option for some items.");
        }

        return {
          productId: item.productId._id || item.productId,
          quantity: item.quantity,
          deliveryOptionId: selected._id,
          estimatedDeliveryTimeMs: new Date(selected.deliveryDate).getTime()
        };
      });

      console.log('Token:', token);
console.log('Auth header:', authHeader);

      await axios.post('http://localhost:3000/api/createorder', { products }, authHeader);

      alert("✅ Order placed successfully!");
      localStorage.removeItem('selectedDeliveryOptions');
      window.location.href = "/";
    } catch (error) {
      console.error("Order placement failed:", error);
      alert(error?.response?.data?.error || "❌ Failed to place order. Try again.");
    }
  };

  return (
    <>
      <title>Checkout</title>

      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <a href="/">
              <img className="logo" src="images/logo.png" />
              <img className="mobile-logo" src="images/mobile-logo.png" />
            </a>
          </div>
          <div className="checkout-header-middle-section">
            Checkout (<a className="return-to-home-link" href="/">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} items
            </a>)
          </div>
          <div className="checkout-header-right-section">
            <img src="images/icons/checkout-lock-icon.png" />
          </div>
        </div>
      </div>

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <div className="order-summary">
            {cart.map(cartItem => {
              const delivery = selectedDeliveryOptions[cartItem._id];
              const selectedDate = delivery ? new Date(delivery.deliveryDate).toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              }) : 'Not set';

              return (
                <div className="cart-item-container" key={cartItem._id}>
                  <div className="delivery-date">
                    {delivery ? `Delivery date: ${selectedDate}` : 'Delivery date will be shown below'}
                  </div>

                  <div className="cart-item-details-grid">
                    <img className="product-image" src={cartItem.productId.imageUrl} />

                    <div className="cart-item-details">
                      <div className="product-name">{cartItem.productId.name}</div>
                      <div className="product-price">₦{cartItem.productId.price}</div>
                      <div className="product-quantity">
                        <span>
                          Quantity: <span className="quantity-label">{cartItem.quantity}</span>
                        </span>
                        <span
                          className="update-quantity-link link-primary"
                          onClick={() => handleQuantityUpdate(cartItem._id, cartItem.quantity)}
                        >
                          Update
                        </span>
                        <span
                          className="delete-quantity-link link-primary"
                          onClick={() => handleDelete(cartItem._id)}
                        >
                          Delete
                        </span>
                      </div>
                    </div>

                    <div className="delivery-options">
                      <div className="delivery-options-title">Choose a delivery option:</div>
                      {deliveryOptions.map(option => (
                        <div className="delivery-option" key={option._id}>
                          <input
                            type="radio"
                            className="delivery-option-input"
                            name={`delivery-option-${cartItem._id}`}
                            value={option._id}
                            checked={delivery?._id === option._id}
                            onChange={() => handleDeliveryOptionChange(cartItem._id, option)}
                          />
                          <div>
                            <div className="delivery-option-date">
                              {new Date(option.deliveryDate).toLocaleDateString('en-GB', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="delivery-option-price">
                              ₦{(option.priceCents / 100).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="payment-summary">
            <div className="payment-summary-title">Payment Summary</div>
            <div className="payment-summary-row">
              <div>Items ({summary?.summary?.totalItems}):</div>
              <div className="payment-summary-money">
                ₦{summary?.summary?.totalProductCost?.toLocaleString()}
              </div>
            </div>
            <div className="payment-summary-row">
              <div>Shipping &amp; handling:</div>
              <div className="payment-summary-money">
                ₦{summary?.summary?.totalShippingCost?.toLocaleString()}
              </div>
            </div>
            <div className="payment-summary-row total-row">
              <div>Order total:</div>
              <div className="payment-summary-money">
                ₦{summary?.summary?.totalOrderCost?.toLocaleString()}
              </div>
            </div>
            <button
              className="place-order-button button-primary"
              onClick={handlePlaceOrder}
            >
              Place your order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
