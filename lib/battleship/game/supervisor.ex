defmodule Battleship.Game.Supervisor do
  @moduledoc """
  Game processes supervisor
  """
  require Logger

  use Supervisor
  alias Battleship.{Game}

  def start_link, do: Supervisor.start_link(__MODULE__, :ok, name: __MODULE__)

  def init(:ok) do
    children = [
      worker(Game, [], restart: :temporary)
    ]

    supervise(children, strategy: :simple_one_for_one)
  end

  @doc """
  Creates a new supervised Game process
  """
  def create_game(id), do: Supervisor.start_child(__MODULE__, [id])

  @doc """
  Returns a list of the current games
  """
  def current_games do
    __MODULE__
    |> Supervisor.which_children
    |> Enum.map(&game_data/1)
  end

  def stop_game(game_id) do
    Logger.debug "Stopping game #{game_id} in supervisor"

    pid = GenServer.whereis({:global, {:game, game_id}})

    Supervisor.terminate_child(__MODULE__, pid)
  end

  defp game_data({_id, pid, _type, _modules}) do
    pid
    |> GenServer.call(:get_data)
    |> Map.take([:id, :attacker, :defender, :turns, :over, :winner])
  end
end
