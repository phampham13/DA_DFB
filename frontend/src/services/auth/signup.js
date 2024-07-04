import { req } from "../../utils/httpRequest";

export const signup = async ({ email, name, phoneNumber, password, role, state }) => {
    try {
        const res = await req.post("/users/sign-up", { email, name, phoneNumber, password, role, state });

        return res.data;
    } catch (err) {
        console.log(err);
    }
};