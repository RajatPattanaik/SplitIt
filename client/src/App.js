import { Fragment } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom'; 
import Login from './pages/Login';

function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="Login" element={<Login/>}/>
      </Routes>
    </Fragment>
  );
}

export default App;
