defmodule Battleship.GameChannelTest do
  @moduledoc false
  use Battleship.ChannelCase, async: true
  alias Battleship.Game.Supervisor, as: GameSupervisor
  alias Battleship.{PlayerSocket, GameChannel, Player, Game}

  @player_id "player-1"
  @player_name "John"

  setup do
    game_id = GameSupervisor.generate_id

    {:ok, game} = GameSupervisor.create_game(game_id)
    {:ok, socket} = connect(PlayerSocket, %{"id" => @player_id, "name" => @player_name})

    {:ok, game_id: game_id, game: game, socket: socket}
  end

  test "joining an invalid game channel", %{socket: socket} do
    assert {:error, %{reason: "Game does not exist"}} = subscribe_and_join(socket, GameChannel, "game:invalid")
  end

  test "leaving the game channel kills the game", %{game_id: game_id, game: game, socket: socket} do
    game_ref = Process.monitor(game)

    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "game:" <> game_id)

    Process.unlink(socket.channel_pid)

    ref = leave(socket)
    assert_reply ref, :ok

    assert_receive {:DOWN, ^game_ref, :process, ^game, _}

    assert {:error, "Game does not exist"} = Game.join(game_id, %Player{id: @player_id, name: @player_name}, socket.channel_pid)
  end
end
