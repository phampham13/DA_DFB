import { axiosJWT } from "../utils/httpRequest";

export const revenueStatistic = async (token, id) => {
    try {
        const res = await axiosJWT.get(`order/revenue/${id}`, {
            headers: {
                token: `Bearer ${token}`,
            }
        })
        return res.data
    } catch (err) {
        console.log("err:", err);
        throw err
    }
}
export const getAllOrder = async (token) => {
    try {
        const res = await axiosJWT.get(`/order/get-all-order`, {
            headers: {
                token: `Bearer ${token}`,
            }
        })
        return res.data
    } catch (err) {
        console.log("err:", err);
        throw err
    }
}
export const createOrder = async (token, data) => {
    try {
        const res = await axiosJWT.post(`order/create`, data, {
            headers: {
                token: `Bearer ${token}`,
            }
        })
        return res.data
    } catch (err) {
        console.log("err", err);
        throw err
    }
}

export const getDetailOrder = async (token, id) => {
    try {
        const res = await axiosJWT.get(`/order/get-detail-order/${id}`, {
            headers: {
                token: `Bearer ${token}`,
            }
        })
        return res.data
    } catch (err) {
        console.log("err:", err);
        throw err
    }
}
export const UpdateOrderStatus = async (token, id, body) => {
    try {
        const res = await axiosJWT.put(`/order/update-status/${id}`, body, {
            headers: {
                token: `Bearer ${token}`,
            }
        })
        return res.data
    } catch (err) {
        console.log("err:", err);
        throw err
    }
}
export const DeleteOrder = async (token, id) => {
    try {
        const res = await axiosJWT.delete(`/order/delete/${id}`, {
            headers: {
                token: `Bearer ${token}`,
            }
        })
        return res.data
    } catch (err) {
        console.log("err:", err);
        throw err
    }
}

export const DeleteOrderMany = async (token, ids) => {
    try {
        const res = await axiosJWT.post(`/order/delete-many`, ids, {
            headers: {
                token: `Bearer ${token}`,
            }
        })
        return res.data
    } catch (err) {
        console.log("err:", err);
        throw err
    }
}

export const cancelOrder = async (token, id) => {
    try {
        const res = await axiosJWT.delete(`/order/cancel-order/${id}`, {
            headers: {
                token: `Bearer ${token}`,
            }
        })
        return res.data
    } catch (err) {
        console.log("err:", err);
        throw err
    }
}

export const getAllUserOrder = async (token, id) => {
    try {
        const res = await axiosJWT.get(`/order/get-user-order/${id}`, {
            headers: {
                token: `Bearer ${token}`,
            }
        })
        return res.data
    } catch (err) {
        console.log("err:", err);
        throw err
    }
}