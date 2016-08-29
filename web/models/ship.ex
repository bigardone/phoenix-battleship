defmodule Battleship.Ship do
  @moduledoc """
  Board ship
  """

  defstruct [
    x: 0,
    y: 0,
    size: 0,
    orientation: :vertical,
    coordinates: %{}
  ]

  def coordinates(%{x: x, y: y, size: size, orientation: :vertical}) do
    Enum.map(y..(y + (size - 1)), &coordinate_key(&1, x))
  end
  def coordinates(%{x: x, y: y, size: size, orientation: :horizontal}) do
    Enum.map((x..x + (size - 1)), &coordinate_key(y, &1))
  end

  defp coordinate_key(y, x), do: Enum.join([y, x], "")
end
