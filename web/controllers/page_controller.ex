defmodule Battleship.PageController do
  use Battleship.Web, :controller

  @id_length Application.get_env(:battleship, :id_length)

  def index(conn, _params) do
    render conn, "index.html", id: player_id()
  end

  defp player_id, do: @id_length |> :crypto.strong_rand_bytes |> Base.encode64()
end
