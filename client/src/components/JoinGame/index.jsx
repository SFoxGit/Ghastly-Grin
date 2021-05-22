import React, { useRef } from "react";
import Lobby from "../Lobby";
import { Route, useHistory } from 'react-router-dom';
import axios from "axios";
import "./style.css";

function JoinGame(props) {
  const setGameID = props.setGameID
  const setOwner = props.setOwner
  const history = useHistory();
  const gameID = useRef();
  const newPlayer = async (event) => {
    const ID = gameID.current.value
    event.preventDefault();
    await axios.post('/api/player', { id: ID }, { withCredentials: true })
      .then(async res => {
        await setGameID(res.data.game_id);
        setOwner(false);
        history.push("/Lobby")
      }
      )
      .catch(err => console.log(err))
  }
  // useEffect(() => {
  //   console.log("Lobby Use Effect")
  //   if (socket == null) return
  //   console.log("socket present on lobby");
  //   socket.on('receive-round', function (roundData) {
  //     console.log(roundData);
  //     console.log("received round");
  //     setPlayers(roundData.playerNames)
  //     roundData.formatData.game_owner === user ? setOwner(true) : setOwner(false);
  //     if (roundData.formatData.round > 0) {
  //       axios.put('/api/player/hand', { withCredentials: true })
  //         .then(res => {
  //           history.push('/GamePlay')
  //         })
  //         .catch(err => console.log(err))
  //     }
  //   })

  //   // return () => socket.off('receive-round')
  // }, [socket, history, setOwner, user, setRounds, setMaxRounds, setTimer, setPlayers])
  return (
    <form>
      <div className="form-group">
        <h4>Join Lobby</h4>
        <label htmlFor="lobbyCode">Lobby ID</label>
        <input ref={gameID} type="text" className="form-control" id="lobbyCode" />
        <button style={{ zIndex: "1" }} onClick={newPlayer} type="click" className="btn">Join Lobby</button>
      </div>
      <Route path="/Lobby" component={Lobby} />
    </form>
  )
}

export default JoinGame;