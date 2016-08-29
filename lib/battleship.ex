defmodule Battleship do
  use Application

  @id_length Application.get_env(:battleship, :id_length)
  @id_words Application.get_env(:battleship, :id_words)
  @id_number_max Application.get_env(:battleship, :id_number_max)

  @name_number_max Application.get_env(:battleship, :id_number_max)

  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      # Start the endpoint when the application starts
      supervisor(Battleship.Endpoint, []),
      # Here you could define other workers and supervisors as children
      # worker(Battleship.Worker, [arg1, arg2, arg3]),
      supervisor(Battleship.Game.Supervisor, []),
      worker(Battleship.Game.Event, [])
    ]

    # See http://elixir-lang.org/docs/stable/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Battleship.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    Battleship.Endpoint.config_change(changed, removed)
    :ok
  end

  @doc """
  Generates unique id for the game
  """
  def generate_player_id do
    @id_length
    |> :crypto.strong_rand_bytes
    |> Base.url_encode64()
    |> binary_part(0, @id_length)
  end

  @doc """
  Generates unique id for the game
  """
  def generate_game_id do
    Battleship.Pirate.generate_id(@id_words, @id_number_max)
  end
end
