import React, {PropTypes} from 'react';

export default class Instructions extends React.Component {
  _handleGameLinkClick(e) {
    e.preventDefault();
    const link = e.target;
    link.select();
    document.execCommand('copy');
  }

  _renderGameURL(show) {
    if (!show) return false;

    const url = document.URL;

    return (<li>Copy this link by clicking on it and share it with your opponent. <br/> <input onClick={::this._handleGameLinkClick} defaultValue={url} readOnly={true}/></li>);
  }

  render() {
    const { readyForBattle, playerIsAttacker } = this.props;

    if (readyForBattle) return false;

    return (
      <div id="opponents_board_container">
        <header>
          <h2>Instructions</h2>
        </header>
        <ol className="instructions">
          {::this._renderGameURL(playerIsAttacker)}
          <li>To place a ship in your board select one by clicking on the gray boxes.</li>
          <li>The selected ship will turn green.</li>
          <li>Switch the orientation of the ship by clicking again on it.</li>
          <li>To place the selected ship click on the cell where you want it to start.</li>
          <li>Repeat the process until you place all your ships.</li>
          <li>Tha battle will start as soon as both players have placed all their ships.</li>
          <li>Good luck!</li>
        </ol>
      </div>
    );
  }
}
