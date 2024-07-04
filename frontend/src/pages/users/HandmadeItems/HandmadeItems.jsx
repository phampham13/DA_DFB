import classNames from 'classnames/bind';
import styles from './HandmadeItems.module.scss';
import ProductCard from '../../../components/CardComponent/ProductCard';
const cx = classNames.bind(styles);
import { ApiProduct } from '../../../services/ProductService';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { apiAddToCart } from '../../../services/CartService';
import { toast } from 'react-toastify';
import { addProductToCart } from '../../../redux/slides/cartSlice';


const HandmadeItems = () => {
    const token = localStorage.getItem("token")
    const [products, setProducts] = useState([])
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    useEffect(() => {
        getAllProduct()
    }, [])

    const getAllProduct = async () => {
        const res = await ApiProduct.getAllProduct(50, 0, "price")
        setProducts(res.data)
    }

    const handleAddToCart = async (product, amount) => {
        const res = await apiAddToCart(token, user.id, {
            productId: product._id,
            quantity: amount
        })
        if (res.status === "OK") {
            toast.success("Thêm sản phẩm vào giỏ thành công")
            dispatch(addProductToCart({
                product: product,
                quantity: amount
            }))
        } else {
            toast.error(res.message)
        }
    }
    return (
        <div className={cx('wrapper')}>
            <div className={cx("cover")}>
                <img src='../tiemhand.png' alt="tiem hand"></img>
            </div>
            <div className={cx("itemList")}>
                {products.map((item) => (
                    <ProductCard product={item} key={item._id} onAddToCart={handleAddToCart} />
                ))}
            </div>
        </div>
    );
}

export default HandmadeItems;