import React from 'react';
import './App.css';
import {AuthProvider, useAuth, useAuthState} from "./auth";

const SignInForm = () => {
  const auth = useAuth()
  return (
    <form name="sign-in" onSubmit={(e) => auth.signIn({
      // @ts-ignore
      email: e.target.email.value,
      // @ts-ignore
      password: e.target.password.value
    })}>
      <label>
        email <br />
        <input name="email" type="email" />
      </label>
      <br />
      <label>
        password <br />
        <input name="password" type="password" autoComplete="current-password" />
      </label>
      <br />
      <button type="submit">
        Sign In
      </button>
    </form>
  )
}

const Home = () => {
  const auth = useAuth()
  const { ready, logged, user } = useAuthState()
  if (!ready) return <div>Loading</div>
  if (!logged) return <SignInForm />
  return <div>
    <h1>A boring example</h1>
    <p>
      Welcome {user.email}
    </p>
    <button onClick={() => auth.signOut()}>
      Sign Out
    </button>
  </div>
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AuthProvider>
          <Home />
        </AuthProvider>
      </header>
    </div>
  );
}

export default App;
