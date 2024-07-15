import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";

import { HomeIcon, StatsIcon, BookIcon, SlipIcon } from '../../../components/Icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faPaintBrush } from '@fortawesome/free-solid-svg-icons';
import LogoutIcon from '@mui/icons-material/Logout';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import routes from '../../../config/routes';

const cx = classNames.bind(styles);

function Sidebar({ setToggleButton }) {
  const { handleLoggedOut, user } = useContext(AuthContext);
  const [details, setDetails] = useState({
    showDetailBook: false,
    showDetailSlip: false,
    showDetailStats: false,
    showDetailHandmadeItem: false,
  });

  const [active, setActive] = useState({
    listBook: true,
    listCategory: false,
    listBorrower: false,
    listOnSlip: false,
    listOffSlip: false,
    statisticSale: false,
    listProduct: false,
    listOrder: false
  });
  const [toggle, setToggle] = useState({
    action: false,
    value: 0,
  });

  const handleShowDetail = (detailName) => {
    setDetails((prevState) => ({
      showDetailBook: false,
      showDetailSlip: false,
      showDetailStats: false,
      showDetailHandmadeItem: false,
      [detailName]: !prevState[detailName],
    }));
  };

  const handleActive = (detailName) => {
    setActive((prevState) => ({
      listBook: false,
      listCategory: false,
      listOnSlip: false,
      listOffSlip: false,
      statisticSale: false,
      listOrder: false,
      listProduct: false,
      [detailName]: true,
    }));
  };

  const handleToggle = () => {
    if (toggle.action) {
      setToggle({
        action: false,
        value: 0,
        display: "block",
      });

      setToggleButton({
        action: false,
        value: 0,
      });
      console.log("đóng");
    } else {
      setToggle({
        action: true,
        value: 178,
        display: "none",
      });
      console.log("mở");
      setToggleButton({
        action: true,
        value: 178,
      });
    }
  };

  return (
    <div
      className={cx("wrapper")}
      style={{ width: `calc(230px - ${toggle.value}px)` }}
    >
      <nav>
        <div className={cx("menuTopHeader")}>
          <div className={cx("menuTopLogo")}>
            {!toggle.action && (
              <a href="/admin">
                <img
                  src="/src/layouts/AdminLayout/Sidebar/dfreelogo.jpg"
                  className={cx("logo")}
                  alt="logo"
                ></img>
              </a>
            )}
            {/*<button className={cx("buttonArrowLeft")} onClick={handleToggle}>
              {toggle.action ? (
                <FontAwesomeIcon
                  className={cx("iconArrowLeft")}
                  icon={faAngleRight}
                />
              ) : (
                <FontAwesomeIcon
                  className={cx("iconArrowLeft")}
                  icon={faAngleLeft}
                />
              )}
            </button>*/}
          </div>
        </div>

        <div className={cx('menuInnerWrapper')}>
          <div className={cx('menuPrimaryInner')}>
            <nav className={cx('menuList')}>

              {/* Sách*/}
              <div
                className={cx('homeMenuItem', 'itemNav', {
                  active: active.listBook || active.listCategory
                })}
                onClick={() => handleShowDetail('showDetailBook')}
              >
                <div className={cx('wrapIconItem')}>
                  <BookIcon />
                </div>
                {!toggle.action && (
                  <>
                    <div className={cx('menuItemTitle')}>
                      <span>Quản lý sách</span>
                    </div>
                    <div>
                      <FontAwesomeIcon
                        className={cx('iconArrowRight', {
                          activeIcon: details.showDetailBook,
                        })}
                        icon={faAngleRight}
                      />
                    </div>
                  </>
                )}
              </div>
              {/* Chi tiết trong quản lý sách */}
              {!toggle.action && (
                <div
                  className={cx('wrapCollapseItem', { showCollapseItem: details.showDetailBook })}
                >
                  <Link
                    to="/admin/books"
                    className={cx('homeMenuItem', 'itemNav', 'innerWrapCollapseItem')}
                    onClick={() => handleActive('listBook')}
                  >
                    <div className={cx('menuItemTitle')}>
                      <span>Thống kê sách</span>
                    </div>
                  </Link>
                  <Link
                    to="/admin/bookCategory"
                    className={cx('homeMenuItem', 'itemNav', 'innerWrapCollapseItem')}
                    onClick={() => handleActive('listCategory')}
                  >
                    <div className={cx('menuItemTitle')}>
                      <span>Thể loại sách</span>
                    </div>
                  </Link>
                </div>
              )}

              {/* mượn trả sách */}
              <div
                className={cx("homeMenuItem", "itemNav", {
                  active:
                    active.listOnSlip ||
                    active.listOffSlip ||
                    active.listBorrower,
                })}
                onClick={() => handleShowDetail("showDetailSlip")}
              >
                <div className={cx("wrapIconItem")}>
                  <SlipIcon />
                </div>
                {!toggle.action && (
                  <>
                    <div className={cx("menuItemTitle")}>
                      <span>Quản lý mượn trả</span>
                    </div>
                    <div>
                      <FontAwesomeIcon
                        className={cx("iconArrowRight", {
                          activeIcon: details.showDetailSlip,
                        })}
                        icon={faAngleRight}
                      />
                    </div>
                  </>
                )}
              </div>
              {/* Chi tiết trong mượn trả*/}
              {!toggle.action && (
                <div
                  className={cx("wrapCollapseItem", {
                    showCollapseItem: details.showDetailSlip,
                  })}
                >
                  <Link
                    to="/admin/onSlip"
                    className={cx(
                      "homeMenuItem",
                      "itemNav",
                      "innerWrapCollapseItem"
                    )}
                    onClick={() => handleActive("listOnSlip")}
                  >
                    <div className={cx("menuItemTitle")}>
                      <span>Phiếu mượn online</span>
                    </div>
                  </Link>
                  <Link
                    to="/admin/offSlip"
                    className={cx(
                      "homeMenuItem",
                      "itemNav",
                      "innerWrapCollapseItem"
                    )}
                    onClick={() => handleActive("listOffSlip")}
                  >
                    <div className={cx("menuItemTitle")}>
                      <span>Phiếu mượn offline</span>
                    </div>
                  </Link>
                  <Link
                    to="/admin/borrowers"
                    className={cx(
                      "homeMenuItem",
                      "itemNav",
                      "innerWrapCollapseItem"
                    )}
                    onClick={() => handleActive("listBorrower")}
                  >
                    <div className={cx("menuItemTitle")}>
                      <span>Danh sách người dùng</span>
                    </div>
                  </Link>
                </div>
              )}

              {/* Tiệm hand*/}
              <div
                className={cx("homeMenuItem", "itemNav", {
                  active: active.listProduct || active.listOrder,
                })}
                onClick={() => handleShowDetail("showDetailHandmadeItem")}
              >
                <div className={cx("wrapIconItem")}>
                  <FontAwesomeIcon icon={faPaintBrush} />
                </div>
                {!toggle.action && (
                  <>
                    <div className={cx("menuItemTitle")}>
                      <span>Quản lý tiệm hand</span>
                    </div>
                    <div>
                      <FontAwesomeIcon
                        className={cx("iconArrowRight", {
                          activeIcon: details.showDetailHandmadeItem,
                        })}
                        icon={faAngleRight}
                      />
                    </div>
                  </>
                )}
              </div>
              {/* Chi tiết trong tiệm hand */}
              {!toggle.action && (
                <div
                  className={cx("wrapCollapseItem", {
                    showCollapseItem: details.showDetailHandmadeItem,
                  })}
                >
                  <Link
                    to="/admin/products"
                    className={cx(
                      "homeMenuItem",
                      "itemNav",
                      "innerWrapCollapseItem"
                    )}
                    onClick={() => handleActive("listProduct")}
                  >
                    <div className={cx("menuItemTitle")}>
                      <span>Sản phẩm Handmade</span>
                    </div>
                  </Link>
                  <Link
                    to="/admin/orders"
                    className={cx(
                      "homeMenuItem",
                      "itemNav",
                      "innerWrapCollapseItem"
                    )}
                    onClick={() => handleActive("listOrder")}
                  >
                    <div className={cx("menuItemTitle")}>
                      <span>Danh sách đơn hàng</span>
                    </div>
                  </Link>
                </div>
              )}

              {/* Thống kê*/}
              <div
                className={cx('homeMenuItem', 'itemNav', {
                  active: active.statisticSale
                })}
                onClick={() => handleShowDetail('showDetailStats')}
              >
                <div className={cx('wrapIconItem')}>
                  <StatsIcon />
                </div>
                {!toggle.action && (
                  <>
                    <div className={cx('menuItemTitle')}>
                      <span>Thống kê</span>
                    </div>
                    <div>
                      <FontAwesomeIcon
                        className={cx('iconArrowRight', {
                          activeIcon: details.showDetailStats,
                        })}
                        icon={faAngleRight}
                      />
                    </div>
                  </>
                )}
              </div>
              {/* Chi tiết trong thống kê */}
              {!toggle.action && (
                <div
                  className={cx('wrapCollapseItem', { showCollapseItem: details.showDetailStats })}
                >
                  <Link
                    to="/admin/stats"
                    className={cx('homeMenuItem', 'itemNav', 'innerWrapCollapseItem')}
                    onClick={() => handleActive('statisticSale')}
                  >
                    <div className={cx('menuItemTitle')}>
                      <span>Thống kê</span>
                    </div>
                  </Link>
                </div>
              )}

              <hr className={cx('menuDivider')}></hr>

              <Link
                to="/login"
                className={cx("homeMenuItem", "itemNav")}
                onClick={handleLoggedOut}
              >
                <div className={cx("wrapIconItem")}>
                  <LogoutIcon />
                </div>
                {!toggle.action && (
                  <div className={cx("menuItemTitle")}>
                    <span>Đăng xuất</span>
                  </div>
                )}
              </Link>
            </nav>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
