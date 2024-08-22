import { jwtDecode } from "jwt-decode";
import { TypeToken } from "../store/services/auth";

export function isTokenExpired(token: string, threshhold = 20) {
  if (!token && token === "") {
    return true;
  }
  try {
    const decodedToken = jwtDecode<TypeToken>(token);
    const currentTime = Date.now() / 1000;
    const timeLeft = decodedToken.exp - currentTime;
    return timeLeft < threshhold * 60;
  } catch (error) {
    return true;
  }
}
