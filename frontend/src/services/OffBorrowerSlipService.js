import { axiosJWT } from "../utils/httpRequest";

export const createBorrowerSlip = async (token, data) => {
    try {
        const res = await axiosJWT.post(`offBorrowerSlip/create`, data, {
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

export const offBorrowerSlipStatistic = async (token, id) => {
    try {
        const res = await axiosJWT.get(`offBorrowerSlip/statistic/${id}`, {
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
export const getAll = async (token) => {
    try {
        const res = await axiosJWT.get(`/offBorrowerSlip/get-all`, {
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
export const getDetailBr = async (token,id) => {
    try {
        const res = await axiosJWT.get(`/offBorrowerSlip/get-detail/${id}`, {
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
export const DeleteBr = async (token,id) => {
    try {
        const res = await axiosJWT.delete(`/offBorrowerSlip/delete/${id}`, {
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
export const DeleteManyBr = async (token,ids) => {
    try {
        const body = {
            ids: ids,
          };
        const res = await axiosJWT.post(`/offBorrowerSlip/delete-many`,body, {
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
export const UpdateBr = async (token,id,body) => {
    try {
        
        const res = await axiosJWT.patch(`/offBorrowerSlip/update-state/${id}`,body, {
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