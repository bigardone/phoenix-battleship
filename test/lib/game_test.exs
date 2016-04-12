defmodule Battleship.GameTest do
  @moduledoc false
  use ExUnit.Case, async: true
  alias Battleship.Game.Supervisor, as: GameSupervisor
  alias Battleship.Game.Board
  alias Battleship.{Game, Player, Ship}

  @id 4 |> :crypto.strong_rand_bytes |> Base.encode64()

  setup_all do
    {:ok, pid} = GameSupervisor.create_game(@id)

    {:ok, pid: pid}
  end

  test "joining a game which does not exist" do
    assert {:error, "Game does not exist"} = Game.join("wrong-id", %Player{id: 1}, self)
  end

  test "joining a game", %{pid: pid} do
    assert {:ok, ^pid} = Game.join(@id, %Player{id: 1}, self)
    assert {:ok, ^pid} = Game.join(@id, %Player{id: 1}, self)
    assert {:ok, ^pid} = Game.join(@id, %Player{id: 2}, self)
    assert {:error, "No more players allowed"} = Game.join(@id, %Player{id: 1}, self)

    game = Game.get_data(@id)
    assert %Player{id: 1} = game.attacker
    assert %Player{id: 2} = game.defender

    assert %Board{player_id: 1} = Agent.get({:global, {:board, 1}}, &(&1))
    assert %Board{player_id: 2} = Agent.get({:global, {:board, 2}}, &(&1))
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

  test "updates rounds after a shot" do
    valid_ships = [
      %Ship{x: 0, y: 0, size: 5, orientation: :vertical},
      %Ship{x: 1, y: 0, size: 4, orientation: :vertical},
      %Ship{x: 2, y: 0, size: 3, orientation: :vertical},
      %Ship{x: 3, y: 0, size: 2, orientation: :vertical},
      %Ship{x: 4, y: 0, size: 1, orientation: :vertical}
    ]

    Game.join(@id, %Player{id: 1}, self)
    Game.join(@id, %Player{id: 2}, self)

    valid_ships
    |> Enum.each(fn ship ->
      Board.add_ship(1, ship)
      Board.add_ship(2, ship)
    end)

    {:ok, game} = Game.player_shot(@id, 1, x: 0, y: 0)

    assert [%{player_id: 1, x: 0, y: 0}] = game.rounds
  end
end
