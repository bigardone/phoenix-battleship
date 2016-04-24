defmodule Battleship.Game.Board do
  @moduledoc """
  Game board
  """
  alias Battleship.{Ship}
  require Logger

  @ships_sizes [5, 4, 3, 2, 2, 1, 1]
  @size 10
  @orientations [:horizontal, :vertical]

  @grid_value_water "·"
  @grid_value_ship "/"
  @grid_value_water_hit "O"
  @grid_value_ship_hit "*"

  defstruct [
    player_id: nil,
    ships: [],
    grid: %{},
    ready: false,
    hit_points: 0
  ]

  @doc """
  Creates a new board for a Player
  """
  def create(player_id) do
    Logger.debug "Starting board for player #{player_id}"

    grid = build_grid
    ships = Enum.map(@ships_sizes, &(%Ship{size: &1}))
    Agent.start(fn -> %__MODULE__{player_id: player_id, grid: grid, ships: ships} end, name: ref(player_id))
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
        new_board = board
        |> add_ship_to_grid(ship)
        |> set_is_ready
        |> set_hit_points

        Agent.update(ref(player_id), fn(_) -> new_board end)

        {:ok, new_board}
    end
  end

  @doc """
  Returns the board
  """
  def get_data(player_id) do
    Logger.debug "Getting board state for player #{player_id}"

    Agent.get(ref(player_id), &(&1))
  end

  @doc """
  Returns the board for an opponent player, replacing ship positions with
  water values.
  """
  def get_opponents_data(player_id) do
    Logger.debug "Getting opponents board state for player #{player_id}"

    board = Agent.get(ref(player_id), &(&1))

    new_grid = board
    |> Map.get(:grid)
    |> Enum.reduce(%{}, fn({coords, value}, acc) -> Map.put(acc, coords, opponent_grid_value(value)) end)

    %{board | ships: nil, grid: new_grid}
  end

  @doc """
  Takes a hit, checks the result and returns the board updated
  """
  def take_shot(player_id, x: x, y: y) do
    coords = Enum.join([y, x], "")

    result = player_id
      |> get_data
      |> Map.get(:grid)
      |> Map.get(coords)
      |> shot_result

    result
    |> add_result_to_board(player_id, coords)
    |> update_hit_points

    {:ok, result}
  end

  defp ref(player_id), do: {:global, {:board, player_id}}

  # Checks if a similar ship has been already placed
  defp ship_already_placed?(%__MODULE__{ships: ships}, %Ship{size: size}) do
    permited_amount = Enum.count(@ships_sizes, &(&1 == size))
    Enum.count(ships, &(&1.size == size and ship_placed?(&1))) == permited_amount
  end

  # Checks if the ship is inside the boards boundaries
  defp ship_with_invalid_bounds?(%Ship{orientation: orientation} = ship) when orientation == :horizontal do
    ship.x + ship.size > @size
  end
  defp ship_with_invalid_bounds?(%Ship{orientation: orientation} = ship) when orientation == :vertical do
    ship.y + ship.size > @size
  end

  # Checks is the ship is collapsing an exisiting one
  defp ship_with_invalid_coordinates?(board, ship) do
    ship
    |> Ship.coordinates
    |> Enum.map(&(board.grid[&1] == @grid_value_ship))
    |> Enum.any?(&(&1 == true))
  end

  # Adds a ship to the grid
  defp add_ship_to_grid(%__MODULE__{ships: ships} = board, ship) do
    coordinates = ship
      |> Ship.coordinates
      |> Enum.reduce(%{}, fn(coord, acc) -> Map.put(acc, coord, @grid_value_ship) end)

    ship_index = Enum.find_index(ships, &(&1.size == ship.size and !ship_placed?(&1)))
    ships = List.update_at(ships, ship_index, &(%{&1 | x: ship.x, y: ship.y, coordinates: coordinates}))

    grid = Map.merge board.grid, coordinates

    %{board | grid: grid, ships: ships}
  end

  # Builds a default grid map
  defp build_grid do
    0..@size - 1
    |> Enum.reduce([], &build_rows/2)
    |> List.flatten
    |> Enum.reduce(%{}, fn item, acc -> Map.put(acc, item, @grid_value_water) end)
  end

  defp build_rows(y, rows) do
    row = 0..@size - 1
      |> Enum.reduce(rows, fn x, col -> [Enum.join([y, x], "") | col] end)

    [row | rows]
  end

  defp shot_result(current_value) when current_value == @grid_value_ship, do: @grid_value_ship_hit
  defp shot_result(_current_value), do: @grid_value_water_hit

  defp add_result_to_board(result, player_id, coords) do
    Agent.update(ref(player_id), &(put_in(&1.grid[coords], result)))

    get_data(player_id)
  end

  defp update_hit_points(board) do
    hits = board.grid
    |> Map.values
    |> Enum.count(&(&1 == @grid_value_ship_hit))

    hit_points =  Enum.reduce(board.ships, 0, &(&1.size + &2)) - hits

    Agent.update(ref(board.player_id), fn(_) -> %{board | hit_points: hit_points} end)

    {:ok, get_data(board.player_id)}
  end

  defp set_is_ready(board), do: %{board | ready: Enum.all?(board.ships, &ship_placed?(&1))}

  defp set_hit_points(board), do: %{board | hit_points: Enum.reduce(board.ships, 0, &(&1.size + &2))}

  defp opponent_grid_value(@grid_value_ship), do: @grid_value_water
  defp opponent_grid_value(value), do: value

  defp ship_placed?(ship), do: length(Map.keys(ship.coordinates)) != 0
end
