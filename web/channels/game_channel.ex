defmodule Battleship.GameChannel do
  @moduledoc """
  Game channel
  """
  use Phoenix.Channel
  alias Battleship.{Game, Ship}
  alias Battleship.Game.Board
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
    player = socket.assigns.player
    game_id = socket.assigns.game_id

    data = Game.get_data(game_id, player.id)

    {:reply, {:ok, %{game: data}}, socket}
  end

  def handle_in("game:send_message", %{"text" => text}, socket) do
    Logger.debug "Handling send_message on GameChannel"

    player = socket.assigns.player
    game_id = socket.assigns.game_id

    {:ok, message} = Game.add_message(game_id, player.id, text)

    broadcast! socket, "game:message_sent", %{message: message}

    {:noreply, socket}
  end

  def handle_in("game:place_ship", %{"ship" => ship}, socket) do
    Logger.debug "Handling place_ship on GameChannel"

    player = socket.assigns.player
    game_id = socket.assigns.game_id

    ship = %Ship{x: ship["x"], y: ship["y"], size: ship["size"], orientation: String.to_atom(ship["orientation"])}
    Logger.debug "#{inspect ship}"

    case Board.add_ship(player.id, ship) do
      {:ok, _} ->
        data = Game.get_data(game_id, player.id)

        {:reply, {:ok, %{game: data}}, socket}
      {:error, reason} ->
        {:reply, {:error, %{reason: reason}}, socket}
    end
  end
end
