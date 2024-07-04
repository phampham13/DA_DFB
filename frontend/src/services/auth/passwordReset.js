import { req } from "../../utils/httpRequest";

export const sendRequest = async (body) => {
    try {
        const res = await req.post(`users/password-send-email`, body)
        return res.data;
    } catch (err) {
        console.log(err);
    }
};

export const resetPassword = async (body) => {
    try {
        const res = await req.post(`users/password-reset`, body)
        return res.data;
    } catch (err) {
        console.log(err);
    }
};