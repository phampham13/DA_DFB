import React from "react";
import "../BookManage/ModalBookDetail.scss";

const ModalProduct = ({ product }) => {
    return (
        <div className="book-container">
            <div className="book-info">
                <p className="book-field"><strong>Tên sản phẩm:</strong> {product.name}</p>
                <p className="book-field"><strong>Giá:</strong> {product.price}</p>
                <p className="book-field"><strong>Số lượng:</strong> {product.quantity}</p>
                <p className="book-field"><strong>Mô tả:</strong> {product.description}</p>

            </div>
            <div className="book-details">
                <div className="book-item">
                    <img src={product.image} alt={product.name} className="book-image" />
                </div>
            </div>
        </div>
    )
}

export default ModalProduct;