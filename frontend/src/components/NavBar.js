import React from "react";
import { Link } from "react-router-dom"
import {UIStore} from "../../store/store";

const NavBar = () => {
  const isLoggedin = UIStore.useState(s => s.isLoggedin);
  function signOut(e) {
    e.preventDefault();
    localStorage.clear();
    window.location.href = '/'
  }
  return(
    <nav className="navbar navbar-expand-lg navbar-light bg-white">
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"/>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav">
          <Link to="/" className="navbar-brand p-3">
            <img src={process.env.PUBLIC_URL + '/pictures/icon.png'} alt='logo' className={'img-fluid mt-2'}/>
            <h4>Carrental</h4>
          </Link>
        </ul>
        <ul className="navbar-nav ml-auto">
          { isLoggedin &&
            <>
              <Link to="/profile" className="navbar-brand">Profile</Link>
              <Link to="/dashboard" className="navbar-brand">Dashboard</Link>
              <button onClick={signOut} className="navbar-brand btn btn-white">Sign out</button>
            </>
            }
          {!isLoggedin &&
            <>
              <Link to="/signin" className="navbar-brand p-3">Sign in</Link>
              <Link to="/signup" className="navbar-brand p-3">Sign up</Link>
            </>
          }
        </ul>
      </div>
    </nav>
  );
}

export default NavBar
