import { createContext, useEffect, useState } from "react";
import { getDetailsUser, refreshToken } from "../services/UserService";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser, resetUser } from "../redux/slides/userSlice";
import { updateCard } from "../redux/slides/borrowerCardSlice";
import { updateCart } from "../redux/slides/cartSlice";
import { toast } from "react-toastify";
import { getCard } from "../services/CardService";
import { getCart } from "../services/CartService";
import { axiosJWT } from "../utils/httpRequest";

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState({})
    const dispatch = useDispatch()
    useEffect(() => {
        const { decoded, a_token, r_token } = handleDecoded()
        if (a_token && decoded?.payload.id) {
            setUser(decoded.payload)
            handleGetDetailsUser(decoded.payload.id, decoded.payload.role, a_token)
        }
    }, []);

    const handleDecoded = () => {
        let a_token = localStorage.getItem('token')
        let r_token = localStorage.getItem('refresh_token')
        let decoded = {}
        if (a_token) {
            decoded = jwtDecode(a_token)
        }
        return { decoded, a_token, r_token }
    }

    const handleGetDetailsUser = async (id, role, token) => {
        const res = await getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
        if (role === "user") {
            const card = await getCard(id, token)
            dispatch(updateCard(card.data))
            const cart = await getCart(id, token)
            dispatch(updateCart(cart.data))
        }
    }

    axiosJWT.interceptors.request.use(async (config) => {
        // Do something before request is sent
        const currentTime = new Date()
        const { decoded, a_token, r_token } = handleDecoded()
        //console.log("mấy giá trị decode interceptor", decoded, a_token, r_token)
        //let storageRefreshToken = localStorage.getItem('refresh_token')
        //console.log("refresh_token inter", r_token)
        if (a_token && r_token) {
            console.log(1)
            if (decoded?.exp + 10 < currentTime.getTime() / 1000) {
                const decodedRefreshToken = jwtDecode(r_token)
                console.log("decode re token", decodedRefreshToken?.exp)
                if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
                    console.log("đổi fresh token đây", r_token)
                    const data = await refreshToken(r_token)
                    localStorage.setItem('token', data?.access_token)
                    setToken(data.access_token)
                    console.log("đổi new token", data.access_token)
                    config.headers['token'] = `Bearer ${data?.access_token}`
                } else {
                    dispatch(resetUser())
                    handleLoggedOut()
                }
            }
        }
        return config;
    }, (err) => {
        return Promise.reject(err)
    })

    const handleLoggedin = async (token, refresh_token, user) => {
        console.log("auth login", user);
        localStorage.setItem("token", token)
        localStorage.setItem("refresh_token", refresh_token)
        localStorage.setItem("role", user.role)
        setUser(user)
        setToken(token)
        const res = await getDetailsUser(user.id, token)
        if (res.status !== "OK") toast(res.message, { autoClose: 2000 })
        dispatch(updateUser({ ...res?.data, access_token: token }))
        if (user.role === 'user') {
            const card = await getCard(user.id, token)
            dispatch(updateCard(card.data))
            const cart = await getCart(user.id, token)
            dispatch(updateCart(cart.data))
        }
    }

    const handleLoggedOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("refresh_token");

        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        setToken,
        setUser,
        handleLoggedin,
        handleLoggedOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

