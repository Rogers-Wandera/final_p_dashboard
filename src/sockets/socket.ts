import { io } from "socket.io-client";

const url = import.meta.env.VITE_NODE_URL;
const url2 = import.meta.env.VITE_PY_URL;

export const socket = io(url, { withCredentials: true, autoConnect: false });
export const pysocket = io(url2, { withCredentials: true, autoConnect: false });
