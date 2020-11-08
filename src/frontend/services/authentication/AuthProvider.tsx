import React from 'react'
import { AuthService } from './auth-service/AuthService'

const authService = AuthService.getInstance()
const AuthContext = React.createContext<AuthService>(authService)

export const AuthConsumer = AuthContext.Consumer

export const AuthProvider: React.FC = ({ children }) => (
  <AuthContext.Provider value={authService}>{children}</AuthContext.Provider>
)
