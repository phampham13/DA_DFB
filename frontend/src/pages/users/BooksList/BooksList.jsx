import classNames from "classnames/bind";
import styles from "./BooksList.module.scss";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { ApiBOOK } from "../../../services/BookService";
import Loading from "../../../components/LoadingComponent/Loading";

const cx = classNames.bind(styles);

const BooksList = () => {
    const dispatch = useDispatch()

    //const books = useSelector(selectAllBooks)
    const [books, setBooks] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("");
    const [keyword, setKeyword] = useState('')
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchBooks();
        getCategory()
    }, []);

    const fetchBooks = async (page = 1, append = false, selectedCategory = "", keyword = "") => {
        setIsLoading(true)
        const res = await ApiBOOK.getBooks(5, page, selectedCategory, keyword);
        setBooks((prevBooks) => (append ? [...prevBooks, ...res.data] : res.data));
        setPage(res.pageCurrent)
        setTotalPage(res.totalPage)
        setIsLoading(false)
    };

    const getCategory = async () => {
        const res = await ApiBOOK.getAllCate()
        const t = res.data
        const cate = t.map(item => item.categoryName);
        setCategories(cate)
    }

    const handleCategoryChange = (event) => {
        const newCategory = event.target.value
        setSelectedCategory(newCategory)
        setKeyword("")
        fetchBooks(1, false, event.target.value)
    };

    const handleSearch = () => {
        if (keyword.trim()) {
            fetchBooks(1, false, selectedCategory, keyword)
        }
    }

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchBooks(nextPage, true, selectedCategory, keyword);
    };

    const redirectToOtherPage = (bookId) => {
        navigate(`/bookDetail/${bookId}`);
    };

    const renderedBooks = books.map(book => (
        <div className={cx('book')} key={book.bookId} onClick={() => redirectToOtherPage(book.bookId)}>
            <div className={cx('cover')}>
                <img src={book.coverImg} alt="Bìa sách"></img>
                <span>Mượn sách</span>
            </div>
            <div className={cx("info")}>
                <h5 className={cx('name')}>{book.name}</h5>
                <p>Tác giả: {book.author}</p>
                <p>Sẵn có: <span>{book.quantityAvailable}</span></p>
            </div>
        </div>
    ))

    return (
        <div className={cx('wrapper')}>
            <img src='../slogan.png' style={{ height: '80px', objectFit: 'contain' }}></img>
            <div className={cx('search-bar')}>
                <select value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="">Tất cả</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    className={cx('search-input')}
                    placeholder="Tìm kiếm theo tên sách hoặc tác giả"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                />
                <button className={cx('search-button')} onClick={handleSearch}>Tìm Kiếm</button>
            </div>
            <Loading isLoading={isLoading}>
                {books.length > 0 ? (
                    <div className={cx('book-container')}>
                        <div className={cx('list-book')}>
                            {renderedBooks}
                        </div>
                        {page < totalPage && (
                            <div style={{ display: 'flex', justifyContent: 'space-around' }} className={cx('more')}>
                                <button onClick={handleLoadMore} style={{ margin: 'auto' }}>
                                    Xem thêm
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div><img src="../searchBook_empty.png" style={{ width: '300px', height: '300px', objectFit: 'contain' }} /></div>
                        <div><p style={{ fontSize: '1.2em' }}>Không có quyển sách nào được tìm thấy</p></div>
                    </div>
                )}
            </Loading>
        </div>
    )
}

export default BooksList