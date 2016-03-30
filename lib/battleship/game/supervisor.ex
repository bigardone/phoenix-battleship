defmodule Battleship.Game.Supervisor do
  @moduledoc """
  Game processes supervisor
  """
  use Supervisor
  alias Battleship.{Game, Player}

  def start_link, do: Supervisor.start_link(__MODULE__, :ok, name: __MODULE__)

  def init(:ok) do
    children = [
      worker(Game, [], restart: :temporary)
    ]

    supervise(children, strategy: :simple_one_for_one)
  end

  def create_game(id) do
    Supervisor.start_child(__MODULE__, [id])
  end

  @doc """
  Generates unique id for the game
  """
  def generate_id, do: 32 |> :crypto.strong_rand_bytes |> Base.encode64()
end
