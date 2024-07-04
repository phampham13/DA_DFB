import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import { Link } from "react-router-dom";
import { useContext } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { Button } from "@mui/material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { IoLibrary } from "react-icons/io5";
import { AuthContext } from "../../contexts/AuthContext";
import { useSelector } from "react-redux";
const cx = classNames.bind(styles);
function Header() {
  const { token, user, handleLoggedOut } = useContext(AuthContext)
  const books = useSelector((state) => state.borrowerCard.books)
  const products = useSelector((state) => state.cart.products)

  return (
    <div className={cx("wrapper")}>
      <div className={cx("box")}>
        <div className={cx("logo")}>
          <a href="/">
            <img src="src/layouts/UserLayout/dfreelogo.png" alt="logo" />
          </a>
        </div>
        <div className={cx("category")}>
          <div className={cx("category-item")}>
            <Link to="/">TRANG CHỦ</Link>
          </div>
          <div className={cx("category-item")}>
            <Link to="/policy">QUY ĐỊNH</Link>
          </div>
          <div className={cx("category-item")}>
            <Link to="/books">
              <IoLibrary style={{ fontSize: '16px' }} />
              {"  "}
              TỦ SÁCH
            </Link>
          </div>
          <div className={cx("category-item")}>
            <Link to="/handmadeItems">TIỆM HAND</Link>
          </div>
        </div>
        <div className={cx("user")}>
          <div>
            <Button>
              <PersonIcon style={{ color: 'var(--sub-color2)' }} />
            </Button>
            {token ? (
              <ul style={{ width: "150px" }}>
                <li>
                  <Link to={"/profile"}>Thông tin cá nhân</Link>
                </li>
                <li>
                  <Link to={"/login"} onClick={handleLoggedOut}>Đăng xuất</Link>
                </li>
              </ul>
            ) : (
              <ul style={{ width: "100px" }}>
                <li>
                  <Link to={"/login"}>Đăng nhập</Link>
                </li>
                <li>
                  <Link to={"/signup"}>Đăng ký</Link>
                </li>
              </ul>
            )}
          </div>
          {token && (
            <div className={cx('card')}>
              <Button>
                <LibraryBooksIcon style={{ color: 'var(--sub-color2)' }} />
              </Button>
              {token && books.length > 0 ? <p>{books.length}</p> : null}
              {token && (
                <ul style={{ width: "150px" }}>
                  <li>
                    <Link to={"/borrowerCard"}>Thẻ đọc</Link>
                  </li>
                  <li>
                    <Link to={"/borrowerSlips"}>Phiếu đọc</Link>
                  </li>
                </ul>
              )}
            </div>
          )}
          {token && (
            <div className={cx('cart')}>
              <Button>
                <Link to='/cart'>
                  <ShoppingCartIcon style={{ color: 'var(--sub-color2)' }} />
                </Link>
              </Button>
              {token && products.length > 0 ? <p>{products.length}</p> : null}
              {token && (
                <ul style={{ width: "150px" }}>
                  <li>
                    <Link to={"/cart"}>Giỏ hàng</Link>
                  </li>
                  <li>
                    <Link to={"/orders"}>Đơn hàng</Link>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
