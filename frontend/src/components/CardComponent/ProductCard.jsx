import React from 'react';
import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductCard.module.scss';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { convertPrice } from '../../utils/utils';
const cx = classNames.bind(styles);

const ProductCard = ({ product, onAddToCart }) => {
    const [productAmount, setProductAmount] = useState(0);
    const [showModalImg, setShowModalImg] = useState(false)
    const [img, setImg] = useState("")

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

    const handleImgClick = (productImg) => {
        setImg(productImg)
        setShowModalImg(true)
    }

    const handleCloseModal = () => {
        setShowModalImg(false)
    }

    return (
        <div className={cx("card")}>
            <div className={cx("card-content")}>
                <div className={cx("card-left")} onClick={() => handleImgClick(product.image)}>
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
            <Modal show={showModalImg} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Ảnh</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <img src={img} alt={img} style={{ width: '600px', height: '600px', objectFit: 'contain' }} />
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ProductCard;


