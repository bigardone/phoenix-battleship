# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the endpoint
config :battleship, Battleship.Endpoint,
  namespace: Battleship,
  url: [host: "localhost"],
  root: Path.dirname(__DIR__),
  secret_key_base: "9vBUPPF+U6OIacuWP6B8OalXx+dXsWmE+GrSP0mO4WEVyUp1Q8QS/RNAOkrM3YTu",
  render_errors: [accepts: ~w(html json)],
  pubsub: [name: Battleship.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :battleship,
  ga_tracking_code: "",
  id_length: 8,       # Number of bytes for generic unique id
  id_words: 2,        # Number of words used in game ids "ahoy-matey"
  id_number_max: 9999 # Maximal number >= 100 after the words "ahoey-matey-9999".

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
