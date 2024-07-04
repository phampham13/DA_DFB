import { axiosJWT } from "../utils/httpRequest";

export const createBorrowerSlip = async (token, data) => {
    try {
        const res = await axiosJWT.post(`borrowerSlip/create`, data, {
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

export const borrowerSlipStatistic = async (token, id) => {
    try {
        const res = await axiosJWT.get(`borrowerSlip/statistic/${id}`, {
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

export const getUserBrSlip = async (token, id) => {
    try {
        console.log("token", token)
        console.log("id", id)
        const res = await axiosJWT.get(`borrowerSlip/get-user-slip/${id}`, {
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

export const cancelBorrow = async (token, id) => {
    try {
        const res = await axiosJWT.delete(`borrowerSlip/cancel-borrow/${id}`, {
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
export const GetAllSlipOn = async (token) => {
    try {
        const res = await axiosJWT.get(`/borrowerSlip/get-all-borrower-slip`, {
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
export const GetDetailSlipOn = async (token,id) => {
    try {
        const res = await axiosJWT.get(`/borrowerSlip/get-detail-slip/${id}`, {
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
export const DeleteSlipOn = async (token,id) => {
    try {
        const res = await axiosJWT.delete(`/borrowerSlip/delete/${id}`, {
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
export const UpdateSlipOn = async (token,id,body) => {
    try {
        const res = await axiosJWT.patch(`/borrowerSlip/update-state/${id}`,body, {
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
export const DeleteManySlipOn = async (token,body) => {
    try {
        const res = await axiosJWT.post(`borrowerSlip/delete-many`,body, {
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