import React, { useEffect, useState } from "react";
import BlackCard from "../BlackCard";
import WhiteCard from "../WhiteCard";
import answers from "../../utils/answers";
// import questions from "../../utils/questions";
import axios from "axios";

function GamePlay() {
  const [whiteCard, setWhiteCard] = useState([]);
  const [blackCard, setBlackCard] = useState();
  const [user, setUser] = useState();
  // const [player, setplayer] = useState({});

  useEffect(() => {
    axios.get('/api/round', { withCredentials: true })
      .then(res => {
        setBlackCard(res.data.prompt)
        console.log(res.data)
      })
      .catch(err => console.log(err))
    axios.get('/api/player/cards', { withCredentials: true })
      .then(res => {
        setWhiteCard(res.data.cards)
        setUser(res.data.user_id)
      })
      .catch(err => console.log(err))
  }, [])

  return (
    <div className="container-fluid">
         <div className="d-flex flex-row">
        <BlackCard blackcard={blackCard} />
      </div>
      <div className="d-flex flex-row justify-content-center">
      {whiteCard.map((card) => (
        <WhiteCard key={whiteCard.indexOf(card)} card={card} user={user} />
      ))}    
      </div>
    </div>
  )
}

export default GamePlay;