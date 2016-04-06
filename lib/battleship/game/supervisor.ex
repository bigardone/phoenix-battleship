defmodule Battleship.Game.Supervisor do
  @moduledoc """
  Game processes supervisor
  """
  use Supervisor
  alias Battleship.{Game, Player}

  @id_length Application.get_env(:battleship, :id_length)

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
  Generates unique id for the game
  """
  def generate_id do
    @id_length
    |> :crypto.strong_rand_bytes
    |> Base.url_encode64()
    |> binary_part(0, @id_length)
  end
end
