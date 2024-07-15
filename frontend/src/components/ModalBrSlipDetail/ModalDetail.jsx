import React from "react";
import "./ModalDetail.scss";
import Chip from "@mui/material/Chip";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";

const ModalDetail = ({ brSlip }) => {
  const date = new Date(brSlip.createdAt);
  const due = new Date(brSlip.dueDate);
  const reDate = brSlip.returnDate ? new Date(brSlip.returnDate) : 0;
  const isPending = brSlip.state === 0;
  const isBorrowing = brSlip.state === 1;
  const isReturned = brSlip.state === 2;
  const isOverDue = brSlip.state === 3;
  return (
    <div className="container">
      <div className="info">
        <div
          className="user-info"
          style={{ borderBottom: "1px solid #ccc", marginBottom: 7 }}
        >
          <p style={{ fontSize: "1.1em", fontWeight: 550 }}>Người dùng: </p>
          <p className="br-field">
            <strong>Tên: </strong> {brSlip.userId.name}
          </p>
          <p className="br-field">
            <strong>SĐT: </strong> {brSlip.userId.phoneNumber}
          </p>
        </div>
        <div className="receiver-info" style={{ borderBottom: "1px solid #ccc", marginBottom: 7 }}>
          <p style={{ fontSize: "1.1em", fontWeight: 550 }}>
            Thông tin giao hàng:{" "}
          </p>
          <p className="br-field">
            <strong>Tên người nhận: </strong> {brSlip.shippingAddress.name}
          </p>
          <p className="br-field">
            <strong>Điện thoại: </strong> {brSlip.shippingAddress.phoneNumber}
          </p>
          <p className="br-field">
            <strong>Địa chỉ: </strong>
            {brSlip.shippingAddress.address}
          </p>
        </div>
        <div className='br-state'>
          <p className="br-field">
            <strong>Ngày đặt mượn:</strong>{" "}
            {`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`}{" "}
          </p>
          {brSlip.returnDate && (
            <p className="br-field">
              <strong>Ngày trả:</strong>{" "}
              {`${reDate.getDate()}-${reDate.getMonth() + 1
                }-${reDate.getFullYear()}`}{" "}
            </p>
          )}
          <p className="br-field" style={{ color: "red" }}>
            <strong>Ngày hết hạn:</strong>{" "}
            {`${due.getDate()}-${due.getMonth() + 1}-${due.getFullYear()}`}{" "}
          </p>

          {(brSlip.lateFee && brSlip.lateFee > 0) ? (
            <p>
              <strong>Phí phạt :</strong> {' '} {brSlip.lateFee}
              {brSlip.paidLateFee === true ?
                <span><CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '1em', margin: '0 5px' }} />đã đóng phí phạt</span>
                : <span><CloseCircleTwoTone twoToneColor="#eb2f96" style={{ fontSize: '1em', margin: '0 5px' }} />chưa đóng phí phạt</span>}
            </p>
          ) : null}
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <p className="br-field">
              <strong>Trạng thái:</strong>{" "}
            </p>
            {isPending && (
              <Chip
                label="Chờ xác nhận"
                color="warning"
                variant="outlined"
              ></Chip>
            )}
            {isBorrowing && (
              <Chip label="Đang mượn" color="primary" variant="outlined"></Chip>
            )}
            {isReturned && (
              <Chip label="Đã trả" color="success" variant="outlined"></Chip>
            )}
            {isOverDue && (
              <Chip label="Quá hạn" color="error" variant="outlined"></Chip>
            )}
          </div>
        </div>
      </div>
      <div className="br-details">
        <p className="br-header">
          <strong>Chi tiết phiếu:</strong>
        </p>

        {brSlip.books != null && (
          <div className="item-list">
            {brSlip.books.map((item) => (
              <div key={item.bookId._id} className="br-item">
                <img
                  src={item.bookId?.coverImg}
                  alt={item.bookId?.name == null ? "" : item.bookId?.name}
                  className="cover-image"
                />
                <p className="item-field">
                  Tên sách:{" "}
                  {item.bookId.name == null
                    ? " Bạn chưa đặt sách"
                    : item.bookId.name}
                </p>
                <p className="item-field">Số lượng: {item.quantity}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalDetail;
