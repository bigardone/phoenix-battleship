defmodule Battleship.Game.BoardTest do
  @moduledoc false
  use ExUnit.Case, async: true
  alias Battleship.Game.Board
  alias Battleship.Ship

  @player_id 4 |> :crypto.strong_rand_bytes |> Base.encode64()

  setup do
    {:ok, board} = Board.create(@player_id)

    valid_ships = [
      %Ship{x: 0, y: 0, size: 5, orientation: :vertical},
      %Ship{x: 1, y: 0, size: 4, orientation: :vertical},
      %Ship{x: 2, y: 0, size: 3, orientation: :vertical},
      %Ship{x: 3, y: 0, size: 2, orientation: :vertical},
      %Ship{x: 4, y: 0, size: 1, orientation: :vertical}
    ]

    on_exit fn ->
      Board.destroy(@player_id)
    end

    {:ok, board: board, valid_ships: valid_ships}
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

    overlaping_ship = %{valid_ship | size: 4, orientation: :horizontal}
    assert {:error, "Ship has invalid coordinates"} = Board.add_ship(@player_id, overlaping_ship)
  end

  test "addding valid ships", %{valid_ships: valid_ships} do
    valid_ships
    |> Enum.each(fn ship -> assert {:ok, %Board{}} = Board.add_ship(@player_id, ship) end)

    hit_points =  Enum.reduce(valid_ships, 0, &(&1.size + &2))

    assert %Board{ready: true, hit_points: hit_points} = Board.get_data(@player_id)
  end

  test "taking a shot into water", %{valid_ships: valid_ships} do
    valid_ships
    |> Enum.each(&Board.add_ship(@player_id, &1))

    assert {:ok, %Board{grid: %{"99" => "O"}} = board} = Board.take_shot(@player_id, x: 9, y: 9)
  end

  test "taking a shot into a ship", %{valid_ships: valid_ships} do
    valid_ships
    |> Enum.each(&Board.add_ship(@player_id, &1))

    assert {:ok, %Board{grid: %{"00" => "*"}, hit_points: 14}} = Board.take_shot(@player_id, x: 0, y: 0)
  end
end
