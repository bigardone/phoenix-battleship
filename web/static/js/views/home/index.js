import React, { PropTypes } from 'react';
import { connect }          from 'react-redux';
import { newGame }          from '../../actions/home';

class HomeIndexView extends React.Component {
  _handleFormSubmit(e) {
    e.preventDefault();

    const { userChannel, dispatch } = this.props;

    dispatch(newGame(userChannel));
  }

  render() {
    return (
      <div id="home_index" className="view-container">
        <header>
          <h1>Ahoy, Matey!</h1>
        </header>
        <form onSubmit={::this._handleFormSubmit}>
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
