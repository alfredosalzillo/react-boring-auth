import "@testing-library/jest-dom/extend-expect";

import React from "react";
import {createAuth} from "../src";
import {render, screen, waitFor, fireEvent} from "@testing-library/react";

const service = {
  init: jest.fn().mockResolvedValue(null),
  isAuthenticated: jest.fn().mockResolvedValue(true),
  signIn: jest.fn().mockResolvedValue({ id: 1 }),
  signUp: jest.fn().mockResolvedValue({ id: 1 }),
  signOut: jest.fn().mockResolvedValue(null),
  currentUserInfo: jest.fn().mockResolvedValue({ id: 1 }),
}
const {
  AuthProvider,
  useAuth,
  useAuthState,
} = createAuth({
  service,
})


describe('useAuth', () => {
  it('should throw error if AuthProvider is not used', () => {
    const Component = () => {
      useAuth()
      return <></>
    }
    expect(() => render(<Component />)).toThrow()
  })
})

describe('useAuthState', () => {
  it('should throw error if AuthProvider is not used', () => {
    const Component = () => {
      useAuthState()
      return <></>
    }
    expect(() => render(<Component />)).toThrow()
  })
})

describe('AuthProvider', () => {
  it('should call the init function of the service at the render', () => {
    render(<AuthProvider><></></AuthProvider>)
    expect(service.init).toBeCalled()
  })
  it('should call the isAuthenticated function of the service at the render', () => {
    render(<AuthProvider><></></AuthProvider>)
    expect(service.isAuthenticated).toBeCalled()
  })
  it('should set a ready state', async () => {
    const Component = () => {
      const state = useAuthState()
      if (!state.ready) return <span></span>
      return <span data-testid='content'>{state.logged ? 'logged' : 'not logged'}</span>
    }
    render(<AuthProvider><Component /></AuthProvider>)
    await waitFor(() => screen.getByTestId('content'))
    expect(await screen.getByTestId('content')).toHaveTextContent('logged')
  })
  it('should set a logged state when the user when the user is already logged on the website', async () => {
    const Component = () => {
      const state = useAuthState()
      if (!state.ready) return <span></span>
      return <span data-testid='content'>{state.logged ? 'logged' : 'not logged'}</span>
    }
    render(<AuthProvider><Component /></AuthProvider>)
    await waitFor(() => screen.getByTestId('content'))
    expect(await screen.getByTestId('content')).toHaveTextContent('logged')
  })
  it('should set a not logged state when the user when the user is not logged on the website', async () => {
    service.isAuthenticated.mockReturnValueOnce(false)
    const Component = () => {
      const state = useAuthState()
      if (!state.ready) return <span></span>
      return <span data-testid='content'>{state.logged ? 'logged' : 'not logged'}</span>
    }
    render(<AuthProvider><Component /></AuthProvider>)
    await waitFor(() => screen.getByTestId('content'))
    expect(await screen.getByTestId('content')).toHaveTextContent('not logged')
  })
  it('should set a logged state if the user signIn', async () => {
    service.isAuthenticated.mockReturnValueOnce(false)
    const Component = () => {
      const auth = useAuth()
      const state = useAuthState()
      if (!state.ready) return <span></span>
      if (!state.logged) return <button data-testid='sign-in' onClick={() => auth.signIn()}></button>
      return <span data-testid='status'>{state.logged ? 'logged' : 'not logged'}</span>
    }
    render(<AuthProvider><Component /></AuthProvider>)
    await waitFor(() => screen.getByTestId('sign-in'))
    fireEvent.click(screen.getByTestId('sign-in'))
    await waitFor(() => screen.getByTestId('status'))
    expect(await screen.getByTestId('status')).toHaveTextContent('logged');
  })
  it('should set a logged state if the user signUp', async () => {
    service.isAuthenticated.mockReturnValueOnce(false)
    const Component = () => {
      const auth = useAuth()
      const state = useAuthState()
      if (!state.ready) return <span></span>
      if (!state.logged) return <button data-testid='sign-up' onClick={() => auth.signUp()}></button>
      return <span data-testid='status'>{state.logged ? 'logged' : 'not logged'}</span>
    }
    render(<AuthProvider><Component /></AuthProvider>)
    await waitFor(() => screen.getByTestId('sign-up'))
    fireEvent.click(screen.getByTestId('sign-up'))
    await waitFor(() => screen.getByTestId('status'))
    expect(await screen.getByTestId('status')).toHaveTextContent('logged');
  })
  it('should set a not logged state if the user signOut', async () => {
    const Component = () => {
      const auth = useAuth()
      const state = useAuthState()
      if (!state.ready) return <span></span>
      if (state.logged) return <button data-testid='sign-out' onClick={() => auth.signOut()}></button>
      return <span data-testid='status'>{state.logged ? 'logged' : 'not logged'}</span>
    }
    render(<AuthProvider><Component /></AuthProvider>)
    await waitFor(() => screen.getByTestId('sign-out'))
    fireEvent.click(screen.getByTestId('sign-out'))
    await waitFor(() => screen.getByTestId('status'))
    expect(await screen.getByTestId('status')).toHaveTextContent('not logged');
  })
})