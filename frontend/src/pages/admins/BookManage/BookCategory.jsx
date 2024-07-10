import classNames from 'classnames/bind';
import styles from './BookList.module.scss';

const cx = classNames.bind(styles);

const BookCategory = () => {
    return (
        <div className={cx("wrap")}>
            Thể loại
        </div>
    )
}

export default BookCategory;