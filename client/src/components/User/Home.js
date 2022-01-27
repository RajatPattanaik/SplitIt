import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import AuthContext from '../../store/auth-context';

function Home() {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logout();
    // optional: redirect the user
  };
  return (
    <div>
      {isLoggedIn ? (<p>Login success</p>) : (
        <div>
          <Link to="/register">
           Signup
          </Link>
          <Link to="/login">
            Login
          </Link>
        </div>
      )}
      {isLoggedIn && (<li><button onClick={logoutHandler}>Logout</button></li>)}
    </div>
  );
}

export default Home;