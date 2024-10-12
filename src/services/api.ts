import axios from "axios";
import { ACCOUNT, API_URL } from "../utils/constants";


export const login = async (phone: string, password: string) => {
    const response = await axios.post(`${API_URL}/${ACCOUNT}/login`, {
      phone,
      password,
    });
    return response;
  };