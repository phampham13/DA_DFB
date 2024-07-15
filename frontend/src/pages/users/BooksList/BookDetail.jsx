import { useSelector, useDispatch } from 'react-redux'
import classNames from "classnames/bind";
import styles from "./BookDetail.module.scss";
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from 'react';
import { ApiBOOK } from '../../../services/BookService';
import { apiAddBookToCard } from '../../../services/CardService';
import { AuthContext } from "../../../contexts/AuthContext";
import { addBookToCard } from '../../../redux/slides/borrowerCardSlice';

const cx = classNames.bind(styles);

export const BookDetail = () => {
  const { id } = useParams();
  const navigateTo = useNavigate();
  const { token, user } = useContext(AuthContext);
  const [book, setBook] = useState({})
  const dispatch = useDispatch();
  useEffect(() => {
    fetchApi()
  }, [])

  const fetchApi = async () => {
    const res = await ApiBOOK.getDetail(id);
    setBook(res.data);
  }

  //const book = useSelector(state => selectBookById(state, id))
  //console.log(1, book)
  //const book = { bookId: 'NNA001', categoryName: 'Nguyễn Ngọc Ánh', author: 'Nguyễn Ngọc Ánh', name: 'Tôi thấy hoa vàng trên cỏ xanh', quantityTotal: 7, quantityAvailable: 5, publisher: 'Kim Đồng', coverImg: 'https://upload.wikimedia.org/wikipedia/vi/3/3d/T%C3%B4i_th%E1%BA%A5y_hoa_v%C3%A0ng_tr%C3%AAn_c%E1%BB%8F_xanh.jpg' }

  const [count, setCount] = useState(1);
  const increaseCount = () => {
    if (count < book.quantityAvailable) setCount(count + 1);
  };

  const decreaseCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const handleAddToCard = async () => {
    if (token && user && user.role === "user") {
      if (book.quantityAvailable < 1) {
        toast.info('Đã hết sách, bạn vui lòng quay lại mượn sau !')
      } else {
        const userId = user.id;
        const res = await apiAddBookToCard(token, userId, {
          bookId: book._id,
          quantity: count
        })
        if (res.status !== "OK") {
          toast.error(res.message)
          return
        }
        dispatch(addBookToCard({ book, count }));
        toast.success("Sách đã được thêm vào thẻ đọc của bạn");
      }
    } else {
      navigateTo("/login");
      toast.warn("Đăng nhập trước khi thêm vào giỏ hàng!!");
    }
  };

  if (!book) {
    return (
      <section>
        <h2>Không tìm thấy thông tin sách!</h2>
      </section>
    )
  }

  return (
    <div className={cx('wrapper')}>
      <div className={cx('book-detail')}>
        <div className={cx('divLeft')}>
          <img src={book.coverImg} alt="Bìa sách"></img>
        </div>
        <div className={cx('divRight')}>
          <div className={cx('top')}>
            <h3 className={cx("name")}>{book.name}</h3>
            <p className={cx("author")}><b>Tác giả: </b>{book.author}</p>
            <p className={cx("category")}><b>Thể loại: </b> {book.categoryName}</p>
            <p className={cx("publisher")}><b>Nhà xuất bản:</b> {book.publisher}</p>
            <p className={cx("description")}><b>Giới thiệu:</b> <i>{book.description} </i></p>
          </div>
          <div className={cx('bottom')}>
            <p className={cx("total")}><strong>Tổng số lượng: {book.quantityTotal}</strong></p>
            <p className={cx("avail")}><strong>Sẵn có để mượn: <span>{book.quantityAvailable}</span></strong></p>

            {book.bookId && book.bookId.includes('DB-') ? (
              <div>
                <p style={{ fontSize: '1.1em', color: `var(--sub-color2)` }}>Sách đọc tại chỗ, không thể mượn mang về</p>
              </div>
            ) : (
              <div>
                <div className={cx("count")}>
                  <p className={cx("control")} onClick={decreaseCount}>
                    -
                  </p>
                  <p>{count}</p>
                  <p className={cx("control")} onClick={increaseCount}>
                    +
                  </p>
                </div>
                <div onClick={() => handleAddToCard()} className={cx("addCard")}>
                  <p>Thêm vào thẻ đọc</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}