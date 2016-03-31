defmodule Battleship.Game.BoardTest do
  @moduledoc false
  use ExUnit.Case, async: true
  alias Battleship.Game.Board
  alias Battleship.Ship

  @player_id "player-1"

  setup do
    {:ok, board} = Board.create(@player_id)

    on_exit fn ->
      Board.destroy(@player_id)
    end

    {:ok, board: board}
  end

  test "adding invalid ships" do
    invalid_size_ship = %Ship{size: 10}
    assert {:error, "Invalid size"} = Board.add_ship(@player_id, invalid_size_ship)

    invalid_position_ship = %Ship{x: 100, size: 5}
    assert {:error, "Invalid position"} = Board.add_ship(@player_id, invalid_position_ship)

    invalid_orientation_ship = %Ship{size: 5, orientation: :invalid}
    assert {:error, "Invalid orientation"} = Board.add_ship(@player_id, invalid_orientation_ship)

    valid_ship = %Ship{x: 0, y: 0, size: 5, orientation: :vertical}
    Board.add_ship(@player_id, valid_ship)
    assert {:error, "Ship already added"} = Board.add_ship(@player_id, valid_ship)

    invalid_coordinates_ship = %Ship{x: 0, y: 8, size: 3, orientation: :vertical}
    assert {:error, "Ship has invalid coordinates"} = Board.add_ship(@player_id, invalid_coordinates_ship)
  end

  test "addding valid ships" do
    ship = %Ship{x: 0, y: 0, size: 5, orientation: :vertical}
    assert {:ok, ^ship} = Board.add_ship(@player_id, ship)

    ship = %Ship{x: 0, y: 0, size: 3, orientation: :vertical}
    assert {:ok, ^ship} = Board.add_ship(@player_id, ship)

    ship = %Ship{x: 0, y: 7, size: 3, orientation: :vertical}
    assert {:ok, ^ship} = Board.add_ship(@player_id, ship)
  end
end
