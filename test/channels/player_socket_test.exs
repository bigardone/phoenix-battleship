defmodule Battleship.PlayerSocketTest do
  use Battleship.ChannelCase, async: true

  alias Battleship.{PlayerSocket}

  @id 4 |> :crypto.strong_rand_bytes |> Base.encode64()
  @name "John"

  setup do
    {:ok, socket} = connect(PlayerSocket, %{"id" => @id, "name" => @name})

    {:ok, socket: socket}
  end

  test "assigns player", %{socket: socket} do
    assert socket.assigns.player_id == @id
  end

  test "assigns id", %{socket: socket} do
    assert socket.id == "players_socket:#{@id}"
  end
end
