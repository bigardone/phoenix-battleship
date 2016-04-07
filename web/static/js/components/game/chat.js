import React, {PropTypes} from 'react';

export default class Chat extends React.Component {
  _handleFormSubmit(e) {
    e.preventDefault();
  }

  render() {
    return (
      <aside id="chat_container">
        <div className="messages-container"></div>
        <div className="form-container">
          <form onSubmit={::this._handleFormSubmit}>
            <textarea ref="messageText" placeholder="Type message and hit intro..."/>
          </form>
        </div>
      </aside>
    );
  }
}
