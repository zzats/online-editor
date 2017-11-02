defmodule OnlineEditorWeb.DocumentControllerTest do
  use OnlineEditorWeb.ConnCase
  import OnlineEditor.Factory
  alias OnlineEditor.Document
  alias OnlineEditor.Repo
  alias OnlineEditorWeb.ErrorView

  @example_document %{
    content: "content",
    owner: "owner",
    name: "title"
  }

  @empty_document %{}

  @invalid_document %{
    name: 123
  }

  defp render_json(template, assigns) do
    assigns = Map.new(assigns)

    OnlineEditorWeb.DocumentView.render(template, assigns)
    |> Poison.encode!
    |> Poison.decode!
  end

  test "GET 200 - index path returns the list of all documents", %{conn: conn} do
    document = insert(:document)
    conn = get(conn, "/api/documents/")
    assert json_response(conn, 200) == render_json("index.json", documents: [document])
  end

  test "GET 200 - show path returns a single document", %{conn: conn} do
    document = insert(:document)
    conn = get(conn, "/api/documents/#{document.id}")
    assert json_response(conn, 200) == render_json("show.json", document: document)
  end

  test "GET 404 - show path returns a 404 not found document", %{conn: conn} do
    conn = get(conn, "/api/documents/1")
    assert json_response(conn, 404) == ErrorView.render("404.json")
  end

  test "POST 200 - create path allows creating documents", %{conn: conn} do
    conn = post(conn, "/api/documents", @example_document)
    document =  Repo.get_by(Document, @example_document)
    assert document
    assert json_response(conn, 200) == render_json("show.json", document: document)
  end

  test "POST 400 - does not accept invalid attrs", %{conn: conn} do
    conn = post(conn, "/api/documents", @empty_document)
    assert json_response(conn, 400) == ErrorView.render("400.json", error: "Unable to create document")
  end

  test "PUT 200 - update path allows updating documents", %{conn: conn} do
    document = insert(:document)
    conn = put(conn, "/api/documents/#{document.id}", %{content: "new content"})
    body = json_response(conn, 200)
    assert body["content"] == "new content"
  end

  test "PUT 404 - update path returns an error on missing user", %{conn: conn} do
    conn = put(conn, "/api/documents/1", @example_document)
    assert json_response(conn, 404) == ErrorView.render("404.json")
  end

  test "PUT 400 - update path returns an error on bad argumentsr", %{conn: conn} do
    document = insert(:document)
    conn = put(conn, "/api/documents/#{document.id}", @invalid_document)
    assert json_response(conn, 400) == ErrorView.render("400.json")
  end
end