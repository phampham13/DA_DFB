import axios from "axios";
import { createAuthHeader } from "./auth/authHeader";
import { axiosJWT } from "../utils/httpRequest";

//const token = localStorage.getItem("token");
class UserBr {
  async GetAll(token) {
    let res = {};
    try {
      res = await axiosJWT.get(
        `/users/getAll`,
        {
          headers: {
            token: `Bearer ${token}`,
          }
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }
  async UpdateState(id, body, token) {
    let res = {};
    try {
      res = await axiosJWT.put(
        `/users/update-user/${id}`, body
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }
  async DeleteUser(id, token) {
    const res = await axiosJWT.delete(`/users/delete-user/${id}`, {
      headers: {
        token: `Bearer ${token}`,
      }
    })
    return res.data
  }
}
export const ApiUserBr = new UserBr();
