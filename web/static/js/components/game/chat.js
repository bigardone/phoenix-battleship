import React, {PropTypes} from 'react';
import classnames         from 'classnames';

export default class Chat extends React.Component {
  _handleFormSubmit(e) {
    e.preventDefault();
  }

  _renderOpponentStatus(opponentIsConnected) {
    const classes = classnames({
      status: true,
      connected: opponentIsConnected,
    });

    const status = opponentIsConnected ? 'Opponent is connected' : 'No opponent yet';

    return (
      <p>
        <i className={classes}/> {status}
      </p>
    );
  }

  _renderMessages() {
    const { messages } = this.props;

    const nodes = messages.map((message, i) => {
      return (
        <li key={i}><strong>{message.player_id}</strong>: {message.text}</li>
      );
    });

    return (
      <ul>{nodes}</ul>
    );
  }

  _handleTextKeyUp(e) {
    if (e.which != 13) return false;

    e.preventDefault();

    const { messageText } = this.refs;
    const text = messageText.value.trim();

    if (text === '') return false;

    const { gameChannel } = this.props;

    gameChannel.push('game:send_message', { text: text });
    messageText.value = '';
  }

  render() {
    const { opponentIsConnected } = this.props;

    return (
      <aside id="chat_container">
        <header>
          {::this._renderOpponentStatus(opponentIsConnected)}
        </header>
        <div className="messages-container">
          {::this._renderMessages()}
        </div>
        <div className="form-container">
          <form onSubmit={::this._handleFormSubmit}>
            <textarea
              disabled={!opponentIsConnected}
              ref="messageText"
              onKeyUp={::this._handleTextKeyUp}
              placeholder="Type message and hit intro..."/>
          </form>
        </div>
      </aside>
    );
  }
}
