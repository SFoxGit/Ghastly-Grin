import axios from "axios";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import "./style.css";


function Nav(props) {
  const history = useHistory();
  const loggedIn = props.loggedIn
  const setLoggedIn = props.setLoggedIn


  const logOut = () => {
    axios.post('/api/user/logout', { withCredentials: true })
      .then(() => {
        setLoggedIn(false)
        history.push('/')
      })
      .catch(err => history.push('/LogSign'))
  }

  return (
    <ul className="nav nav-login">
      {loggedIn ?
        <>
          <li className="nav-item">
            <Link to="/CreateGame">
              <div className="nav-link">Create/Join Game</div>
            </Link>
          </li>
          <li className="nav-item">
            <div onClick={logOut} className="nav-link">Log Out</div>
          </li>
        </>
        :
        <li className="nav-item">
          <Link to="/LogSign">
            <div className="nav-link">Login / Signup</div>
          </Link>
        </li>
      }
    </ul>
  )
}

export default Nav;