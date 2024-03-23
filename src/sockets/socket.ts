import { io } from "socket.io-client";

const url = import.meta.env.VITE_NODE_URL;

export const socket = io(url, { withCredentials: true, autoConnect: false });
