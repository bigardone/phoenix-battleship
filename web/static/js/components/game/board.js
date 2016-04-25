import React, {PropTypes} from 'react';
import classnames         from 'classnames';
import Constants          from '../../constants';
import { setGame }        from '../../actions/game';

export default class Board extends React.Component {
  _renderRows(data) {
    const { grid } = data;

    let rows = [this._buildRowHeader()];

    for (var y = 0; y < 10; y++) {
      let cells = [<div key={`header-${y}`} className="header cell">{y + 1}</div>];

      for (var x = 0; x < 10; x++) {
        cells.push(this._renderCell(y, x, grid[`${y}${x}`]));
      }

      rows.push(<div className="row" key={y}>{cells}</div>);
    }

    return rows;
  }

  _renderCell(y, x, value) {
    const key = `${y}${x}`;
    const id = this._cellId(key);
    const classes = this._cellClasses(value);

    return (
      <div
        id={::this._cellId(key)}
        className={classes}
        key={key}
        onClick={::this._handleCellClick(y, x, value)}
        onDoubleClick={(e) => e.preventDefault()}
        onMouseOver={::this._handleCellMouseOver(y, x)}>{::this._cellValue(value)}</div>
    );
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

    if (!data) return false;

    const classes = this._boardClasses();

    return (
      <div className={classes}>
        {::this._renderRows(data)}
      </div>
    );
  }
}
