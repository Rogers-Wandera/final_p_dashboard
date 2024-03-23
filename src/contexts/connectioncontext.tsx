import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { socket } from "../sockets/socket";

interface ConnectionProviderProps {
  children: React.ReactNode;
}

const ConnectionContext = createContext<Socket | null>(null);
export const ConnectionProvider: React.FC<ConnectionProviderProps> = ({
  children,
}) => {
  const [conn, setConn] = useState<Socket | null>(null);

  useEffect(() => {
    const newConnection = socket.connect();
    setConn(newConnection);
    return () => {
      newConnection.disconnect();
    };
  }, []);
  return (
    <ConnectionContext.Provider value={conn}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
};

export default ConnectionProvider;
