import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import mit, { Emitter } from "./mit";

export type AuthService<AuthUser, SignInOptions, SignUpOptions> = {
  init(): Promise<void>
  isAuthenticated(): Promise<boolean>
  currentUserInfo(): Promise<AuthUser>
  signIn(options: SignInOptions): Promise<AuthUser>
  signUp(options: SignUpOptions): Promise<AuthUser>
  signOut(): Promise<void>
}

type GetAuthUser<Service> = Service extends AuthService<infer AuthUser, unknown, unknown> ? AuthUser : unknown
type GetSignInOptions<Service> = Service extends AuthService<unknown, infer SignInOptions, unknown> ? SignInOptions : unknown
type GetSignUpOptions<Service> = Service extends AuthService<unknown, infer SignUpOptions, unknown> ? SignUpOptions : unknown

export type AuthState<AuthUser> = {
  user?: AuthUser
  logged?: boolean
  ready?: boolean
}
export type AuthContextValue<Service extends AuthService<unknown, unknown, unknown> = AuthService<unknown, unknown, unknown>> =
  Omit<Service, 'init'>
  & {
    stateChange: Emitter<AuthState<GetAuthUser<Service>>>
  }

export type CreateAuthOptions<Service extends AuthService<any, any, any>> = {
  service: Service
}

export type AuthProviderProps<Service extends AuthService<any, any, any>> = React.PropsWithChildren<{
  initialValue?: GetAuthUser<Service>
}>
export const createAuth = <
  Service extends AuthService<any, any, any>,
  AuthUser = GetAuthUser<Service>,
  SignInOptions = GetSignInOptions<Service>,
  SignUpOptions = GetSignUpOptions<Service>,
>(options: CreateAuthOptions<Service>) => {
  const {
    service
  } = options

  const AuthContext = React.createContext<AuthContextValue>(null)
  const AuthProvider = ({ children, initialValue }: AuthProviderProps<Service>) => {
    const stateChange = useMemo(() => mit<AuthState<AuthUser>>({
      initialValue: {
        user: initialValue,
        logged: !!initialValue,
        ready: !(initialValue === undefined)
      }
    }), [])

    useEffect(() => {
      service.init().then(async () => {
        if (await service.isAuthenticated()) {
          stateChange.emit({
            user: await service.currentUserInfo(),
            logged: true,
            ready: true,
          })
          return
        }
        stateChange.emit({
          user: null,
          logged: false,
          ready: true,
        })
      })
    }, [service])

    const value = useMemo(() => ({
      isAuthenticated() {
        return service.isAuthenticated()
      },
      currentUserInfo() {
        return service.currentUserInfo()
      },
      async signIn(options: SignInOptions) {
        const user = await service.signIn(options)
        stateChange.emit({
          user,
          logged: true,
          ready: true,
        })
        return user
      },
      async signUp(options: SignUpOptions) {
        const user = await service.signUp(options)
        stateChange.emit({
          user,
          logged: true,
          ready: true,
        })
        return user
      },
      async signOut() {
        await service.signOut()
        stateChange.emit({
          user: null,
          logged: false,
          ready: true,
        })
      },
      stateChange,
    }), [service, stateChange])

    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    )
  }
  const useAuth = (): AuthContextValue<Service> => {
    const auth = useContext(AuthContext as React.Context<AuthContextValue<Service>>)
    if (!auth) {
      throw new Error('AuthContext cannot be null. Use AuthService before use auth hooks.')
    }
    return auth
  }

  const useAuthState = () => {
    const { stateChange } = useAuth()
    const [state, setState] = useState(stateChange.lastEmittedValue)
    useEffect(() => {
      return stateChange.subscribe((value) => setState(value))
    }, [stateChange, setState])
    return state
  }

  return {
    AuthProvider,
    useAuth,
    useAuthState,
  }
}

