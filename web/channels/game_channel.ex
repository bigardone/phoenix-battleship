defmodule Battleship.GameChannel do
  use Phoenix.Channel

  def join("game:" <> game_id, _message, socket) do

  end
end
