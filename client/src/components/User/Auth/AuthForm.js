import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthContext from '../../../store/auth-context';
import classes from './AuthForm.module.css';

const AuthForm = () => {
  const navigate = useNavigate();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const usernameInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredUsername = usernameInputRef.current.value;
    // optional: Add validation

    setIsLoading(true);
    let url;
    if (isLogin) {
      url = 'http://localhost:3002/login';
    } else {
      url = 'http://localhost:3002/register';
    }
    const fetchLogin = async () => {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          username: enteredUsername,
          password: enteredPassword,
          email: enteredEmail,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json();
      return data;
    }
    fetchLogin().then(data => {
      if(data){
        const expirationTime = new Date(data.expiresIn)  
        console.log(expirationTime.toISOString());
        authCtx.login(data.token, expirationTime.toISOString());
        navigate('/home', { replace: true });
      }
    }).catch(error => {
      console.log(error);
    });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='username'>Your Username</label>
          <input type='text' id='username' required ref={usernameInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          {!isLoading && (<button>{isLogin ? 'Login' : 'Create Account'}</button>)}
          {isLoading && <p>Sending request...</p>}
          <button type='button' className={classes.toggle} onClick={switchAuthModeHandler}>
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;