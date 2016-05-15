defmodule Battleship.Game.Event do
  def start_link do
    {:ok, manager} = GenEvent.start_link(name: __MODULE__)

    handlers = [
      Battleship.Game.EventHandler
    ]

    Enum.each(handlers, &GenEvent.add_handler(manager, &1, []))

    {:ok, manager}
  end

  def game_created, do: GenEvent.notify(__MODULE__, :game_created)
  def player_joined, do: GenEvent.notify(__MODULE__, :player_joined)
  def game_over, do: GenEvent.notify(__MODULE__, :game_over)
  def game_stopped(game_id), do: GenEvent.notify(__MODULE__, {:game_stopped, game_id})
  def player_shot, do: GenEvent.notify(__MODULE__, :player_shot)
end
