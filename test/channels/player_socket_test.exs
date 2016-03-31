defmodule Battleship.PlayerSocketTest do
  use Battleship.ChannelCase, async: true

  alias Battleship.{PlayerSocket, Player}

  @id "test-id"
  @name "John"

  setup do
    {:ok, socket} = connect(PlayerSocket, %{"id" => @id, "name" => @name})

    {:ok, socket: socket}
  end

  test "assigns player", %{socket: socket} do
    assert socket.assigns.player == %Player{id: @id, name: @name}
  end

  test "assigns id", %{socket: socket} do
    assert socket.id == "players_socket:#{@id}"
  end
end
