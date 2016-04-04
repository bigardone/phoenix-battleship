import React, {PropTypes} from 'react';

export default class HomeIndexView extends React.Component {
  render() {
    return (
      <div id="home_index" className="view-container">
        <header>
          <h1>Ahoy, Matey!</h1>
        </header>
        <form>
          <p>Start a new battle:</p>
          <input type="text"/>
          <button type="submit">Arr!</button>
        </form>
      </div>
    );
  }
}
