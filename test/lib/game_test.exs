defmodule Battleship.GameTest do
  @moduledoc false
  use ExUnit.Case, async: true
  alias Battleship.Game.Supervisor, as: GameSupervisor
  alias Battleship.Game.Board
  alias Battleship.{Game, Ship}

  setup do
    id =  Battleship.generate_game_id
    attacker_id = Battleship.generate_player_id
    defender_id = Battleship.generate_player_id

    {:ok, id: id, attacker_id: attacker_id, defender_id: defender_id}
  end

  test "joining a game which does not exist" do
    assert {:error, "Game does not exist"} = Game.join("wrong-id", 1, self)
  end

  test "joining a game", %{id: id, attacker_id: attacker_id, defender_id: defender_id} do
    {:ok, pid} = GameSupervisor.create_game(id)

    assert {:ok, ^pid} = Game.join(id, attacker_id, self)
    assert {:ok, ^pid} = Game.join(id, attacker_id, self)
    assert {:ok, ^pid} = Game.join(id, defender_id, self)
    assert {:error, "No more players allowed"} = Game.join(id, attacker_id, self)

    game = Game.get_data(id)
    assert ^attacker_id = game.attacker
    assert ^defender_id = game.defender

    assert %Board{player_id: ^attacker_id} = Agent.get({:global, {:board, attacker_id}}, &(&1))
    assert %Board{player_id: ^defender_id} = Agent.get({:global, {:board, defender_id}}, &(&1))
  end

  test "terminates game when player goes down", %{attacker_id: attacker_id} do
    {:ok, pid} = GameSupervisor.create_game("new-game")
    ref = Process.monitor(pid)

    spawn fn ->
      Game.join("new-game", attacker_id, self)
    end

    assert catch_exit(Agent.get({:global, {:board, attacker_id}}, &(&1)))
    assert_receive {:DOWN, ^ref,  :process, ^pid, :normal}
  end

  test "terminates game when a board goes down", %{attacker_id: attacker_id} do
    {:ok, pid} = GameSupervisor.create_game("new-game")
    Process.monitor(pid)
    Game.join("new-game", attacker_id, self)

    {:global, {:board, attacker_id}}
    |> GenServer.whereis
    |> Process.exit(:kill)

    assert_receive {:DOWN, _ref, :process, pid, :normal}
  end

  test "updates turns after a shot", %{id: id, attacker_id: attacker_id, defender_id: defender_id} do
    GameSupervisor.create_game(id)

    valid_ships = [
      %Ship{x: 0, y: 0, size: 5, orientation: :vertical},
      %Ship{x: 1, y: 0, size: 4, orientation: :vertical},
      %Ship{x: 2, y: 0, size: 3, orientation: :vertical},
      %Ship{x: 3, y: 0, size: 2, orientation: :vertical},
      %Ship{x: 4, y: 0, size: 2, orientation: :vertical},
      %Ship{x: 5, y: 0, size: 1, orientation: :vertical},
      %Ship{x: 6, y: 0, size: 1, orientation: :vertical}
    ]

    Game.join(id, attacker_id, self)
    Game.join(id, defender_id, self)

    valid_ships
    |> Enum.each(fn ship ->
      Board.add_ship(attacker_id, ship)
      Board.add_ship(defender_id, ship)
    end)

    {:ok, game} = Game.player_shot(id, attacker_id, x: 0, y: 0)

    assert [%{player_id: ^attacker_id, x: 0, y: 0}] = game.turns
  end
end
