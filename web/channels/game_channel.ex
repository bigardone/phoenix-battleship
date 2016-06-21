defmodule Battleship.GameChannel do
  @moduledoc """
  Game channel
  """
  use Phoenix.Channel
  alias Battleship.{Game, Ship}
  alias Battleship.Game.Board
  alias Battleship.Game.Supervisor, as: GameSupervisor
  require Logger

  def join("game:" <> game_id, _message, socket) do
    Logger.debug "Joining Game channel #{game_id}", game_id: game_id

    player_id = socket.assigns.player_id

    case Game.join(game_id, player_id, socket.channel_pid) do
      {:ok, pid} ->
        Process.monitor(pid)

        {:ok, assign(socket, :game_id, game_id)}
      {:error, reason} ->
        {:error, %{reason: reason}}
    end
  end

  def handle_in("game:joined", _message, socket) do
    Logger.debug "Broadcasting player joined #{socket.assigns.game_id}"

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
    Logger.debug "Handling send_message on GameChannel #{socket.assigns.game_id}"

    player_id = socket.assigns.player_id
    message = %{player_id: player_id, text: text}

    broadcast! socket, "game:message_sent", %{message: message}

    {:noreply, socket}
  end

  def handle_in("game:place_ship", %{"ship" => ship}, socket) do
    Logger.debug "Handling place_ship on GameChannel #{socket.assigns.game_id}"

    player_id = socket.assigns.player_id
    game_id = socket.assigns.game_id

    ship = %Ship{
      x: ship["x"],
      y: ship["y"],
      size: ship["size"],
      orientation: String.to_atom(ship["orientation"])
    }

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
    Logger.debug "Handling shoot on GameChannel #{socket.assigns.game_id}"

    player_id = socket.assigns.player_id
    game_id = socket.assigns.game_id

    game = Game.get_data(game_id)
    opponent_id = Game.get_opponents_id(game, player_id)

    case Game.player_shot(game_id, player_id, x: x, y: y) do
      {:ok, %Game{over: true} = game} ->
        broadcast(socket, "game:over", %{game: game})
        {:noreply, socket}
      {:ok, _game} ->
        broadcast(socket, "game:player:#{opponent_id}:set_game", %{game: Game.get_data(game_id, opponent_id)})
        {:reply, {:ok, %{game: Game.get_data(game_id, player_id)}}, socket}
      _ ->
        {:error, {:error, %{reason: "Something went wrong while shooting"}}, socket}
    end
  end

  def terminate(reason, socket) do
    Logger.debug"Terminating GameChannel #{socket.assigns.game_id} #{inspect reason}"

    player_id = socket.assigns.player_id
    game_id = socket.assigns.game_id

    case Game.player_left(game_id, player_id) do
      {:ok, game} ->

        GameSupervisor.stop_game(game_id)

        broadcast(socket, "game:over", %{game: game})
        broadcast(socket, "game:player_left", %{player_id: player_id})

        :ok
      _ ->
        :ok
    end
  end

  def handle_info(_, socket), do: {:noreply, socket}

  def broadcast_stop(game_id) do
    Logger.debug "Broadcasting game:stopped from GameChannel #{game_id}"

    Battleship.Endpoint.broadcast("game:#{game_id}", "game:stopped", %{})
  end
end
