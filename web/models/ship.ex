defmodule Battleship.Ship do
  @moduledoc """
  Board ship
  """

  defstruct [
    x: 0,
    y: 0,
    size: 0,
    orientation: :vertical
  ]
end
