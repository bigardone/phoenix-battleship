import React, { PropTypes } from 'react';
import { connect }          from 'react-redux';
import { newGame }          from '../../actions/home';

class HomeIndexView extends React.Component {
  _handleFormSubmit(e) {
    e.preventDefault();

    let { player } = this.props;
    const { playerName } = this.refs;
    const name = playerName.value.trim();

    if (name === '') return false;

    player.name = name;

    const { dispatch } = this.props;
    dispatch(newGame(player));
  }

  render() {
    const { player } = this.props;

    return (
      <div id="home_index" className="view-container">
        <header>
          <h1>Ahoy, Matey!</h1>
        </header>
        <form onSubmit={::this._handleFormSubmit}>
          <input
            ref="playerName"
            type="text"
            placeholder="What's your name?"
            defaultValue={player.name}/>
          <button type="submit" >Start battle, arr!</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  state.session
);

export default connect(mapStateToProps)(HomeIndexView);
