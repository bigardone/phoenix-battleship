defmodule Battleship.Game.EventHandler do
  use GenEvent
  alias Battleship.LobbyChannel

  def handle_event(:game_created, state), do: broadcast_update(state)
  def handle_event(:player_joined, state), do: broadcast_update(state)
  def handle_event(:game_over, state), do: broadcast_update(state)
  def handle_event(:player_shot, state), do: broadcast_update(state)

  def handle_event(_, state), do: {:ok, state}

  defp broadcast_update(state) do
    LobbyChannel.broadcast_current_games

    {:ok, state}
  end
end
