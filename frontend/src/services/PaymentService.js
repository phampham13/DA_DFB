import { req, axiosJWT } from "../utils/httpRequest"

export const createPayment = async (data) => {
    try {
        const res = await req.post(`momo/create-payment`, data)
        return res.data
    } catch (err) {
        throw err
    }
}

export const transactionCheck = async (data) => {
    try {
        const res = await req.post(`momo/transaction-status`, data)
        return res.data
    } catch (err) {
        throw err
    }
}

export const refundOrder = async (data) => {
    try {
        const res = await req.post(`momo/refund`, data)
        return res.data
    } catch (err) {
        throw err
    }
}

