defmodule OnlineEditorWeb.AuthController do
  use OnlineEditorWeb, :controller
  alias OnlineEditor.User.Query

  plug(Ueberauth)

  alias OnlineEditorWeb.Models.AuthUser
  alias OnlineEditor.User
  alias OnlineEditor.Folder
  alias OnlineEditor.Repo
  alias OnlineEditor.Guardian

  plug(:scrub_params, "user" when action in [:sign_in_user])

  def delete(conn, _params) do
    # Sign out the user
    conn
    |> put_resp_cookie("guardian_default_token", "")
    |> redirect(to: "/")
  end

  def callback(%{assigns: %{ueberauth_failure: _fails}} = conn, _params) do
    # This callback is called when the user denies the app to get the data from the oauth provider
    conn
    |> put_status(401)
    |> render(OnlineEditorWeb.ErrorView, "401.json")
  end

  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    case AuthUser.basic_info(auth) do
      {:ok, user} ->
        sign_in_user(conn, %{"user" => user})
    end

    case AuthUser.basic_info(auth) do
      {:ok, user} ->
        conn
        |> render(OnlineEditorWeb.UserView, "show.json", %{user: user})

      {:error} ->
        conn
        |> put_status(401)
        |> render(OnlineEditorWeb.ErrorView, "401.json")
    end
  end

  def sign_in_user(conn, %{"user" => user}) do
    IO.puts("Signing in user: #{inspect(user)}")
    try do
      # Attempt to retrieve exactly one user from the DB, whose
      # email matches the one provided with the login request
      user = Query.get_by_email(user.email)

      cond do
        true ->
          # Successful login
          # Encode a JWT
          conn
          |> Guardian.Plug.remember_me(User.info(user))
          # Return token to the client
          |> redirect(to: "/")

        false ->
          # Unsuccessful login
          conn
          |> put_status(401)
          |> render(OnlineEditorWeb.ErrorView, "401.json")
      end
    rescue
      e ->
        # Print error to the console for debugging
        IO.inspect(e)
        # Successful registration
        sign_up_user(conn, %{"user" => user})
    end
  end

  def sign_up_user(conn, %{"user" => user}) do
    case Query.create_from_auth(user) do
      {:ok, user} ->
        # Encode a JWT
        conn
        |> Guardian.Plug.remember_me(User.info(user))
        # Return token to the client
        |> redirect(to: "/")
      {:error, changeset} ->
        conn
        |> put_status(422)
        |> render(OnlineEditorWeb.ErrorView, "422.json")
    end
  end

  def unauthenticated(conn, params) do
    conn
    |> put_status(401)
    |> render(OnlineEditorWeb.ErrorView, "401.json")
  end

  def unauthorized(conn, params) do
    IO.inspect(params)
    conn
    |> put_status(403)
    |> render(OnlineEditorWeb.ErrorView, "403.json")
  end

  def already_authenticated(conn, params) do
    conn
    |> put_status(200)
    |> render(OnlineEditorWeb.ErrorView, "200.json")
  end

  def no_resource(conn, params) do
    conn
    |> put_status(404)
    |> render(OnlineEditorWeb.ErrorView, "404.json")
  end
end
