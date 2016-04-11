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

  def coordinates(%__MODULE__{x: x, y: y, size: size, orientation: orientation}) when orientation == :vertical do
    y..y + (size - 1)
    |> Enum.map(&coordinate_key(&1, x))
  end

  def coordinates(%__MODULE__{x: x, y: y, size: size, orientation: orientation}) when orientation == :horizontal do
    x..x + (size - 1)
    |> Enum.map(&coordinate_key(y, &1))
  end

  defp coordinate_key(y, x), do: Enum.join([y, x], "")
end
