
import { createAuthHeader } from "./auth/authHeader";
import { axiosJWT, req } from "../utils/httpRequest";

//const token = localStorage.getItem("token");
class APIBOOK {
  async getAllBook(limit, page, sort) {
    let res = {};
    try {
      res = await req.get(
        `/books/getAll?limit=${limit}&page=${page}&sort=asc&sort=${sort}`
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }

  async getBooks(limit, page, categoryName, keyword) {
    let res = {};
    try {
      res = await req.get(
        `/books/get-by-user?limit=${limit}&page=${page}&categoryName=${categoryName}&keyword=${keyword}`
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }

  async UpdateBook(id, body, token) {
    let res = {};
    try {
      console.log("token", token)
      res = await axiosJWT.put(
        `/books/update/${id}`,
        body,
        {
          headers: createAuthHeader(token),
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }
  async DeleteBook(id, token) {
    let res = {};
    try {
      res = await axiosJWT.delete(
        `/books/delete/${id}`,
        {
          headers: createAuthHeader(token),
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }
  async DeleteManyBook(ids, token) {
    let res = {};
    try {
      const body = {
        ids: ids,
      };
      res = await axiosJWT.post(
        `/books/delete-many`,
        body,
        {
          headers: createAuthHeader(token),
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }
  async AddBook(body, token) {
    let res = {};
    try {
      res = await axiosJWT.post(
        `/books/create`,
        body,
        {
          headers: createAuthHeader(token),
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }
  async getAllCate() {
    let res = {};
    try {
      res = await req.get(
        `/bookCategories/getAll`
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }

  async getDetail(id) {
    let res = {};
    try {
      res = await req.get(
        `/books/getDetail/${id}`,
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }
}

export const ApiBOOK = new APIBOOK();
