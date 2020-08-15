import React from 'react'
import { AuthService } from './AuthService'

const authService = new AuthService()
const AuthContext = React.createContext<AuthService>(authService)

export const AuthConsumer = AuthContext.Consumer

export const AuthProvider: React.FC = ({ children }) => (
  <AuthContext.Provider value={authService}>{children}</AuthContext.Provider>
)
