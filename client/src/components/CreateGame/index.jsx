import axios from "axios";
import React from "react";
import { Link, Route, useHistory } from 'react-router-dom';
import Lobby from '../Lobby';
import "./style.css";
// import { useSocket } from '../../utils/SocketProvider';

// import uuid from "react-uuid"

function CreateGame(props) {
  const history = useHistory();
  const setOwner = props.setOwner;
  const setGameID = props.setGameID
  // const socket = useSocket();
  const setMaxRounds = props.setMaxRounds;
  const setTimer = props.setTimer;

  const newGame = async (event) => {
    event.preventDefault();
    axios.post('/api/game', { test: "test" }, { withCredentials: true })
      .then(async res => {
        await setOwner(true);
        await setGameID(res.data.game_id)
        console.log("res.data: " + res.data)
        await setMaxRounds(res.data.maxrounds)
        await setTimer(res.data.timer)
        history.push("/Lobby")
      })
      .catch(err => console.log(err))
  }

  return (
    <form className="createPage">
      <div className="form-group">
        <h4>Create a Lobby</h4>
        <p>(click create lobby to get your secure lobby id)</p>
        
        <Link to="/Lobby" onClick={newGame} type="submit" className="btn">Create Lobby</Link>
        <Route path="/Lobby" component={Lobby} />
      </div>
    </form>
  )
}

export default CreateGame;