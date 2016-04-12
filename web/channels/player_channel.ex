defmodule Battleship.PlayerChannel do
  @moduledoc """
  Player channel
  """
  use Battleship.Web, :channel
  alias Battleship.Game.Supervisor, as: GameSupervisor

  def join("player:" <> player_id, _params, socket) do
    player = socket.assigns.player_id

    if player == player_id do
      {:ok, socket}
    else
      {:error, %{reason: "Invalid player"}}
    end
  end

  def handle_in("game:new", _params, socket) do
    game_id = GameSupervisor.generate_id

    GameSupervisor.create_game(game_id)

    {:reply, {:ok, %{game_id: game_id}}, socket}
  end
end
