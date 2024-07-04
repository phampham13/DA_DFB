import React from "react";
import "./ModalOrderDetail.scss";
import { convertPrice } from "../../../utils/utils";
import Chip from '@mui/material/Chip';

const ModalOrderDetail = ({ order }) => {
    const date = new Date(order.createdAt)
    return (
        <div className="order-container">
            <div className="order-info">
                <div>
                    <p className="order-field"><strong>Tên người dùng:</strong> {order.user.name}</p>
                    <p className="order-field"><strong>Số điện thoại:</strong> {order.user.phoneNumber}</p>
                </div>
                <div style={{ borderTop: '1px solid #ccc' }}>
                    <p><strong>Thông tin giao hàng: </strong></p>
                    <p className="order-field"><strong>Tên người nhận:</strong> {order.shippingAddress.name}</p>
                    <p className="order-field"><strong>Địa chỉ:</strong> {order.shippingAddress.address}</p>
                    <p className="order-field"><strong>Điện thoại:</strong> {order.shippingAddress.phoneNumber}</p>
                    <p className="order-field"><strong>Ghi chú: </strong> {order.note} </p>
                </div>
                <div style={{ borderTop: '1px solid #ccc' }}>
                    <p className="order-field"><strong>Ngày đặt hàng:</strong>{`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`}</p>
                    <p className="order-field"><strong>Thanh toán:</strong> {order.isPaid ? <span>Đã chuyển khoản</span> : <span>Thanh toán khi nhận</span>} </p>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '7px' }}>
                        <p className="order-field"><strong>Trạng thái:</strong></p>
                        {order.status === "pending" ? <Chip label="Pending" variant="outlined" color="warning" /> : order.status === "shipped" ? <Chip label="Shipped" variant="outlined" color="primary" /> : <Chip label="Returned" variant="outlined" color="primary" />}
                    </div>
                </div>
            </div>
            <div className="order-details">
                <p className="order-header"><strong>Chi tiết sản phẩm:</strong></p>
                <div className="item-list">

                    {order.orderItems.map((item) => (
                        <div key={item.productId._id} className="order-item">
                            <img src={item.productId?.image} alt={item.image} className="product-image" />
                            <p className="item-field">Tên sản phẩm: {item.productId.name}</p>
                            <p className="item-field">Giá: {convertPrice(item.productId.price)}</p>
                            <p className="item-field">Số lượng: {item.quantity}</p>
                            {/* <p className="item-field">Kích thước: {item.size}</p> */}
                        </div>
                    ))}
                </div>
                <p className="order-field"><strong>Tổng tiền: </strong><span style={{ color: '#fe0000' }}>{convertPrice(order.itemsPrice)}</span></p>
            </div>
        </div>

    )
}

export default ModalOrderDetail;