import React, { PropTypes } from 'react';
import { connect }          from 'react-redux';

class HomeIndexView extends React.Component {
  _handleFormSubmit(e) {
    e.preventDefault();

    const playerId = window.playerId;
    const { playerName } = this.refs;

    if (playerName.value.trim() === '') return false;

    const { dispatch } = this.props;
  }

  render() {
    return (
      <div id="home_index" className="view-container">
        <header>
          <h1>Ahoy, Matey!</h1>
        </header>
        <form onSubmit={::this._handleFormSubmit}>
          <input ref="playerName" type="text" placeholder="What's your name?"/>
          <button type="submit" >Start battle, arr!</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  state
);

export default connect(mapStateToProps)(HomeIndexView);
