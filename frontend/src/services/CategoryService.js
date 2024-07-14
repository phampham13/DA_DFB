import { createAuthHeader } from "./auth/authHeader";
import { axiosJWT, req } from "../utils/httpRequest";
import axios from "axios";
class CateAPI {
    async getAllCate() 
    {
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
    async DeleteCate(id,token) 
    {
        let res = {};
        try {
          res = await axiosJWT.delete(
            `bookCategories/delete/${id}`,   {
              headers: createAuthHeader(token),
            }
          );
          return res.data;  
        } catch (error) {
          console.error("Error fetching books:", error);
          throw error;
        }
    }
    
    async UpdateCate(id,body,token) 
    {
        let res = {};
        let rq={
          newCategory:body
        }
        try {
          res = await axiosJWT.put(
            `bookCategories/update/${id}`, rq,  {
              headers: createAuthHeader(token),
            }
          );
          return res.data;  
        } catch (error) {
          console.error("Error fetching books:", error);
          throw error;
        }
    }
    async CreateCate(body,token) 
    {
        let res = {};
        let rq={
          categoryName:body
        }
        try {
          res = await axiosJWT.post(
            `bookCategories/create`, rq,  {
              headers: createAuthHeader(token),
            }
          );
          return res.data;  
        } catch (error) {
          console.error("Error fetching books:", error);
          throw error;
        }
    }
}
export const cateAPI = new CateAPI();