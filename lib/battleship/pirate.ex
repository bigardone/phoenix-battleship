defmodule Battleship.Pirate do
  @moduledoc """
  Pirate stuff
  """

  @pirate_words [
    "ahoy",
    "matey",

    # Source: https://github.com/mikewesthad/pirate-speak/blob/master/lib/pirate-speak.js
    "helm",
    "grog",
    "vast",
    "coin",
    "coins",
    "admiral",
    "rum",
    "barrel",
    "lad",
    "mate",
    "parrot",
    "hornswaggle",
    "hails",
    "shipshape",
    "shanty",
    "keelhaul",
    "doubloon",
    "crew",
    "eyepatch",
    "debt",
    "wench",
    "wenches",
    "grub",
    "shipmate",
    "sail",
    "maties",
    "bluderbuss",
    "hook",
    "yoho",
    "yohoho",
    "yohohoho",
    "fleebag",
    "sunk",
    "isle",
    "brig",
    "lasses",
    "lass",
    "blimey",
    "parchment",
    "scallywags",
    "starboard",
    "cargo",
    "yarr",
    "puny",
    "swoggler",
    "booty",
    "beauties",
    "duty",
    "aye",
    "ye",
    "yer",

    # Source: https://gist.github.com/devlaers/1308006#file-pirate_phrases-txt
    "yo-ho-ho",
    "ahoy",
    "avast",
    "arrr",
    "blaggart",
    "foul",
    "whar",
    "comely",
    "broadside",
    "fleabag",
    "skull",
    "scuppers",
    "buried",
    "treasure",
  ]

  @doc """
  Generates a id like "ahoy-matey-4523"
  """
  def generate_id(amount_words, number_max) when amount_words >= 1 and number_max >= 100 do
    words = @pirate_words |> Enum.shuffle |> Enum.take(amount_words)
    [random_number] = Enum.take_random(100..number_max, 1)
    Enum.join(words, "-") <> "-" <> to_string(random_number)
  end

end
