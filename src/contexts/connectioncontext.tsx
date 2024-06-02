import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { socket } from "../sockets/socket";

interface ConnectionProviderProps {
  children: React.ReactNode;
}

interface ConnectionContextType {
  conn: Socket | null;
}

const ConnectionContext = createContext<ConnectionContextType | null>({
  conn: null,
});
export const ConnectionProvider: React.FC<ConnectionProviderProps> = ({
  children,
}) => {
  const [conn, setConn] = useState<Socket | null>(null);
  const newConnection = socket.connect();

  useEffect(() => {
    newConnection.on("connect", () => {});

    setConn(newConnection);
    return () => {
      newConnection.disconnect();
    };
  }, []);
  return (
    <ConnectionContext.Provider value={{ conn }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context?.conn;
};

export default ConnectionProvider;
