import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { UpdateUserInfo } from "../../../services/UserService";
import { toast } from "react-toastify";
import { updateUser } from "../../../redux/slides/userSlice";

const cx = classNames.bind(styles);
const Profile = () => {
    const dispatch = useDispatch()
    const token = localStorage.getItem("token")
    const userInfo = useSelector(state => state.user)
    const phoneRegExp = /^0\d{9}$/;

    const formik = useFormik({
        initialValues: {
            name: userInfo.name,
            phoneNumber: userInfo.phoneNumber,
            email: userInfo.email,
        },
        validationSchema: Yup.object({
            name: Yup.string().max(45, "Tên quá dài!").required("Bạn chưa điền tên!"),
            phoneNumber: Yup.string().matches(phoneRegExp, "Số điện thoại không hợp lệ").required("Bạn chưa nhập số điện thoại"),
            email: Yup.string().email("Email không đúng").required("Bạn chưa điền email!")
        }),
        onSubmit: async (values) => {
            const res = await UpdateUserInfo(userInfo.id, token, values)
            console.log('res', res)
            if (res.status !== "OK") {
                toast.error(res.message)
            } else {
                toast.success("Cập nhật thông tin thành công")
                dispatch(updateUser({ ...res.data }))
            }
        },
    });

    return (
        <div className={cx("wrapper")}>
            <div className={cx('container')}>
                <div style={{ marginTop: 20 }}>
                    <h4>Thông tin tài khoản</h4>
                </div>
                <form action="" method="POST" className={cx("form")} onSubmit={formik.handleSubmit} id="form-1">
                    <div className="spacer"></div>

                    <div className={cx("form-group")}>
                        <label htmlFor="name" className={cx("form-label")}>
                            Tên:
                        </label>
                        <input id="name" name="name" type="text" placeholder="Họ và tên" value={formik.values.name} onChange={formik.handleChange} className={cx("form-control")} />

                    </div>
                    <div className={cx("form-group")}>{formik.errors.name && formik.touched.name && <span className={cx("form-message")}>{formik.errors.name}</span>}</div>
                    <div className={cx("form-group")}>
                        <label htmlFor="phoneNumber" className={cx("form-label")}>
                            Số điện thoại:
                        </label>
                        <input id="phoneNumber" name="phoneNumber" type="text" placeholder="Số điện thoại" value={formik.values.phoneNumber} onChange={formik.handleChange} className={cx("form-control")} />
                    </div>
                    <div className={cx("form-group")}>{formik.errors.phoneNumber && formik.touched.phoneNumber && <span className={cx("form-message")}>{formik.errors.phoneNumber}</span>}</div>

                    <div className={cx("form-group")}>
                        <label htmlFor="email" className={cx("form-label")}>
                            Email:
                        </label>
                        <input id="email" name="email" type="text" placeholder="Email" value={formik.values.email} onChange={formik.handleChange} className={cx("form-control")} />
                    </div>
                    <div className={cx("form-group")}>{formik.errors.email && formik.touched.email && <span className={cx("form-message")}>{formik.errors.email}</span>}</div>
                    <button className={cx("form-submit")} type="submit" value="Submit Form">
                        cập nhật
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Profile;