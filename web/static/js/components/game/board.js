import React, {PropTypes} from 'react';

export default class Board extends React.Component {
  _renderRows() {
    let rows = [];

    for (var x = 0; x < 10; x++) {
      let cells = [];

      for (var y = 0; y < 10; y++) {
        cells.push(<div className="cell" key={`${x}${y}`}>{`${x}${y}`}</div>);
      }

      rows.push(<div className="row" key={x}>{cells}</div>);
    }

    return rows;
  }

  render() {
    return (
      <div className="grid">
        {::this._renderRows()}
      </div>
    );
  }
}
