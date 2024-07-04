import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Signup.module.scss";
import { signup } from "/src/services/auth/signup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

export default function Signup() {
    const navigateTo = useNavigate();
    const phoneRegExp = /^0\d{9}$/;

    const formik = useFormik({
        initialValues: {
            name: "",
            phoneNumber: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "user",
            //isAdmin: "false",
            state: "0"
        },
        validationSchema: Yup.object({
            name: Yup.string().max(45, "Tên quá dài!").required("Bạn chưa điền tên!"),
            phoneNumber: Yup.string().matches(phoneRegExp, "Số điện thoại không hợp lệ").required("Bạn chưa nhập số điện thoại"),
            email: Yup.string().email("Email không đúng").required("Bạn chưa điền email!"),
            password: Yup.string().min(6, "mật khẩu tối thiểu 6 kí tự").required("Bạn chưa nhập mật khẩu"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
                .required("Vui lòng xác nhận mật khẩu"),
        }),
        onSubmit: async (values) => {
            try {
                const { confirmPassword, ...newValues } = values
                const response = await signup(values);
                if (response.status === "OK") {
                    // Đăng ký thành công
                    toast.success("Đăng kí thành công!", { autoClose: 2000 });

                    // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
                    navigateTo("/login");
                } else {
                    // Đăng ký thất bại
                    toast.error(`Vui lòng kiểm trả lại thông tin đăng kí ${response.message}`, { autoClose: 2000 });
                }
            } catch (error) {
                //console.error("Đăng ký thất bại:", error);
                toast("Lỗi trong quá trình đăng kí", { autoClose: 2000 });
            }
        },
    });

    return (
        <div className={cx("container")}>
            <div className={cx("heading")}>
                <h3>ĐĂNG KÝ TÀI KHOẢN</h3>
                <p>
                    Bạn đã có tài khoản? Đăng nhập <Link to={"/login"}>tại đây</Link>
                </p>
            </div>

            <form action="" method="POST" className={cx("form")} onSubmit={formik.handleSubmit} id="form-1">
                <h3 className={cx("info")} style={{ minWidth: 'fitContent', width: '100%', textAlign: 'center' }}>Thông tin cá nhân</h3>

                <div className="spacer"></div>

                <div className={cx("form-group")}>
                    <label htmlFor="name" className={cx("form-label")}>
                        Họ và tên<span> *</span>
                    </label>
                    <input id="name" name="name" type="text" placeholder="Họ và tên" value={formik.values.name} onChange={formik.handleChange} className={cx("form-control")} />
                    {formik.errors.name && formik.touched.name && <span className={cx("form-message")}>{formik.errors.name}</span>}
                </div>

                <div className={cx("form-group")}>
                    <label htmlFor="phoneNumber" className={cx("form-label")}>
                        Số điện thoại<span> *</span>
                    </label>
                    <input id="phoneNumber" name="phoneNumber" type="text" placeholder="Số điện thoại" value={formik.values.phoneNumber} onChange={formik.handleChange} className={cx("form-control")} />
                    {formik.errors.phoneNumber && formik.touched.phoneNumber && <span className={cx("form-message")}>{formik.errors.phoneNumber}</span>}
                </div>

                <div className={cx("form-group")}>
                    <label htmlFor="email" className={cx("form-label")}>
                        Email<span> *</span>
                    </label>
                    <input id="email" name="email" type="text" placeholder="Email" value={formik.values.email} onChange={formik.handleChange} className={cx("form-control")} />
                    {formik.errors.email && formik.touched.email && <span className={cx("form-message")}>{formik.errors.email}</span>}
                </div>

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

                <button className={cx("form-submit")} type="submit" value="Submit Form">
                    Đăng ký
                </button>
            </form>
        </div>
    );
}
