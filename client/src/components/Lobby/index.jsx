import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import axios from "axios";
import { useHistory } from "react-router";
import { useSocket } from '../../utils/SocketProvider';

function Lobby(props) {
  const history = useHistory();
  const [whiteCards, setWhiteCards] = useState([]);
  const timer = props.timer;
  const setTimer = props.setTimer;
  const user = props.userID;
  const game = props.gameID;
  const owner = props.owner;
  const setOwner = props.setOwner;
  const setRounds = props.setRounds
  // const rounds = props.rounds
  const maxRounds = props.maxRounds;
  const setMaxRounds = props.setMaxRounds;
  const players = props.players;
  const setPlayers = props.setPlayers;
  const numRounds = useRef();
  const timerCount = useRef();
  const cohortPack = useRef();
  const cahPack = useRef();
  const newCard = useRef();
  // const [componentMounted, setComponentMounted] = useState(true);
  // const stopTime = props.stopTime;
  const socket = useSocket();

  const updateGame = async (e) => {
    e.preventDefault();
    await axios.put('/api/game/update', { rounds: numRounds.current.value, timer: timerCount.current.value, cp: cohortPack.current.checked, cah: cahPack.current.checked }, { withCredentials: true })
      .then(res => {
        setWhiteCards(res.data.answers)
      })
      .catch(err => console.log(err))
  }

  const removeCard = async (e) => {
    await axios.put('/api/deck/del', { card: e.target.innerHTML }, { withCredentials: true })
      .then(res => {
        console.log("set new whitecards")
      })
      .catch(err => console.log(err))
    socket.emit('deck')
  }

  const addCard = async () => {
    await axios.put('/api/deck', { card: newCard.current.value }, { withCredentials: true })
      .then(res => {
        newCard.current.value = ""
      })
      .catch(err => console.log(err));
    socket.emit('deck')
  }

  const startGame = async () => {
    await axios.put('/api/game/', { withCredentials: true })
      .then(res => console.log(res))
      .catch(err => console.log(err))
    await axios.post('/api/round', { users: players }, { withCredentials: true })
      .then(res => {
        console.log()
      })
      .catch(err => console.log("round: " + err))
    socket.emit('round', game)
  }

  useEffect(() => {
    if (socket == null) return
    socket.on('receive-round', function (roundData) {
      setRounds(roundData.formatData.round);
      setMaxRounds(roundData.formatData.maxrounds);
      setTimer(roundData.formatData.timer);
      setPlayers(roundData.playerNames)
      roundData.formatData.game_owner === user ? setOwner(true) : setOwner(false);
      if (roundData.formatData.round > 0) {
        axios.put('/api/player/hand', { withCredentials: true })
          .then(res => {
            history.push('/GamePlay')
          })
          .catch(err => console.log(err))
      }
    })

    // return () => socket.off('receive-round')
  }, [socket, history, setOwner, user, setRounds, setMaxRounds, setTimer, setPlayers])

  useEffect(() => {
    axios.get('/api/deck', { withCredentials: true })
      .then(res => {
        setWhiteCards(res.data.answers)
      })
      .catch(err => console.log(err))
    if (socket == null) return
    socket.on('receive-deck', function (deckData) {
      setWhiteCards(deckData.deck.answers)
    })
  }, [socket])

  useEffect(() => {
    socket.emit('round')
  }, [socket])

  return (

    <div className="lobby-page main-content">
      <div className="lobby-start">
        <h4 className="lob-h">Lobby: {game}</h4>
        {owner ?
          <form>
            <div className="form-group">
              <label htmlFor="numRounds">Number of Rounds</label>
              <input ref={numRounds} type="number" className="form-control" id="numRounds" aria-describedby="numRounds" defaultValue={maxRounds} />
            </div>
            <div className="form-group">
              <label htmlFor="timerCount">Timer Per Round</label>
              <input ref={timerCount} type="number" className="form-control" id="timerCount" aria-describedby="timerCount" defaultValue={timer} />
            </div>
            <div className="form-group pack-check">
              <div className="checks">
                <input
                  ref={cohortPack}
                  type="checkbox"
                  id="GCP"
                  aria-describedby="GCP"
                  value="cohort"
                />
                <label className="checks-label" htmlFor="GCP">Greatest Cohort Pack</label>
              </div>

              <div className="checks">
                <input
                  ref={cahPack}
                  type="checkbox"
                  id="cah"
                  aria-describedby="cah"
                  value="cah" />
                <label className="checks-label" htmlFor="GCP">Cards Against Humanity Pack</label>
              </div>
            </div>
            <div className="btn-parent">
              <button onClick={(e) => updateGame(e)} type="click" className="btn">Update Game</button>
            </div>
          </form>
          : null}
        <button onClick={owner ? startGame : null} type="submit" className="btn startBtn">{owner ? 'Start Game' : 'Waiting'}</button>

        <h4 className="playersHeader">Players:</h4>
        <ul className="players">
          {players.map(player => {
            return (<li key={player}>{player}</li>)
          })}


        </ul>
      </div>
      <div className="chat">
        <h4 className="chat-h">Answer Cards</h4>
        <div className="input-btn d-flex align-items-center justify-content-center">
          <label htmlFor="add-card">Make a Card</label>
          <input className="create-input"
            style={{ zIndex: "1" }}
            placeholder="card text here"
            id="add-card"
            ref={newCard}
            type="text"
            aria-describedby="addCard" />
          <button style={{ zIndex: "1" }} id="create-cards" onClick={addCard} type="button" className="btn startBtn">Create Answer Card</button>
        </div>
        <div className="input-group">
          <ul className="chat-cont scroll">
            {owner ? whiteCards.map(whitecard => {
              return (<div className="addedCardsText" key={whitecard} onMouseOut={(e) => e.target.style.color = "#551A8B"} onMouseOver={(e) => { e.target.style.cursor = "pointer"; e.target.style.color = "#86C232" }} onClick={(e) => removeCard(e)}>{whitecard}</div>)
            }) : <div>Only the owner can view cards</div>}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Lobby;