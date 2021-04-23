import React, { useRef, useState } from "react";
import Nav from "../Nav";
import "./style.css"
import { Link } from 'react-router-dom';

function HeaderMobile() {
  const [hamburgerState, setHamburgerState] = useState(true);

  return (
    <nav className="mobile-navigation .container-fluid">
      <div className="mobile-menu-base">
        <img className="headLogo" src="/GhastlyGrinLogoTrans_green.png" alt="logo" />
        <Link to="/">
          <h1 id="title" className="row">Ghastly Grin</h1>
        </Link>
        <div onClick={() => setHamburgerState(!hamburgerState)} className={hamburgerState ? null : 'open'} id="nav-icon2">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className={hamburgerState ? 'mobile-dropdown' : 'mobile-dropdown open'} >
        <div className="nav-group">
          <Link className="nav-link-wrap" to="/">
            <span><a className="nav-links">Home</a></span>
          </Link>
          <Link className="nav-link-wrap" to="/Lobby">
            <span><a className="nav-links">Lobby</a></span>
          </Link >
          <Link className="nav-link-wrap" to="/Lobby">
            <span><a className="nav-links">Exit Game</a></span>
          </Link >
        </div>
        <Nav />
      </div>
    </nav>
  )
}

export default HeaderMobile;