import React, { PropTypes } from 'react';
import { push }             from 'react-router-redux';
import { Socket }           from 'phoenix';
import { connect }          from 'react-redux';
import { setPlayer }        from '../../actions/session';
import ShipSelector         from '../../components/game/ship_selector';
import Board                from '../../components/game/board';

class GameShowView extends React.Component {
  componentDidMount() {
    this._joinGame();
  }

  _joinGame() {
    const { dispatch, player, socket } = this.props;

    const gameId = this.props.params.id;

    const channel = socket.channel(`game:${gameId}`);
    channel.join()
    .receive('ok', () => {
      console.log('ok');
    })
    .receive('error', (payload) => {
      if (payload.reason === 'No more players allowed') dispatch(push('/'));
    });
  }

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
  state.session
);

export default connect(mapStateToProps)(GameShowView);
