import { axiosJWT } from "../utils/httpRequest";

export const getCard = async (id, token) => {
    const res = await axiosJWT.get(`card/${id}`, {
        headers: {
            token: `Bearer ${token}`,
        }
    })
    return res.data
}

export const updateCard = async (id, token, newBooks) => {
    try {
        const res = await axiosJWT.put(`card/update/${id}`, newBooks, {
            headers: {
                token: `Bearer ${token}`,
            }
        })
        return res.data
    } catch (err) {
        throw err
    }
}

export const apiAddBookToCard = async (token, id, book) => {
    try {
        const res = await axiosJWT.post(`card/addBook/${id}`, book, {
            headers: {
                token: `Bearer ${token}`,
            }
        })
        return res.data
    } catch (err) {
        throw err
    }
}