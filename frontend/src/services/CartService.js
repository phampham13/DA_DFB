import { axiosJWT } from "../utils/httpRequest";

export const getCart = async (id, token) => {
    const res = await axiosJWT.get(`cart/${id}`, {
        headers: {
            token: `Bearer ${token}`,
        }
    })
    return res.data
}

export const updateCart = async (id, token, newProducts) => {
    try {
        const res = await axiosJWT.put(`cart/update/${id}`, newProducts, {
            headers: {
                token: `Bearer ${token}`,
            }
        })
        return res.data
    } catch (err) {
        throw err
    }
}

export const apiAddToCart = async (token, id, product) => {
    try {
        const res = await axiosJWT.post(`cart/addProduct/${id}`, product, {
            headers: {
                token: `Bearer ${token}`,
            }
        })
        return res.data
    } catch (err) {
        throw err
    }
}