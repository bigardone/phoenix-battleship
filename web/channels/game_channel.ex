defmodule Battleship.GameChannel do
  @moduledoc """
  Game channel
  """
  use Phoenix.Channel
  alias Battleship.{Player, Game}
  require Logger

  def join("game:" <> game_id, _message, socket) do
    Logger.debug "Joining Game channel", game_id: game_id

    case Game.join(game_id, socket.assigns.player, socket.channel_pid) do
      {:ok, pid} ->
        # Process.link(pid)

        {:ok, assign(socket, :game_id, game_id)}
      {:error, reason} ->
        {:error, %{reason: reason}}
    end
  end

  def handle_in("game:get_data", _message, socket) do
    %Player{id: player_id} = socket.assigns.player
    game_id = socket.assigns.game_id

    data = Game.get_data(game_id, player_id)

    {:reply, {:ok, %{game: data}}, socket}
  end
end
