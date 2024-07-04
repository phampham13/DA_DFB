import axios from "axios";
import { createAuthHeader } from "./auth/authHeader";
import { axiosJWT } from "../utils/httpRequest";

//const token = localStorage.getItem("token");
class ProductAPI {
  async getAllProduct(limit, page, sort) {
    let res = {};
    try {
      res = await axios.get(
        `${process.env.REACT_API_URL_BACKEND}/products/getAll?limit=${limit}&page=${page}&sort=asc&sort=${sort}`
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }
  async getDetailProduct(id) {
    let res = {};
    try {
      res = await axios.get(
        `${process.env.REACT_API_URL_BACKEND}/products/getDetail/${id}`
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }
  async addProduct(body, token) {
    const res = await axiosJWT.post(`/products/create`, body, {
      headers: {
        token: `Bearer ${token}`,
      }
    })
    return res.data
  }
  async updateProduct(id, body, token) {
    const res = await axiosJWT.put(`/products/update/${id}`, body, {
      headers: {
        token: `Bearer ${token}`,
      }
    })
    return res.data
  }
  async deleteProduct(id, token) {
    const res = await axiosJWT.delete(`/products/delete/${id}`, {
      headers: {
        token: `Bearer ${token}`,
      }
    })
    return res.data
  }
  async deleteProductmany(ids, token) {
    const res = await axiosJWT.post(`/products/delete-many`, ids, {
      headers: {
        token: `Bearer ${token}`,
      }
    })
    return res.data
  }
}
export const ApiProduct = new ProductAPI();