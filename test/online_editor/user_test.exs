defmodule OnlineEditor.UserTest do
  use OnlineEditor.DataCase
  import OnlineEditor.Factory
  alias OnlineEditor.User

  @valid_attrs %{auth_provider: "some auth_provider", avatar: "some avatar", email: "some email", first_name: "some first_name", last_name: "some last_name"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    root = insert(:folder)
    changeset = User.changeset(%User{}, Map.put(@valid_attrs, :root_folder, root))
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = User.changeset(%User{}, @invalid_attrs)
    refute changeset.valid?
  end
end
