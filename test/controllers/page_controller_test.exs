defmodule Battleship.PageControllerTest do
  use Battleship.ConnCase

  test "GET /", %{conn: conn} do
    conn = get conn, "/"
    assert html_response(conn, 200) =~ "Battleship"
  end
end
