import React from "react";
import "./style.css";

function BlackCard(props) {
  // Generate 7 cards for each player
    return (
        <div className="container d-flex justify-content-center">
          <div className="black-card-body">
            <h5 className="card-title">Black Card</h5>
          </div>
        </div>
  )
}

export default BlackCard;