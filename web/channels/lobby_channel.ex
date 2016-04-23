defmodule Battleship.LobbyChannel do
  @moduledoc """
  Lobby channel
  """

  use Battleship.Web, :channel
  alias Battleship.Game.Supervisor, as: GameSupervisor

  def join("lobby", _msg, socket) do
    {:ok, %{games: GameSupervisor.current_games}, socket}
  end

  def handle_in("current_games", _params, socket) do
    {:reply, {:ok, %{games: GameSupervisor.current_games}}, socket}
  end

  def handle_in("new_game", _params, socket) do
    game_id = Battleship.generate_id
    GameSupervisor.create_game(game_id)

    {:reply, {:ok, %{game_id: game_id}}, socket}
  end

  def broadcast_current_games do
    Battleship.Endpoint.broadcast("lobby", "update_games", %{games: GameSupervisor.current_games})
  end
end
