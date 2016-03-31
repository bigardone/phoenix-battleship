defmodule Battleship.Game.Board do
  @moduledoc """
  Game board
  """
  alias Battleship.{Ship}
  require Logger

  @ships_sizes [5, 4, 3, 3, 2]
  @size 10
  @orientations [:horizontal, :vertical]

  defstruct [
    player_id: nil,
    ships: [],
    shots: []
  ]

  @doc """
  Creates a new board for a Player
  """
  def create(player_id) do
    Logger.debug "Starting board for player #{player_id}"

    Agent.start(fn -> %__MODULE__{player_id: player_id} end, name: ref(player_id))
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
      length(board.ships) == length(@ships_sizes) ->
        {:error, "All ships are placed"}
      ship_already_placed?(board, ship) ->
        {:error, "Ship already added"}
      true ->
        Agent.update(ref(player_id), &(%{&1 | ships: [ship | &1.ships]}))

        {:ok, ship}
    end
  end

  defp ref(player_id), do: {:global, {:board, player_id}}

  @doc """
  Checks if a similar ship has been already placed
  """
  defp ship_already_placed?(%__MODULE__{ships: ships}, %Ship{size: size}) do
    permited_amount = Enum.count(@ships_sizes, &(&1 == size))
    Enum.count(ships, &(&1.size == size)) == permited_amount
  end
end
