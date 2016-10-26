defmodule Battleship.Game do
  @moduledoc """
  Game server
  """
  use GenServer
  require Logger
  alias Battleship.Game.Board

  defstruct [
    id: nil,
    attacker: nil,
    defender: nil,
    turns: [],
    over: false,
    winner: nil
  ]

  # API

  def start_link(id) do
    GenServer.start_link(__MODULE__, id, name: ref(id))
  end

  def join(id, player_id, pid), do: try_call(id, {:join, player_id, pid})

  @doc """
  Returns the game's state
  """
  def get_data(id), do: try_call(id, :get_data)

  @doc """
  Returns the game's state for a given player. This means it will
  hide ships positions from the opponent's board.
  """
  def get_data(id, player_id), do: try_call(id, {:get_data, player_id})

  @doc """
  Adds new chat message to the game's state
  """
  def add_message(id, player_id, text), do: try_call(id, {:add_message, player_id, text})

  @doc """
  Fires a shot into the opponent's board for the given coordinates
  """
  def player_shot(id, player_id, x: x, y: y), do: try_call(id, {:player_shot, player_id, x: x, y: y})

  @doc """
  Called when a player leaves the game
  """
  def player_left(id, player_id), do: try_call(id, {:player_left, player_id})

  # SERVER

  def init(id) do
    Battleship.Game.Event.game_created

    {:ok, %__MODULE__{id: id}}
  end

  def handle_call({:join, player_id, pid}, _from, game) do
    Logger.debug "Handling :join for #{player_id} in Game #{game.id}"

    cond do
      game.attacker != nil and game.defender != nil ->
        {:reply, {:error, "No more players allowed"}, game}
      Enum.member?([game.attacker, game.defender], player_id) ->
        {:reply, {:ok, self}, game}
      true ->
        Process.flag(:trap_exit, true)
        Process.monitor(pid)

        {:ok, board_pid} = create_board(player_id)
        Process.monitor(board_pid)

        game = add_player(game, player_id)

        Battleship.Game.Event.player_joined

        {:reply, {:ok, self}, game}
    end
  end

  def handle_call(:get_data, _from, game), do: {:reply, game, game}
  def handle_call({:get_data, player_id}, _from, game) do
    Logger.debug "Handling :get_data for player #{player_id} in Game #{game.id}"

    game_data = Map.put(game, :my_board, Board.get_data(player_id))

    opponent_id = get_opponents_id(game, player_id)

    game_data =
      case opponent_id do
        nil -> game_data
        _   -> Map.put(game_data, :opponents_board, Board.get_opponents_data(opponent_id))
      end

    {:reply, game_data, game}
  end

  def handle_call({:player_shot, player_id, x: x, y: y}, _from, game) do
    Logger.debug "Handling :player_shot for #{player_id} in Game #{game.id}"

    opponent_id = get_opponents_id(game, player_id)

    {:ok, result} = Board.take_shot(opponent_id, x: x, y: y)

    game = game
    |> udpate_turns(player_id, x: x, y: y, result: result)
    |> check_for_winner

    Battleship.Game.Event.player_shot

    {:reply, {:ok, game}, game}
  end

  def handle_call({:player_left, player_id}, _from, game) do
    Logger.debug "Handling :player_left for #{player_id} in Game #{game.id}"

    game = %{game | over: true, winner: get_opponents_id(game, player_id)}

    {:reply, {:ok, game}, game}
  end

  def get_opponents_id(%__MODULE__{attacker: player_id, defender: nil}, player_id), do: nil
  def get_opponents_id(%__MODULE__{attacker: player_id, defender: defender}, player_id), do: defender
  def get_opponents_id(%__MODULE__{attacker: attacker, defender: player_id}, player_id), do: attacker

  @doc """
  Handles exit messages from linked game channels and boards processes
  stopping the game process.
  """
  def handle_info({:DOWN, _ref, :process, _pid, _reason} = message, game) do
    Logger.debug "Handling message in Game #{game.id}"
    Logger.debug "#{inspect message}"

    Battleship.Game.Event.game_stopped(game.id)

    {:stop, :normal, game}
  end

  # def handle_info({:EXIT, _pid, {:shutdown, :closed}}, game) do
  #   Logger.debug "Handling :EXIT message in Game server"
  #
  #   stop(game)
  # end

  def terminate(_reason, game) do
    Logger.debug "Terminating Game process #{game.id}"

    for player <- [game.attacker, game.defender], do: destroy_board(player)

    Battleship.Game.Event.game_over

    :ok
  end

  # Creates a new Board for a given Player
  defp create_board(player_id), do: Board.create(player_id)

  # Generates global reference
  defp ref(id), do: {:global, {:game, id}}

  defp add_player(%__MODULE__{attacker: nil} = game, player_id), do: %{game | attacker: player_id}
  defp add_player(%__MODULE__{defender: nil} = game, player_id), do: %{game | defender: player_id}

  defp destroy_board(nil), do: :ok
  defp destroy_board(player_id), do: Board.destroy(player_id)

  defp udpate_turns(game, player_id, x: x, y: y, result: result) do
    %{game | turns: [%{player_id: player_id, x: x, y: y, result: result} | game.turns]}
  end

  defp check_for_winner(game) do
    attacker_board = Board.get_data(game.attacker)
    defender_board = Board.get_data(game.defender)

    cond do
      attacker_board.hit_points == 0 ->
        %{game | winner: game.defender, over: true}
      defender_board.hit_points == 0 ->
        %{game | winner: game.attacker, over: true}
      true ->
        game
    end
  end

  defp try_call(id, message) do
    case GenServer.whereis(ref(id)) do
      nil ->
        {:error, "Game does not exist"}
      game ->
        GenServer.call(game, message)
    end
  end
end
