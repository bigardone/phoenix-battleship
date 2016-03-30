defmodule Battleship.PageController do
  use Battleship.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
