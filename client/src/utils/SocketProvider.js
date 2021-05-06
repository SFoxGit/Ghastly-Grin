import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()

export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({ gameID, children }) {
  const [socket, setSocket] = useState()
  useEffect(() => {
    const newSocket = io('http://localhost:3002', { query: { gameID } })
    setSocket(newSocket)
    return () => newSocket.close()
  }, [gameID])
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
