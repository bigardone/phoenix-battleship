import React, {PropTypes} from 'react';

export default class Board extends React.Component {
  _renderRows(data) {
    const { grid } = data;

    let rows = [this._buildRowHeader()];

    for (var x = 0; x < 10; x++) {
      let cells = [<div key={`header-${x}`} className="header cell">{x + 1}</div>];

      for (var y = 0; y < 10; y++) {
        cells.push(<div className="cell grid" key={`${x}${y}`}>{grid[`${x}${y}`]}</div>);
      }

      rows.push(<div className="row" key={x}>{cells}</div>);
    }

    return rows;
  }

  _buildRowHeader() {
    let values = [<div key="empty" className="header cell"></div>];

    for (var i = 0; i < 10; ++i) {
      values.push(<div key={i} className="header cell">{String.fromCharCode(i + 65)}</div>);
    }

    return (
      <div key="col-headers" className="row">
        {values}
      </div>
    );
  }

  render() {
    const { data } = this.props;

    return (
      <div className="grid">
        {::this._renderRows(data)}
      </div>
    );
  }
}
