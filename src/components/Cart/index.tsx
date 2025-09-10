import useCartModel, { CartItem } from '../../model/useCartModel';
import styles from './index.module.less';
import { useTranslation } from "react-i18next"

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice
  } = useCartModel();
  const { t } = useTranslation('common');
  
  return (
    <div className={styles.cart}>
      <h2>t('home.shoppingCart') ({totalItems})</h2>
      
      {cartItems.length === 0 ? (
        <div className={styles.empty}>t('cart.emptyCart')</div>
      ) : (
        <>
          <ul className={styles.list}>
            {cartItems.map((item: CartItem) => (
              <li key={item.id} className={styles.item}>
                <div className={styles.info}>
                  <h3>{item.name}</h3>
                  <p>¥{item.price.toFixed(2)}</p>
                </div>
                <div className={styles.actions}>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    +
                  </button>
                  <button 
                    className={styles.remove}
                    onClick={() => removeFromCart(item.id)}
                  >
                    t('cart.delete')
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.summary}>
            <div>t('cart.totalPoints'): ¥{totalPrice.toFixed(2)}</div>
            <button className={styles.checkout}>t('cart.redeemNow')</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
