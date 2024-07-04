import React, { useEffect, useState, useContext, useMemo } from "react";
import classNames from "classnames/bind";
import styles from "./BorrowerCard.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  removeCardBook,
  removeAllBook,
  increaseAmount,
  decreaseAmount,
  selectedBook,
} from "../../../redux/slides/borrowerCardSlice";
import ModalBorrowerSlip from "./ModalBorrowerSlip";
import { toast } from "react-toastify";
import { Checkbox, InputNumber } from "antd";
import { DeleteFilled, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { updateCard } from "../../../services/CardService";

const cx = classNames.bind(styles);

const BorrowerCard = () => {
  //const { user, token } = useContext(AuthContext);
  const user = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const card = useSelector((state) => state.borrowerCard);
  const listBook = useSelector((state) => state.borrowerCard.books);
  const [listChecked, setListChecked] = useState([]);

  useEffect(() => {
    dispatch(selectedBook({ listChecked }));
  }, [listChecked]);

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      listBook.forEach((book) => {
        newListChecked.push(book?.bookId._id);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  const handleRemoveAll = async () => {
    if (listChecked?.length > 1) {
      dispatch(removeAllBook({ listChecked }));
      const newlist = listBook?.filter(
        (item) => !listChecked.includes(item.bookId._id)
      );
      const dataToSave = newlist.map((book) => ({
        bookId: book.bookId._id,
        quantity: book.quantity,
      }));
      await updateCard(user.id, token, { books: dataToSave });
    }
  };

  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleChangeCount = (type, idBook, limited) => {
    if (type === "increase") {
      if (!limited) {
        dispatch(increaseAmount({ idBook }));
      }
    } else {
      if (!limited) {
        dispatch(decreaseAmount({ idBook }));
      }
    }
  };

  const handleDeleteOneBook = async (idBook) => {
    dispatch(removeCardBook({ idBook }));
    const newlist = listBook?.filter((item) => item?.bookId._id !== idBook);
    const dataToSave = newlist.map((book) => ({
      bookId: book.bookId._id,
      quantity: book.quantity,
    }));
    await updateCard(user.id, token, { books: dataToSave });
  };

  const totalBookSelected = useMemo(() => {
    const result = card?.booksSelected.reduce((total, cur) => {
      return total + cur.quantity;
    }, 0);
    console.log(result);
    return result;
  }, [card]);

  const total = useMemo(() => {
    const result = card?.books?.reduce((total, cur) => {
      return total + cur.quantity;
    }, 0);
    return result;
  }, [card]);

  const handleShowModal = () => {
    if (totalBookSelected === 0) {
      toast.error("Vui lòng tích để chọn sách muốn mượn");
    } else if (totalBookSelected <= 5) {
      setShowModal(true);
    } else {
      toast.error("Không được mượn nhiều hơn 5 quyển");
    }
  };

  const handleOnclickEmpty = () => {
    navigate("/");
  };

  return (
    <div className={cx("wrapper")}>
      <h5 style={{ fontWeight: "bold" }}>Thẻ đọc</h5>
      {listBook.length > 0 && token ? (
        <div className={cx("card-book")}>
          <div className={cx("left")}>
            <div className={cx("header")}>
              <span style={{ display: "inline-block", flexGrow: 2 }}>
                <Checkbox
                  className={cx("checkbox")}
                  onChange={handleOnchangeCheckAll}
                  checked={listChecked?.length === listBook.length}
                ></Checkbox>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "16px",
                    width: 335,
                    marginLeft: 10,
                  }}
                >
                  {" "}
                  Tất cả ({listBook.length}) sách
                </span>
              </span>
              <div
                style={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "16px", width: 84 }}>Số lượng</span>
                <DeleteFilled
                  style={{ cursor: "pointer", color: "red" }}
                  onClick={handleRemoveAll}
                />
              </div>
            </div>
            <div className={cx("list-book")}>
              {listBook.map((book) => {
                const isOutOfStock = book.bookId.quantityAvailable === 0;
                return (
                  <div className={cx("wrapper-items")} key={book.bookId._id}>
                    <div
                      style={{
                        flexGrow: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        opacity: isOutOfStock ? 0.5 : 1,
                      }}
                    >
                      <Checkbox
                        onChange={onChange}
                        value={book.bookId._id}
                        checked={listChecked.includes(book.bookId._id)}
                        disabled={isOutOfStock}
                      ></Checkbox>
                      <img
                        src={book?.bookId.coverImg}
                        style={{
                          width: "75px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          marginLeft: "10px",
                          width: 260,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <p>Mã: {book.bookId.bookId}</p>
                        <p>
                          <b>{book?.bookId.name}</b>
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {isOutOfStock ? (
                        <div style={{ color: "red", fontWeight: "bold" }}>
                          không còn sẵn
                        </div>
                      ) : (
                        <div className={cx("count-item")}>
                          <div
                            style={{
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleChangeCount(
                                "decrease",
                                book?.bookId._id,
                                book?.quantity === 1
                              )
                            }
                          >
                            <MinusOutlined
                              style={{ color: "#000", fontSize: "13px" }}
                            />
                          </div>
                          <InputNumber
                            style={{
                              width: "40px",
                              borderTop: "none",
                              borderBottom: "none",
                              borderRadius: "0px",
                            }}
                            defaultValue={book?.quantity}
                            value={book?.quantity}
                            size="small"
                            min={1}
                            max={book?.bookId.quantity}
                          />
                          <div
                            style={{
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleChangeCount(
                                "increase",
                                book?.bookId._id,
                                book?.quantity === book?.bookId.quantity
                              )
                            }
                          >
                            <PlusOutlined
                              style={{ color: "#000", fontSize: "13px" }}
                            />
                          </div>
                        </div>
                      )}
                      <DeleteFilled
                        style={{ cursor: "pointer", color: "red" }}
                        onClick={() => handleDeleteOneBook(book?.bookId._id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={cx("right")}>
            <div className={cx("total")}>
              <p style={{ fontSize: "20px", fontWeight: "400" }}>
                Tổng số sách trong thẻ:{" "}
                <span style={{ color: "red" }}>{total}</span>
              </p>
              <p style={{ fontSize: "20px", fontWeight: "400" }}>
                Số sách đã chọn:{" "}
                <span style={{ color: "red" }}>{totalBookSelected}</span>
              </p>
            </div>
            <button onClick={handleShowModal}>Mượn sách</button>
          </div>
        </div>
      ) : (
        <div className={cx("empty")}>
          <div>
            <img src="../cart_empty_background.png" alt="empty cart" />
          </div>
          <h3>Bạn chưa thêm quyển sách nào vào giỏ hết</h3>
          <p>Về trang "Tủ sách" để lựa sách nhé!!</p>
          <button onClick={handleOnclickEmpty}>Quay lại trang chủ</button>
        </div>
      )}
      <ModalBorrowerSlip
        show={showModal}
        handleClose={() => setShowModal(false)}
        cardListBook={card?.booksSelected}
        total={totalBookSelected}
        listChecked={listChecked}
      />
    </div>
  );
};

export default BorrowerCard;
