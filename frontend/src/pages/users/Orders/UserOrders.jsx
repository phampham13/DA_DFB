import classNames from "classnames/bind";
import styles from "./UserOrders.module.scss";
import Chip from '@mui/material/Chip';
import { Modal, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { convertPrice } from "../../../utils/utils";
import { getAllUserOrder, cancelOrder } from "../../../services/OrderService";
import { refundOrder } from "../../../services/PaymentService";
import ModalOrderDetail from "../../admins/HandmadeManage/ModalOrderDetail";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);
const UserOrders = () => {
    const [listOrder, setlistOrder] = useState([])
    const token = localStorage.getItem("token")
    const user = useSelector((state) => state.user)
    const [selectedOrder, setSelectedOrder] = useState({})
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        getAll()
    }, [])

    const getAll = async () => {
        const res = await getAllUserOrder(token, user.id)
        const data = res.data
        setlistOrder(data)
    }

    const handleCancel = (order) => {
        setSelectedOrder(order)
        setShowCancelModal(true)
    }

    const handleGetDetail = (order) => {
        setSelectedOrder(order)
        setShowModal(true)
    }

    const handleCloseCancelModal = () => {
        setShowCancelModal(false)
    }


    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handleConfirmCancel = async () => {
        let newList = listOrder.filter((item) => item._id !== selectedOrder._id)
        if (selectedOrder.transId) {
            const refund = await refundOrder({
                amount: selectedOrder.itemsPrice,
                transId: selectedOrder.transId
            })
            if (refund.resultCode === 0) {
                toast.success("Hoàn tiền thành công")
            } else {
                toast.error("Hoàn tiền thất bại")
            }
        }
        const res = await cancelOrder(token, selectedOrder._id)
        if (res.status !== "OK") {
            toast.error(res.message)
        } else {
            setlistOrder(newList)
            toast.success("Hủy order thành công")
        }
        setShowCancelModal(false)
    }


    return (
        <div className={cx("wrapper")}>
            <div className={cx("header")}>
                <img src="../tiemhandlogo.png" style={{ width: '150px', height: '150px', objectFit: 'contain' }} />
                <div>
                    {listOrder.length === 0 ? (
                        <p><i>Bạn chưa có đơn hàng nào. Hãy ghé qua tiệm Hand của tụi mình</i><img src="../lucky.png" style={{ height: "40px", width: '40px', objectFit: 'contain' }} /></p>
                    ) : (
                        <p><i>Cảm ơn bạn đã mua hàng của chúng mình </i> <img src="../star.png" style={{ height: "40px", width: '40px', objectFit: 'contain' }} className={cx('rotate')} /> </p>
                    )}
                    <p><i>Toàn bộ số tiền gây quỹ từ tiệm sẽ được ủng hộ cho thư viện cộng đồng D Free Book, vì sách ở đây là hoàn toàn miễn phí</i></p>
                </div>
            </div>
            {listOrder.length > 0 && (
                <div className={cx("list")}>
                    {listOrder.map((order) => {
                        const isPending = order.status === "pending"
                        const isShipped = order.status === "shipped"
                        const isReturned = order.status === "returned"
                        return (
                            <div className={cx('item')} key={order._id}>
                                <img src={order.orderItems[0].productId.image} style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
                                <div style={{ width: '15%' }}>
                                    <p><b>Người nhận: </b></p>
                                    <p>{order.shippingAddress.name}</p>
                                </div>
                                <div style={{ width: '15%' }}>
                                    <p><b>Giá trị: </b></p>
                                    <p>{convertPrice(order.itemsPrice)}</p>
                                </div>
                                <div style={{ width: '15%' }}>
                                    <p><b>Thanh toán: </b></p>
                                    {!order.isPaid ? <p>Thanh toán khi nhận</p> : <p>Đã chuyển khoản</p>}
                                </div>
                                <div style={{ width: '15%' }}>
                                    {isPending && <Chip label="Chờ xác nhận" color="warning" variant="outlined" size="large" sx={{ width: '120px', borderWidth: '2px' }} onClick={() => handleCancel(order)}></Chip>}
                                    {isShipped && <Chip label="Đã ship" color="success" variant="outlined" size="large" sx={{ width: '100px', borderWidth: '2px' }} ></Chip>}
                                    {isReturned && <Chip label="Hoàn hàng" color="error" variant="outlined" size="large" sx={{ width: '100px', borderWidth: '2px' }}></Chip>}
                                </div>
                                <div style={{ width: '15%' }} >
                                    <button onClick={() => handleGetDetail(order)}>Chi tiết</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
            <Modal show={showCancelModal} onHide={handleCloseCancelModal} size="sm">
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận hủy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn chắc chắn muốn hủy phiếu mượn này?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className={cx("btn-close-modal")} style={{ backgroundColor: "#36a2eb" }} onClick={handleCloseCancelModal}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={() => handleConfirmCancel()}>
                        Xác nhận hủy
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Thông tin đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ModalOrderDetail order={selectedOrder} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className={cx("btn-close-modal")} style={{ backgroundColor: "#36a2eb" }} onClick={handleCloseModal}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default UserOrders;