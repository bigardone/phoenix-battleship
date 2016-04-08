import React, {PropTypes} from 'react';
import classnames         from 'classnames';
import Constants          from '../../constants';
import { setGame }        from '../../actions/game';

export default class Board extends React.Component {
  _renderRows(data) {
    const { grid } = data;

    let rows = [this._buildRowHeader()];

    for (var x = 0; x < 10; x++) {
      let cells = [<div key={`header-${x}`} className="header cell">{x + 1}</div>];

      for (var y = 0; y < 10; y++) {
        cells.push(this._renderCell(x, y, grid[`${y}${x}`]));
      }

      rows.push(<div className="row" key={x}>{cells}</div>);
    }

    return rows;
  }

  _renderCell(x, y, value) {
    const { selectedShip, gameChannel, dispatch } = this.props;

    const onClick = (e) => {
      if (selectedShip.name === null) return false;
      if (value != Constants.GRID_VALUE_WATTER) return false;

      console.log(y, x);

      const ship = {
        x: x,
        y: y,
        size: selectedShip.size,
        orientation: selectedShip.orientation,
      };

      gameChannel.push('game:place_ship', { ship: ship })
      .receive('ok', (payload) => {
        dispatch(setGame(payload.game));
      })
      .receive('error', (payload) => console.log(payload));
    };

    const classes = classnames({
      cell: true,
      ship: value === Constants.GRID_VALUE_SHIP,
    });

    return (
      <div
        className={classes}
        key={`${x}${y}`}
        onClick={onClick}>{value}</div>
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
    const { data, selectedShip } = this.props;

    const classes = classnames({
      grid: true,
      pointer: selectedShip.name != null,
    });

    return (
      <div className={classes}>
        {::this._renderRows(data)}
      </div>
    );
  }
}
