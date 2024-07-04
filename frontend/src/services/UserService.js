import { req, axiosJWT } from "../utils/httpRequest"

export const getDetailsUser = async (id, token) => {
    const res = await axiosJWT.get(`users/get-detail/${id}`, {
        headers: {
            token: `Bearer ${token}`,
        }
    })
    return res.data
}

export const UpdateUserInfo = async (id, token, data) => {
    try {
        const res = await axiosJWT.put(`users/update-user/${id}`, data, {
            headers: {
                token: `Bearer ${token}`,
            }
        })
        return res.data
    } catch (e) {
        console.log(e)
    }
}

export const refreshToken = async (refreshToken) => {
    const res = await req.post(`users/refresh-token`, {}, {
        headers: {
            token: `Bearer ${refreshToken}`
        }
    })
    return res.data
}

