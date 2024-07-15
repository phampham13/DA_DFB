import classNames from "classnames/bind";
import styles from "./BorrowerSlips.module.scss"
import Chip from '@mui/material/Chip';
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { convertPrice } from "../../../utils/utils";
import { toast } from "react-toastify";
import ModalDetail from "../../../components/ModalBrSlipDetail/ModalDetail"
import { useSelector } from "react-redux";
import { getUserBrSlip, cancelBorrow } from "../../../services/BorrowerSlipService";
import { createPayment } from "../../../services/PaymentService";

const cx = classNames.bind(styles);
const BorrowerSlips = () => {
    const [listBS, setlistBS] = useState([])
    const [bookTotal, setBookTotal] = useState(0)
    const token = localStorage.getItem("token")
    const user = useSelector((state) => state.user)
    const [selectBrSlip, setSelectBrSlip] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [overDueBrSlip, setOverDueBrSlip] = useState([])
    const [lateBrSlip, setLateBrSlip] = useState([])
    const [fee, setFee] = useState(0)
    const [payUrl, setPayUrl] = useState('')

    useEffect(() => {
        getAll()
    }, [])

    const getAll = async () => {
        const res = await getUserBrSlip(token, user.id)
        const data = res.data
        setLateBrSlip(data.filter((item) => item.state === 2 && item.lateFee > 0 && item.paidLateFee === false)) //
        setOverDueBrSlip(data.filter((item) => item.state === 3))
        setBookTotal(data.reduce((sum, cur) => sum + cur.totalAmount, 0))
        setlistBS(res.data)
    }

    const handleCancel = (slip) => {
        setSelectBrSlip(slip)
        setShowCancelModal(true)
    }

    const handleGetDetail = (slip) => {
        setSelectBrSlip(slip)
        setShowModal(true)
    }

    const handleCloseCancelModal = () => {
        setShowCancelModal(false)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handleConfirmCancel = async () => {
        let newList = listBS.filter((item) => item._id !== selectBrSlip._id)
        const res = await cancelBorrow(token, selectBrSlip._id)
        if (res.status !== "OK") {
            toast.error(res.message)
        } else {
            setBookTotal(prevBookTotal => prevBookTotal - selectBrSlip.totalAmount)
            setlistBS(newList)
            toast.success("Hủy mượn thành công")
        }
        setShowCancelModal(false)
    }

    const handlePayFee = async () => {
        console.log('ấn rồi')
        let penaltyFee = 0
        const orderId = overDueBrSlip.length > 0 ? overDueBrSlip[0]._id : lateBrSlip[0]._id
        if (overDueBrSlip.length > 0) {
            penaltyFee = overDueBrSlip.reduce((sum, cur) => sum + cur.totalAmount * 50000, 0)
        }
        if (lateBrSlip.length > 0) {
            penaltyFee = penaltyFee + lateBrSlip.reduce((sum, cur) => sum + cur.lateFee, 0)
        }
        const payPenalty = await createPayment({
            orderId: orderId,
            ipn: "handlePayPenalty",
            amount: penaltyFee
        })
        console.log('phí', penaltyFee)
        setFee(penaltyFee)
        setPayUrl(payPenalty.payUrl)
    }

    return (
        <div className={cx("wrapper")}>
            <div className={cx("header")}>
                <img src='../reader2.png' style={{ width: 150, height: 150, objectFit: 'contain' }} />
                {bookTotal > 20 ? (
                    <div>
                        <h5>Bạn đọc thân thiết của D Free Book</h5>
                        <p>Bạn đã mượn <span style={{ color: 'red', fontSize: '1.1em' }}> {bookTotal} </span> <AutoStoriesIcon style={{ color: '#30a7b4' }} /> qua web của D Free Book</p>
                    </div>
                ) : (
                    <div>
                        <h5>Bạn đọc mới của D Free Book</h5>
                        <p>Bạn đã mượn <span style={{ color: 'red', fontSize: '1.1em' }}>{bookTotal}</span> <AutoStoriesIcon style={{ color: '#30a7b4' }} /> qua web của D Free Book</p>
                    </div>
                )}
                {(overDueBrSlip.length > 0 || lateBrSlip.length > 0) && (
                    <div>
                        {overDueBrSlip.length > 0 && <p>Bạn có <span style={{ fontWeight: 550, fontSize: '1.1em', color: 'red' }}>{overDueBrSlip.length}</span> phiếu mượn quá hạn </p>}
                        {lateBrSlip.length > 0 && <p>Bạn có <span style={{ fontWeight: 550, fontSize: '1.1em', color: 'red' }}>{lateBrSlip.length}</span> phiếu chưa thanh toán phí phạt </p>}
                        <p><i> Vui lòng trả lại thư viện/ nộp phạt sớm nhất có thể. Tài khoản của bạn sẽ bị khóa đến khi bạn trả lại sách và đóng phí phạt trả muộn </i></p>
                        <p><span style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => handlePayFee()}>Xem tổng phí phạt</span></p>
                        {payUrl && fee &&
                            <p>
                                Phí phạt của bạn là {convertPrice(fee)} <br></br>
                                Nhấp vào liên kết sau để tiếp tục thanh toán bằng Momo
                                <a href={payUrl} target="_blank">Thanh toán qua Momo</a>
                            </p>}
                    </div>
                )}
            </div>

            {listBS.length > 0 ? (
                <div className={cx('list')}>
                    {listBS.map((slip) => {
                        const isPending = slip.state === 0
                        const isBorrowing = slip.state === 1
                        const isReturned = slip.state === 2 && !slip.lateFee
                        const isReturnedLate = slip.state === 2 && slip.lateFee
                        const isOverDue = slip.state === 3
                        return (
                            <div className={cx('item')} key={slip._id}>
                                <img src={slip.books[0].bookId.coverImg} style={{ width: '75px', height: '100px', objectFit: 'contain' }} />
                                <div style={{ width: '25%' }}>
                                    <p><b>Người nhận: </b></p>
                                    <p>{slip.shippingAddress.name}</p>
                                </div>
                                <div style={{ width: '20%', fontSize: '0.8em', lineHeight: '16px' }}>
                                    {isReturnedLate && slip.paidLateFee === false &&
                                        <i>Chưa nộp phí phạt</i>
                                    }
                                </div>
                                <div style={{ width: '20%' }}>
                                    {isPending && <Chip label="Chờ xác nhận" color="warning" variant="outlined" size="large" sx={{ width: '120px', borderWidth: '2px' }} onClick={() => handleCancel(slip)}></Chip>}
                                    {isBorrowing && <Chip label="Đang mượn" color="primary" variant="outlined" size="large" sx={{ width: '100px', borderWidth: '2px' }} ></Chip>}
                                    {isReturned && <Chip label="Đã trả" color="success" variant="outlined" size="large" sx={{ width: '100px', borderWidth: '2px' }}></Chip>}
                                    {isReturnedLate && <Chip label="Trả muộn" color="success" variant="outlined" size="large" sx={{ width: '100px', borderWidth: '2px' }}></Chip>}
                                    {isOverDue && <Chip label="Quá hạn" color="error" variant="outlined" size="large" sx={{ width: '100px', borderWidth: '2px' }}></Chip>}
                                </div>
                                <div style={{ width: '15%' }} >
                                    <button onClick={() => handleGetDetail(slip)}>Chi tiết</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className={cx("list")}>
                    <div style={{ margin: 'auto' }}>
                        <img src="../lucky.png" style={{ width: "200px", height: '200px' }} /><br></br>
                        <p style={{ fontSize: '1.2em' }}>Bạn chưa mượn phiếu nào!</p>
                    </div>
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
                        Không
                    </Button>
                    <Button variant="danger" onClick={() => handleConfirmCancel()}>
                        Xác nhận hủy
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Thông tin phiếu mượn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ModalDetail brSlip={selectBrSlip} />
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

export default BorrowerSlips;