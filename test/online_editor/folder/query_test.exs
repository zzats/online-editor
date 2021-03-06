defmodule OnlineEditorWeb.FolderQueryTest do
  use OnlineEditor.DataCase
  import OnlineEditor.Factory
  alias OnlineEditor.Folder
  alias OnlineEditor.Document
  alias OnlineEditor.Folder.Query
  @unloaded %Ecto.Association.NotLoaded{}
  @unloaded_parent %{
    @unloaded
    | __field__: :parent,
      __owner__: OnlineEditor.Folder,
      __cardinality__: :one
  }
  @unloaded_children %{
    @unloaded
    | __field__: :children,
      __owner__: OnlineEditor.Folder,
      __cardinality__: :many
  }
  @unloaded_folder %{
    @unloaded
    | __field__: :folder,
      __owner__: OnlineEditor.Document,
      __cardinality__: :one
  }
  @unloaded_documents %{
    @unloaded
    | __field__: :documents,
      __owner__: OnlineEditor.Folder,
      __cardinality__: :many
  }
  test "find_by_name returns a folder populated with children" do
    user = insert(:user)
    parent = user.root_folder

    child =
      insert(%Folder{
        name: "Child",
        parent: parent,
        deleted: false
      })

    child = %{
      child
      | parent: @unloaded_parent,
        children: @unloaded_children,
        documents: @unloaded_documents
    }

    actual = Query.get_by_name(user.id, "Root")

    expected = %{
      parent
      | parent: @unloaded_parent,
        children: [child],
        deleted: false,
        documents: []
    }

    assert expected == actual
  end

  test "deleting flags entries se deleted" do
    folder = insert(:folder)
    actual = Query.delete(folder.id)
    assert {:ok, %{deleted: true}} = actual
  end

  test "find_by_name returns a folder populated with documents" do
    user = insert(:user)
    folder = user.root_folder
    document =
      insert(%Document{
        name: "1",
        folder: folder,
        deleted: false,
        starred: false
      })

    actual_document = %{document | folder: @unloaded_folder}
    actual = Query.get_by_name(user.id, "Root")

    expected = %{
      folder
      | parent: @unloaded_parent,
        children: [],
        documents: [actual_document],
        deleted: false,
    }

    assert expected == actual
  end
end
