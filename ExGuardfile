use ExGuard.Config

guard("unit-test")
|> command("mix test --color")
|> watch(~r{\.(erl|ex|exs|eex|xrl|yrl)\z}i)
|> ignore(~r/priv/)
