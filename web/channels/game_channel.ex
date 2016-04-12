defmodule Battleship.GameChannel do
  @moduledoc """
  Game channel
  """
  use Phoenix.Channel
  alias Battleship.{Game, Ship, Player}
  alias Battleship.Game.Board
  require Logger

  def join("game:" <> game_id, _message, socket) do
    Logger.debug "Joining Game channel", game_id: game_id

    player = socket.assigns.player

    case Game.join(game_id, player, socket.channel_pid) do
      {:ok, pid} ->
        # Process.link(pid)

        {:ok, assign(socket, :game_id, game_id)}
      {:error, reason} ->
        {:error, %{reason: reason}}
    end
  end

  def handle_in("game:joined", _message, socket) do
    Logger.debug "Broadcasting player joined"
    player = socket.assigns.player
    board = Board.get_opponents_data(player.id)

    broadcast! socket, "game:player_joined", %{player: player, board: board}
    {:noreply, socket}
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

    ship = %Ship{
      x: ship["x"],
      y: ship["y"],
      size: ship["size"],
      orientation: String.to_atom(ship["orientation"])
    }

    Logger.debug "#{inspect ship}"

    case Board.add_ship(player.id, ship) do
      {:ok, _} ->
        game = Game.get_data(game_id, player.id)
        board = Board.get_opponents_data(player.id)

        broadcast(socket, "game:player:#{Game.get_opponents_id(game, player.id)}:opponents_board_changed", %{board: board})

        {:reply, {:ok, %{game: game}}, socket}
      {:error, reason} ->
        {:reply, {:error, %{reason: reason}}, socket}
    end
  end

  def handle_in("game:shoot", %{"y" => y, "x" => x}, socket) do
    Logger.debug "Handling shoot on GameChannel"

    player = socket.assigns.player
    game_id = socket.assigns.game_id
    {:ok, game} = Game.player_shot(game_id, player.id, x: x, y: y)
    opponent_id = Game.get_opponents_id(game, player.id)

    broadcast(socket, "game:player:#{opponent_id}:set_game", %{game: Game.get_data(game_id, opponent_id)})

    {:reply, {:ok, %{game: Game.get_data(game_id, player.id)}}, socket}
  end
end
