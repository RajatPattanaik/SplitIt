import React, { useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import AuthContext from '../../store/auth-context';

function Home() {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logout();
    navigate('/login', { replace: true });
  };
  return (
    <div>
      {isLoggedIn ? (<p>Login success</p>) : (
        <div>
          <Link to="/login">Signup</Link>
          <Link to="/login">Login</Link>
        </div>
      )}
      {isLoggedIn && (<button onClick={logoutHandler}>Logout</button>)}
    </div>
  );
}

export default Home;