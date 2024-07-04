import { req } from "../../utils/httpRequest";

export const login = async ({ phoneNumber, password }) => {
    try {
        const res = await req.post('users/sign-in', { phoneNumber, password });

        return res.data;
    } catch (err) {
        console.log(err);
    }
};
