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

    player_id = socket.assigns.player_id

    case Game.join(game_id, player_id, socket.channel_pid) do
      {:ok, pid} ->
        Process.link(pid)

        {:ok, assign(socket, :game_id, game_id)}
      {:error, reason} ->
        {:error, %{reason: reason}}
    end
  end

  def handle_in("game:joined", _message, socket) do
    Logger.debug "Broadcasting player joined"
    player_id = socket.assigns.player_id
    board = Board.get_opponents_data(player_id)

    broadcast! socket, "game:player_joined", %{player_id: player_id, board: board}
    {:noreply, socket}
  end

  def handle_in("game:get_data", _message, socket) do
    player_id = socket.assigns.player_id
    game_id = socket.assigns.game_id

    data = Game.get_data(game_id, player_id)

    {:reply, {:ok, %{game: data}}, socket}
  end

  def handle_in("game:send_message", %{"text" => text}, socket) do
    Logger.debug "Handling send_message on GameChannel"

    player_id = socket.assigns.player_id
    message = %{player_id: player_id, text: text}

    broadcast! socket, "game:message_sent", %{message: message}

    {:noreply, socket}
  end

  def handle_in("game:place_ship", %{"ship" => ship}, socket) do
    Logger.debug "Handling place_ship on GameChannel"

    player_id = socket.assigns.player_id
    game_id = socket.assigns.game_id

    ship = %Ship{
      x: ship["x"],
      y: ship["y"],
      size: ship["size"],
      orientation: String.to_atom(ship["orientation"])
    }

    Logger.debug "#{inspect ship}"

    case Board.add_ship(player_id, ship) do
      {:ok, _} ->
        game = Game.get_data(game_id, player_id)
        board = Board.get_opponents_data(player_id)

        broadcast(socket, "game:player:#{Game.get_opponents_id(game, player_id)}:opponents_board_changed", %{board: board})

        {:reply, {:ok, %{game: game}}, socket}
      {:error, reason} ->
        {:reply, {:error, %{reason: reason}}, socket}
    end
  end

  def handle_in("game:shoot", %{"y" => y, "x" => x}, socket) do
    Logger.debug "Handling shoot on GameChannel"

    player_id = socket.assigns.player_id
    game_id = socket.assigns.game_id

    {:ok, game} = Game.player_shot(game_id, player_id, x: x, y: y)
    opponent_id = Game.get_opponents_id(game, player_id)

    broadcast(socket, "game:player:#{opponent_id}:set_game", %{game: Game.get_data(game_id, opponent_id)})

    {:reply, {:ok, %{game: Game.get_data(game_id, player_id)}}, socket}
  end

  def terminate(reason, socket) do
    Logger.debug"Terminating GameChannel #{inspect reason}"

    broadcast(socket, "game:opponent_left", %{game_id: socket.assigns.game_id})

    :ok
  end
end
