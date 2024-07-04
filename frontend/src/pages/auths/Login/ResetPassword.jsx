import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import { jwtDecode } from "jwt-decode";
import { useFormik } from "formik";
import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from "../../../services/auth/passwordReset";
import * as Yup from "yup";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);
const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate()

    // Hàm để lấy query parameters
    const queryParams = new URLSearchParams(location.search);

    // Ví dụ: Lấy giá trị của một query parameter cụ thể
    const token = queryParams.get('token');



    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            password: Yup.string().min(6, "mật khẩu tối thiểu 6 kí tự").required("Bạn chưa nhập mật khẩu"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
                .required("Vui lòng xác nhận mật khẩu"),
        }),
        onSubmit: async (values) => {
            try {
                const decode = jwtDecode(token)
                const email = decode.email
                const data = {
                    token: token,
                    email: email,
                    password: values.password
                }
                const res = await resetPassword(data)
                if (res.status !== "OK") {
                    toast.error("Không thể reset password")
                } else {
                    toast.success("Đổi mật khẩu thành công")
                    navigate("/login");
                }
            } catch (error) {
                toast("Lỗi");
            }
        },
    });

    return (
        <div className={cx("wrapper")}>
            <form action="" method="POST" className={cx("form")} onSubmit={formik.handleSubmit} id="form-2">
                <div className={cx("form-group")}>
                    <label htmlFor="password" className={cx("form-label")}>
                        Mật khẩu<span> *</span>
                    </label>
                    <input id="password" name="password" type="password" placeholder="Mật khẩu" value={formik.values.password} onChange={formik.handleChange} className={cx("form-control")} />
                    {formik.errors.password && formik.touched.password && <span className={cx("form-message")}>{formik.errors.password}</span>}
                </div>

                <div className={cx("form-group")}>
                    <label htmlFor="confirmPassword" className={cx("form-label")}>
                        Xác nhận mật khẩu<span> *</span>
                    </label>
                    <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Nhập lại mật khẩu" value={formik.values.confirmPassword} onChange={formik.handleChange} className={cx("form-control")} />
                    {formik.errors.confirmPassword && formik.touched.confirmPassword && <span className={cx("form-message")}>{formik.errors.confirmPassword}</span>}
                </div>
                <button className={cx("form-submit")} type="submit">
                    Đặt lại mật khẩu
                </button>
            </form>
        </div>
    )
}

export default ResetPassword;