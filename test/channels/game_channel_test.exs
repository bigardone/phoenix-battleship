defmodule Battleship.GameChannelTest do
  @moduledoc false
  use Battleship.ChannelCase, async: true
  alias Battleship.Game.Supervisor, as: GameSupervisor
  alias Battleship.{PlayerSocket, GameChannel, Game}

  @player_id Battleship.generate_id

  setup do
    game_id = Battleship.generate_id

    {:ok, game} = GameSupervisor.create_game(game_id)
    {:ok, socket} = connect(PlayerSocket, %{"id" => @player_id})

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

    assert {:error, "Game does not exist"} = Game.join(game_id, @player_id, socket.channel_pid)
  end
end
