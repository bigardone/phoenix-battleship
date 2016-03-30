defmodule Battleship.GameTest do
  @moduledoc false
  use ExUnit.Case
  alias Battleship.Game.Supervisor, as: GameSupervisor
  alias Battleship.{Game, Player}

  @id "game-id"

  setup_all do
    {:ok, pid} = GameSupervisor.create_game(@id)

    {:ok, pid: pid}
  end

  test "joining a game which does not exist", %{pid: pid} do
    assert {:error, "Game does not exist"} = Game.join("wrong-id", %Player{id: 1}, self)
  end

  test "joining a game", %{pid: pid} do
    assert {:ok, ^pid} = Game.join(@id, %Player{id: 1}, self)
    assert {:error, "Player already joined"} = Game.join(@id, %Player{id: 1}, self)
    assert {:ok, ^pid} = Game.join(@id, %Player{id: 2}, self)
    assert {:error, "No more players allowed"} = Game.join(@id, %Player{id: 1}, self)
  end

  test "closes game when player goes down" do
    {:ok, pid} = GameSupervisor.create_game("new-game")
    ref = Process.monitor(pid)

    spawn fn ->
      Game.join("new-game", %Player{id: 1}, self)
    end

    assert_receive {:DOWN, ^ref,  :process, ^pid, :normal}
  end
end
