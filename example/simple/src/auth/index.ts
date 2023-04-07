
import { createAuth } from 'react-boring-auth'

type SignInOptions = {
  email: string,
  password: string,
}

type SignUpOptions = {
  email: string,
  password: string,
}

const {
  useAuth,
  useAuthState,
  AuthProvider,
} = createAuth({
  service: {
    async init() {

    },
    async isAuthenticated() {
      return !!localStorage.getItem('boring-auth-simple-example')
    },
    async currentUserInfo(){
      return JSON.parse(localStorage.getItem('boring-auth-simple-example') || '')
    },
    async signIn(options: SignInOptions) {
      localStorage.setItem('boring-auth-simple-example', JSON.stringify({
        email: options.email,
      }))
      return {
        email: options.email,
      }
    },
    async signUp(options: SignUpOptions) {
      localStorage.setItem('boring-auth-simple-example', JSON.stringify({
        email: options.email,
      }))
      return {
        email: options.email,
      }
    },
    async signOut() {
      localStorage.removeItem('boring-auth-simple-example')
    }
  }
})

export {
  useAuth,
  useAuthState,
  AuthProvider,
}