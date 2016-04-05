import React, { PropTypes } from 'react';
import { connect }          from 'react-redux';
import ShipSelector         from '../../components/game/ship_selector';
import Board                from '../../components/game/board';

class GameShowView extends React.Component {
  render() {
    return (
      <div id="game_show" className="view-container">
        <section id="boards_container">
          <header>
            Header
          </header>
          <ShipSelector />
          <Board/>
        </section>
        <aside id="chat_container">
        </aside>
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  state
);

export default connect(mapStateToProps)(GameShowView);
