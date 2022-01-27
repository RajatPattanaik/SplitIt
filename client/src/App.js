import { Fragment } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom'; 
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<Home />} exact/>
      </Routes>
    </Fragment>
  );
}

export default App;
