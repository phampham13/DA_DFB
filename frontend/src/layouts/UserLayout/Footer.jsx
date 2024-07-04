import classNames from "classnames/bind";
import styles from "./Footer.module.scss";
import { FaFacebook, FaTiktok } from "react-icons/fa";
import { GrInstagram } from "react-icons/gr";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import MailIcon from "@mui/icons-material/Mail";
const cx = classNames.bind(styles);
const Footer = () => {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("box")}>
        <div className={cx("logo")}>
          <a href="/">
            <img
              src="src/layouts/UserLayout/dfreelogo2.png"
              alt=""
              style={{ height: "250px", width: "250px" }}
            />
          </a>
        </div>
        <div className={cx("social")}>
          <h1>Social</h1>
          <div className={cx("detail")}>
            <span>
              <FaFacebook style={{ fontSize: "24px" }} />
              <a href="https://www.facebook.com/dfreebook" target="_blank">
                {" "}
                Facebook
              </a>
            </span>
            <span>
              <GrInstagram style={{ fontSize: "24px" }} />
              <a
                href="https://www.instagram.com/dfree.book?fbclid=IwAR3jAw-ZT96AmNM0gU5giJxcfpM1gF35Ah5IloMS3FzAJE86GFKZHmvYW_U"
                target="_blank"
              >
                {" "}
                Instagram
              </a>
            </span>
            <span>
              <FaTiktok style={{ fontSize: "24px" }} />
              <a
                href="https://www.tiktok.com/@thuviendfreebook?fbclid=IwAR3aL5olfOJLbXyG_VdL2FDFhIQWyr4xNBijkn8atpst97NJ75RfK0Kcb_8"
                target="_blank"
              >
                {" "}
                Tiktok
              </a>
            </span>
            <span>
              <LocalPhoneIcon style={{ fontSize: "24px" }} /> Số điện thoại:
              0962.188.248
            </span>
            <span>
              <MailIcon style={{ fontSize: "24px" }} /> Email:
              thuviendfb@gmail.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
