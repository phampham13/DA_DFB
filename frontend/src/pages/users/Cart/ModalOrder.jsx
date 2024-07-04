import classNames from "classnames/bind";
import styles from "./ModalOrder.module.scss"
import React, { useEffect, useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup"
import { AuthContext } from "../../../contexts/AuthContext";
//import { resetCard, updateCard } from "../../../redux/slides/borrowerCardSlice";
import { convertPrice } from "../../../utils/utils";
import { createOrder } from "../../../services/OrderService";
import { removeAllOrderProduct } from "../../../redux/slides/cartSlice";
import { useNavigate } from "react-router-dom";
import { updateCart } from "../../../services/CartService";
import Loading from "../../../components/LoadingComponent/Loading";
import { createPayment } from "../../../services/PaymentService";

const cx = classNames.bind(styles);
const ModalOrder = ({ show, handleClose, listProduct, itemsPrice, listChecked }) => {
    const dispatch = useDispatch()
    const navigateTo = useNavigate()
    const { user, token } = useContext(AuthContext)
    const userInfo = useSelector((state) => state.user)
    const cart = useSelector((state) => state.cart)
    const [close, setClose] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [payUrl, setPayUrl] = useState("")

    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [wards, setWards] = useState([]);
    const [selectedWard, setSelectedWard] = useState("");
    const phoneRegExp = /^[0-9]{10,}$/;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json");
                setCities(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
        console.log(listProduct, itemsPrice)
    }, []);

    useEffect(() => {
        if (payUrl) {
            handleClose();
            window.open(payUrl, "_blank");
        }
    }, [payUrl, handleClose]);

    const handleCityChange = (e) => {
        const cityName = e.target.value;
        const selectedCityData = cities.find((city) => city.Name === cityName);
        setDistricts(selectedCityData ? selectedCityData.Districts : []);
        formik.setFieldValue("city", cityName);
        formik.setFieldValue("district", "");
        formik.setFieldValue("ward", "");
    };
    const handleDistrictChange = (e) => {
        const districtName = e.target.value;
        const selectedDistrictData = districts.find((district) => district.Name === districtName);
        setWards(selectedDistrictData ? selectedDistrictData.Wards : []);
        formik.setFieldValue("district", districtName);
        formik.setFieldValue("ward", "");
    };
    const handleWardChange = (e) => {
        const wardName = e.target.value;
        formik.setFieldValue("ward", wardName);
    };

    const formik = useFormik({
        initialValues: {
            receiverName: userInfo.name,
            phoneNumber: userInfo.phoneNumber,
            note: "",
            address: "",
            city: "",
            district: "",
            ward: "",
            paymentMethod: "",
            status: 0,
        },
        validationSchema: Yup.object({
            receiverName: Yup.string().required("Vui lòng nhập tên người nhận"),
            phoneNumber: Yup.string().matches(phoneRegExp, "Số điện thoại không hợp lệ").required("Bạn chưa nhập số điện thoại"),
            address: Yup.string().required("Vui lòng nhập địa chỉ (số nhà, đường/ thôn)"),
            city: Yup.string().required("Bạn chưa chọn tỉnh/ thành phố"),
            district: Yup.string().required("Bạn chưa chọn quận/huyện"),
            ward: Yup.string().required("Bạn chưa chọn phường/xã"),
            paymentMethod: Yup.string().required("Vui lòng chọn hình thức thanh toán"),
        }),
        onSubmit: async (values) => {
            setIsLoading(true)
            const dataToSend = {
                name: values.receiverName,
                phoneNumber: values.phoneNumber,
                address: `${values.address}, ${values.ward}, ${values.district}, ${values.city}`,
                note: values.note,
                orderItems: listProduct,
                userId: userInfo.id,
                email: userInfo.email,
                itemsPrice: itemsPrice,
                isPaid: values.paymentMethod === "momo" ? true : false
            }
            console.log("dữ liệu đây", dataToSend)
            const res = await createOrder(token, dataToSend)
            if (res.status !== "OK") {
                toast.error(res.message)
                handleClose()
            } else {
                const newCart = cart?.products?.filter((item) => !listChecked.includes(item.productId._id))
                const dataToSave = newCart.map((p) => ({
                    productId: p.productId._id,
                    quantity: p.quantity
                }))
                dispatch(removeAllOrderProduct({ listChecked }))
                await updateCart(userInfo.id, token, { products: dataToSave })
                if (values.paymentMethod === "momo") {
                    const url = await createPayment({
                        orderId: res.data._id,
                        ipn: "payOrder",
                        amount: res.data.itemsPrice
                    })
                    console.log("url model", url)
                    setPayUrl(url.payUrl)
                }
                toast.success("Đặt hàng thành công, CTV sẽ sớm xác nhận đơn hàng")
            }
            setIsLoading(false)
            handleClose()
        },
    })

    return (
        <Modal show={show} onHide={handleClose} size="lg" backdrop="static" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Đơn hàng</Modal.Title>
            </Modal.Header>
            <Loading isLoading={isLoading}>
                <Modal.Body>
                    <form action="" method="POST" className={cx("form")} onSubmit={formik.handleSubmit} id={cx("form-1")}>
                        <div className={cx("container")}>
                            <div className={cx("delivery-info")}>
                                <p className={cx("header")}><strong>Thông tin hàng:</strong></p>
                                <div className={cx("form-input")}>
                                    <input id={cx("receiverName")} name="receiverName" type="text" placeholder="Tên người nhận" value={formik.values.receiverName} onChange={formik.handleChange} className={cx("form-control")} />
                                    {formik.errors.receiverName && formik.touched.receiverName && <span className={cx("form-message")}>{formik.errors.receiverName}</span>}
                                </div>
                                <div className={cx("form-input")}>
                                    <input id={cx("phoneNumber")} name="phoneNumber" type="text" placeholder="Số điện thoại" value={formik.values.phoneNumber} onChange={formik.handleChange} className={cx("form-control")} />
                                    {formik.errors.phoneNumber && formik.touched.phoneNumber && <span className={cx("form-message")}>{formik.errors.phoneNumber}</span>}
                                </div>
                                <div className={cx("form-input")}>
                                    <input id={cx("note")} name="note" type="text" placeholder="Ghi chú của bạn về đơn hàng" value={formik.values.note} onChange={formik.handleChange} className={cx("form-control")} />
                                </div>
                                <div className={cx('address')}>
                                    <p><strong>Địa chỉ: </strong></p>
                                    <div className={cx("optionDiv")}>
                                        <select value={formik.values.city} onChange={handleCityChange}>
                                            <option value="" disabled>
                                                Chọn tỉnh thành
                                            </option>
                                            {cities.map((city) => (
                                                <option key={city.Id} value={city.Name}>
                                                    {city.Name}
                                                </option>
                                            ))}
                                        </select>
                                        {formik.errors.city && formik.touched.city && (
                                            <span className={cx("form-message")}>
                                                <br></br>
                                                {formik.errors.city}
                                            </span>
                                        )}
                                    </div>
                                    <div className={cx("optionDiv")}>
                                        <select value={formik.values.district} onChange={handleDistrictChange}>
                                            <option value="" disabled>
                                                Chọn quận huyện
                                            </option>
                                            {districts.map((district) => (
                                                <option key={district.Id} value={district.Name}>
                                                    {district.Name}
                                                </option>
                                            ))}
                                        </select>
                                        {formik.errors.district && formik.touched.district && (
                                            <span className={cx("form-message")}>
                                                <br></br>
                                                {formik.errors.district}
                                            </span>
                                        )}
                                    </div>
                                    <div className={cx("optionDiv")}>
                                        <select value={formik.values.ward} onChange={handleWardChange}>
                                            <option value="" disabled>
                                                Chọn phường xã
                                            </option>
                                            {wards.map((ward) => (
                                                <option key={ward.Id} value={ward.Name}>
                                                    {ward.Name}
                                                </option>
                                            ))}
                                        </select>
                                        {formik.errors.ward && formik.touched.ward && (
                                            <span className={cx("form-message")}>
                                                <br></br>
                                                {formik.errors.ward}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className={cx('address-detail')}>
                                    <div className={cx("form-input")}>
                                        <input id={cx("address")} name="address" type="text" placeholder="Số nhà, tên đường" value={formik.values.address} onChange={formik.handleChange} className={cx("form-control")} />
                                        {formik.errors.address && formik.touched.address && <span className={cx("form-message")}>{formik.errors.address}</span>}
                                    </div>
                                </div>
                                <div className={cx('payment')}>
                                    <p><strong>Chọn hình thức thanh toán: </strong></p>
                                    <div className={cx("form-input")}>
                                        <label>
                                            <input
                                                style={{ margin: '10px' }}
                                                type="radio"
                                                name="paymentMethod"
                                                value="cashOnDelivery"
                                                checked={formik.values.paymentMethod === "cashOnDelivery"}
                                                onChange={formik.handleChange}
                                            />
                                            Thanh toán khi nhận hàng
                                        </label>
                                        <label>
                                            <input
                                                style={{ margin: '10px' }}
                                                type="radio"
                                                name="paymentMethod"
                                                value="momo"
                                                checked={formik.values.paymentMethod === "momo"}
                                                onChange={formik.handleChange}
                                            />
                                            <img src="../momo_logo.png" alt="momo_logo" style={{ width: '20px', height: '20px', objectFit: 'cover' }} />
                                            Thanh toán qua Momo
                                        </label>
                                        {formik.errors.paymentMethod && formik.touched.paymentMethod && (
                                            <span className={cx("form-message")}>'
                                                <br></br>
                                                {formik.errors.paymentMethod}
                                            </span>
                                        )}
                                    </div>

                                </div>
                            </div>

                            <div className={cx("books-details")}>
                                <p className={cx("header")}><strong>Sách:</strong></p>
                                <div className={cx("book-list")}>

                                    {listProduct.map((product) => (
                                        <div key={product.productId._id} className={cx("item")}>
                                            <img src={product.productId.image} alt={product.productId.name} className={cx("b-image")} />
                                            <p className={cx("item-field")}>Tên sản phẩm: {product.productId.name}</p>
                                            <p className={cx("item-field")}>Số lượng: {product.quantity}</p>
                                            <p className={cx("item-field")}>Giá: {convertPrice(product.productId.price * product.quantity)}</p>
                                        </div>
                                    ))}
                                </div>
                                <p style={{ fontWeight: '550' }}>Tổng giá: {convertPrice(itemsPrice)}</p>
                            </div>
                        </div>
                        <Modal.Footer>
                            <Button variant="primary" className={cx("form-submit")} type="submit" value="Submit Form">
                                Đặt hàng
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal.Body>
            </Loading>
        </Modal>
    )
}

export default ModalOrder;