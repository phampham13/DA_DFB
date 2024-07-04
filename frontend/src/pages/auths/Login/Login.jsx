import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "/src/services/auth/login";
import { Modal, Button } from "react-bootstrap";
import { AuthContext } from "../../../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { sendRequest } from "../../../services/auth/passwordReset";
//import { useMutationHooks } from "../../../hooks/useMutationHook";
//import { getListItem } from "../../../reactRedux/action/actions";
import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(styles);

export default function Login() {
    //const dispatch = useDispatch();
    const { handleLoggedin } = React.useContext(AuthContext);
    const [showModal, setShowModal] = useState(false)
    const navigateTo = useNavigate();
    const location = useLocation()
    const [email, setEmail] = useState('')

    const phoneRegExp = /^0\d{9}$/;

    const formikForm = useFormik({
        initialValues: {
            phoneNumber: "",
            password: "",
        },
        validationSchema: Yup.object({
            phoneNumber: Yup.string().matches(phoneRegExp, "Số điện thoại không hợp lệ").required("Bạn chưa nhập số điện thoại"),
            password: Yup.string().min(6, "mật khẩu tối thiểu 6 kí tự").required("Bạn chưa nhập mật khẩu"),
        }),
        onSubmit: async (values) => {
            try {
                console.log("truoc khi login", values)
                const response = await login(values);

                if (response.status === "OK") {
                    const decoded = jwtDecode(response?.access_token)
                    console.log("decode login page", decoded)
                    const user = decoded.payload;
                    const token = response.access_token
                    const refresh_token = response.refresh_token

                    if (user.id && user.role === "user") {
                        console.log(user.id)
                        // Nếu thành công, chuyển hướng đến trang Home
                        handleLoggedin(token, refresh_token, user);
                        toast.success("Đăng nhập thành công")
                        navigateTo("/")
                        //dispatch(getListItem(user.id));
                    } else {
                        if (user.id && user.role === "admin") {
                            handleLoggedin(token, refresh_token, user);
                            navigateTo("/admin/books");
                            toast.success("Đăng nhập thành công");
                        } else {
                            toast.error("Sai email hoặc mật khẩu");
                        }
                    }
                } else {
                    toast.error(`Đăng nhập thất bại!!! ${response.message}`);
                }
            } catch (error) {
                toast.error("Đăng nhập thất bại:", error);
            }
        }
    });

    const handleForgetPassword = () => {
        console.log("ấn vào p")
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handleConfirm = async () => {
        const res = await sendRequest({
            email: email
        })
        if (res.status !== "OK") {
            toast.error(res.message)
        } else {
            toast.success("Vui lòng kiểm tra email")
        }
        setShowModal(false)
    }

    return (
        <div className={cx("container")}>
            <div className={cx("heading")}>
                <h3>ĐĂNG NHẬP TÀI KHOẢN</h3>
                <p>
                    Bạn chưa có tài khoản? Đăng ký <Link to={"/signup"}>tại đây</Link>
                </p>
            </div>

            <form action="" method="POST" className={cx("form")} onSubmit={formikForm.handleSubmit} id="form-2">
                <h3 className={cx("info")} style={{ minWidth: 'fitContent', width: '100%', textAlign: 'center' }}>Thông tin cá nhân</h3>

                <div className="spacer"></div>

                <div className={cx("form-group")}>
                    <label htmlFor="phoneNumber" className={cx("form-label")}>
                        Số điện thoại<span> *</span>
                    </label>
                    <input required id="phoneNumber" name="phoneNumber" type="text" placeholder="Số điện thoại" value={formikForm.values.phoneNumber} onChange={formikForm.handleChange} className={cx("form-control")} />
                    {formikForm.errors.phoneNumber && formikForm.touched.phoneNumber && <span className={cx("form-message")}>{formikForm.errors.phoneNumber}</span>}
                </div>

                <div className={cx("form-group")}>
                    <label htmlFor="password" className={cx("form-label")}>
                        Mật khẩu<span> *</span>
                    </label>
                    <input required id="password" name="password" type="password" placeholder="Mật khẩu" value={formikForm.values.password} onChange={formikForm.handleChange} className={cx("form-control")} />
                    {formikForm.errors.password && formikForm.touched.password && <span className={cx("form-message")}>{formikForm.errors.password}</span>}
                </div>
                <p onClick={handleForgetPassword} style={{ textDecoration: 'underline', color: 'blue' }}>Quên mật khẩu</p>
                <button className={cx("form-submit")} type="submit" disabled={!formikForm.values.phoneNumber || !formikForm.values.password}>
                    Đăng nhập
                </button>
            </form>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Email đăng kí</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label htmlFor="email"> Email đăng kí tài khoản:
                        <input id="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    </label>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" style={{ border: '1px solid #aaa' }} onClick={handleCloseModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={() => handleConfirm()}>
                        Lấy lại mật khẩu
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
