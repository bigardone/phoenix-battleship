defmodule Battleship.PlayerSocketTest do
  use Battleship.ChannelCase, async: true

  alias Battleship.{PlayerSocket}

  @id Battleship.generate_id

  setup do
    {:ok, socket} = connect(PlayerSocket, %{"id" => @id})

    {:ok, socket: socket}
  end

  test "assigns player", %{socket: socket} do
    assert socket.assigns.player_id == @id
  end

  test "assigns id", %{socket: socket} do
    assert socket.id == "players_socket:#{@id}"
  end
end
