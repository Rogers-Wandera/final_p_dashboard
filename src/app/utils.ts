import { jwtDecode } from "jwt-decode";
import { TypeToken } from "../store/services/auth";

export function isTokenExpired(token: string, threshhold = 20) {
  if (token.length <= 0) {
    return true;
  }
  try {
    const decodedToken = jwtDecode<TypeToken>(token);
    const currentTime = Date.now() / 1000;
    const timeLeft = decodedToken.exp - currentTime;
    return timeLeft < threshhold * 60;
  } catch (error) {
    console.log("error decoding token ", error);
    return true;
  }
}
