defmodule Battleship.Game.Board do
  @moduledoc """
  Game board
  """
  alias Battleship.{Ship}
  require Logger

  @ships_sizes [5, 4, 3, 3, 2]
  @size 10
  @orientations [:horizontal, :vertical]
  @grid_values %{
    water: "·",
    ship: "/",
    water_hit: "O",
    ship_hit: "*"
  }

  defstruct [
    player_id: nil,
    ships: [],
    ships_grid: %{},
    ready: false
  ]

  @doc """
  Creates a new board for a Player
  """
  def create(player_id) do
    Logger.debug "Starting board for player #{player_id}"

    ships_grid = build_grid

    Agent.start(fn -> %__MODULE__{player_id: player_id, ships_grid: ships_grid} end, name: ref(player_id))
  end

  @doc """
  Destroys an existing Player board
  """
  def destroy(player_id) do
    Logger.debug "Stopping board for player #{player_id}"

    Agent.stop(ref(player_id), :normal, :infinity)
  end

  @doc """
  Adds a new ship to the board
  """
  def add_ship(_player_id, %Ship{size: size}) when not size in @ships_sizes, do: {:error, "Invalid size"}
  def add_ship(_player_id, %Ship{x: x}) when x > (@size - 1) or x < 0, do: {:error, "Invalid position"}
  def add_ship(_player_id, %Ship{y: y}) when y > (@size - 1) or y < 0, do: {:error, "Invalid position"}
  def add_ship(_player_id, %Ship{orientation: orientation}) when not orientation in @orientations, do: {:error, "Invalid orientation"}
  def add_ship(player_id, ship) do
    Logger.debug "Adding ship for player #{player_id}"

    board = Agent.get(ref(player_id), &(&1))

    cond do
      board.ready ->
        {:error, "All ships are placed"}
      ship_already_placed?(board, ship) ->
        {:error, "Ship already added"}
      ship_with_invalid_bounds?(ship) || ship_with_invalid_coordinates?(board, ship) ->
        {:error, "Ship has invalid coordinates"}
      true ->
        ships_grid = add_ship_to_grid(board.ships_grid, ship)
        ships = [ship | board.ships]
        ready = length(ships) == length(@ships_sizes)
        new_board = %{board | ships: [ship | board.ships], ships_grid: ships_grid, ready: ready}
        Agent.update(ref(player_id), fn(_) -> new_board end)

        {:ok, new_board}
    end
  end

  def get_data(player_id) do
    Logger.debug "Getting board state for player #{player_id}"

    Agent.get(ref(player_id), &(&1))
  end

  defp ref(player_id), do: {:global, {:board, player_id}}

  @doc """
  Checks if a similar ship has been already placed
  """
  defp ship_already_placed?(%__MODULE__{ships: ships}, %Ship{size: size}) do
    permited_amount = Enum.count(@ships_sizes, &(&1 == size))
    Enum.count(ships, &(&1.size == size)) == permited_amount
  end

  defp ship_with_invalid_bounds?(%Ship{orientation: orientation} = ship) when orientation == :horizontal do
    ship.x + ship.size > @size
  end

  defp ship_with_invalid_bounds?(%Ship{orientation: orientation} = ship) when orientation == :vertical do
    ship.y + ship.size > @size
  end

  defp ship_with_invalid_coordinates?(board, ship) do
    ship
    |> Ship.coordinates
    |> Enum.map(&(board.ships_grid[&1] == @grid_values.ship))
    |> Enum.any?(&(&1 == true))
  end

  defp add_ship_to_grid(grid, ship) do
    ship_values = ship
      |> Ship.coordinates
      |> Enum.reduce(%{}, fn(coord, acc) -> Map.put(acc, coord, @grid_values.ship) end)

    Map.merge grid, ship_values
  end

  def build_grid do
    list = Enum.reduce 0..@size - 1, [], fn y, rows ->
      row = 0..@size - 1
        |> Enum.reduce(rows, fn x, col ->
          [Enum.join([y, x], "") | col]
        end)

      [row | rows]
    end

    list
    |> List.flatten
    |> Enum.reduce(%{}, fn item, acc ->
      Map.put(acc, item, "·")
    end)
  end
end
