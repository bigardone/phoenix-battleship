defmodule Battleship.Game do
  @moduledoc """
  Game server
  """
  use GenServer
  alias Battleship.Player

  defstruct [
    id: nil,
    players: [],
    channels: [],
    rounds: []
  ]

  # API

  def start_link(id) do
    GenServer.start_link(__MODULE__, [id], name: ref(id))
  end

  def join(id, %Player{} = player, pid) do
    case GenServer.whereis(ref(id)) do
      nil ->
        {:error, "Game does not exist"}
      game ->
        GenServer.call(game, {:join, player, pid})
    end
  end

  # SERVER

  def init(id), do: {:ok, %Battleship.Game{id: id}}

  def handle_call({:join, player, pid}, _from, game) do
    cond do
      length(game.players) == 2 ->
        {:reply, {:error, "No more players allowed"}, game}
      Enum.member?(game.players, player) ->
        {:reply, {:error, "Player already joined"}, game}
      true ->
        Process.monitor(pid)
        game = %{game | players: [player | game.players], channels: [pid | game.channels]}

        {:reply, {:ok, self}, game}
    end
  end

  def handle_info({:DOWN, _ref, :process, _pid, _reason}, game) do
    {:stop, :normal, game}
  end

  @doc """
  Generates global reference
  """
  defp ref(id), do: {:global, {:game, id}}
end
