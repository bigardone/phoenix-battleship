defmodule Battleship.Game do
  @moduledoc """
  Game server
  """
  use GenServer
  alias Battleship.Player
  alias Battleship.Game.Board

  defstruct [
    id: nil,
    attacker: nil,
    defender: nil,
    channels: [],
    rounds: [],
    over: false
  ]

  # API

  def start_link(id) do
    GenServer.start_link(__MODULE__, [id], name: ref(id))
  end

  def join(id, %Player{} = player, pid), do: try_call(id, {:join, player, pid})

  def get_data(id), do: try_call(id, :get_data)

  # SERVER

  def init(id), do: {:ok, %__MODULE__{id: id}}

  def handle_call({:join, player, pid}, _from, game) do
    cond do
      game.attacker != nil and game.defender != nil ->
        {:reply, {:error, "No more players allowed"}, game}
      Enum.member?([game.attacker, game.defender], player) ->
        {:reply, {:error, "Player already joined"}, game}
      true ->
        Process.monitor(pid)
        create_board(player)

        game = game
        |> add_player(player)
        |> add_channel(pid)

        {:reply, {:ok, self}, game}
    end
  end

  def handle_call(:get_data, _from, game), do: {:reply, %{game | channels: nil}, game}

  # def handle_info({:DOWN, _ref, :process, _pid, _reason}, game) do
  #   for player <- [game.attacker, game.defender], do: destroy_board(player)
  #
  #   {:stop, :normal, game}
  # end

  @doc """
  Creates a new Board for a given Player
  """
  defp create_board(%Player{id: id}), do: Board.create(id)

  @doc """
  Generates global reference
  """
  defp ref(id), do: {:global, {:game, id}}

  defp add_player(%__MODULE__{attacker: nil} = game, player), do: %{game | attacker: player}
  defp add_player(%__MODULE__{defender: nil} = game, player), do: %{game | defender: player}

  defp add_channel(game, pid), do: %{game | channels: [pid | game.channels]}

  defp destroy_board(nil), do: :ok
  defp destroy_board(player), do: Board.destroy(player.id)

  defp try_call(id, message) do
    case GenServer.whereis(ref(id)) do
      nil ->
        {:error, "Game does not exist"}
      game ->
        GenServer.call(game, message)
    end
  end
end
