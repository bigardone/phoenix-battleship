defmodule Battleship.GameTest do
  @moduledoc false
  use ExUnit.Case, async: true
  alias Battleship.Game.Supervisor, as: GameSupervisor
  alias Battleship.Game.Board
  alias Battleship.{Game, Player}

  @id "game-id"

  setup_all do
    {:ok, pid} = GameSupervisor.create_game(@id)

    {:ok, pid: pid}
  end

  test "joining a game which does not exist" do
    assert {:error, "Game does not exist"} = Game.join("wrong-id", %Player{id: 1}, self)
  end

  test "joining a game", %{pid: pid} do
    assert {:ok, ^pid} = Game.join(@id, %Player{id: 1}, self)
    assert {:error, "Player already joined"} = Game.join(@id, %Player{id: 1}, self)
    assert {:ok, ^pid} = Game.join(@id, %Player{id: 2}, self)
    assert {:error, "No more players allowed"} = Game.join(@id, %Player{id: 1}, self)

    assert Agent.get({:global, {:board, 1}}, &(&1)) == Agent.get({:global, {:board, 1}}, &(&1))
    assert Agent.get({:global, {:board, 2}}, &(&1)) == Agent.get({:global, {:board, 2}}, &(&1))
  end

  test "closes game when player goes down" do
    {:ok, pid} = GameSupervisor.create_game("new-game")

    ref = Process.monitor(pid)

    spawn fn ->
      Game.join("new-game", %Player{id: 2}, self)
    end

    assert catch_exit(Agent.get({:global, {:board, 1}}, &(&1)))
    assert_receive {:DOWN, ^ref,  :process, ^pid, :normal}
  end
end
