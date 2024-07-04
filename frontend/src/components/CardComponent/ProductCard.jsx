import React from 'react';
import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductCard.module.scss';
import { toast } from 'react-toastify';
import { convertPrice } from '../../utils/utils';
const cx = classNames.bind(styles);

const ProductCard = ({ product, onAddToCart }) => {
    const [productAmount, setProductAmount] = useState(0);

    const handleInputChange = (event) => {
        const value = parseInt(event.target.value);
        if (!isNaN(value)) {
            setProductAmount(value);
        } else {
            toast.warning("Số lượng phải là số")
        }
    };

    const handleAddToCartClick = () => {
        if (productAmount === 0) {
            toast.warning("Vui lòng điều chỉnh số lượng")
        } else {
            onAddToCart(product, productAmount);
        }
    };

    return (
        <div className={cx("card")}>
            <div className={cx("card-content")}>
                <div className={cx("card-left")}>
                    <img src={product.image} alt={product.name} className={cx("card-img")} />
                    <p style={{ fontSize: '0.9em' }} className={cx("card-desc")}><i>{product.description}</i></p>
                </div>
                <div className={cx("card-right")}>
                    <h2 className={cx("card-title")}>{product.name}</h2>
                    <p className={cx("card-price")}>Giá:<span style={{ color: '#e92727' }}>{convertPrice(product.price)}</span></p>
                    <p className={cx("card-availability")}>Sẵn có: {product.quantity}</p>
                    <div className={cx("card-add")}>
                        <input type="number" min="1" max={product.quantity} onChange={handleInputChange} defaultValue="0" />
                        <button onClick={handleAddToCartClick}>Thêm vào giỏ</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;


