import React from "react";
import "./ModalDetail.scss";
import { Numeral } from "react-numeral";
import moment from "moment";
import Chip from "@mui/material/Chip";
const ModalDetailBr = ({ datasrc }) => {
  return (
    <div className="order-container">
      <div className="order-info">
        <p className="order-field">
          <strong>Tên:</strong> {datasrc.name}
        </p>
        {/*<p className="order-field">
          <strong>Địa chỉ:</strong> {datasrc.address}
        </p>*/}
        <p className="order-field">
          <strong>Điện thoại:</strong> {datasrc.phoneNumber}
        </p>
        <p className="order-field">
          <strong>Tổng số lượng:</strong>{" "}
          {<Numeral value={datasrc.totalAmount} format={"0,0"} />}
        </p>

        <div className="order-field" style={{ display: 'flex', justifyContent: 'flex-start', gap: '7px' }}>
          <strong>Trạng thái:</strong>{" "}
          {datasrc.state === 1 ? (
            <Chip label="Đang mượn" color="warning" variant="outlined" />
          ) : datasrc.state === 2 ? (
            <Chip label="Đã trả" variant="outlined" color="success" />
          ) : (
            <Chip label="Quá hạn" variant="outlined" color="error" />
          )}
        </div>
      </div>
      <div className="order-details">
        <p className="order-header">
          <strong>Chi tiết phiếu mượn:</strong>
        </p>
        <div className="item-list">
          {datasrc.books.map((item) => (
            <div key={item.bookId._id} className="order-item">
              <img
                src={item.bookId.coverImg}
                alt={item.bookId.name}
                className="product-image"
              />
              <p className="item-field">Tên sách: {item.bookId.name}</p>
              <p className="item-field">Tác giả: {item.bookId.author}</p>
              <p className="item-field">Số lượng: {item.quantity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalDetailBr;
