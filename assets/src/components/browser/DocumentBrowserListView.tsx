import DocumentListView from 'components/lists/DocumentListItems'
import FolderListItems from 'components/lists/FolderListItems'

import {
  ApiResourceId,
  HasId,
  Map
} from 'library/service/common'
import * as React from 'react'
import {
  TextDocument,
  TextDocumentId
} from 'service/document-service'
import {
  Folder,
  FolderId
} from 'service/folder-service'

type Props = {
  documents: Array<ApiResourceId>,
  folder: Folder,
  selected: Map<HasId>,
  disabled: Map<HasId>,
  clickFolder: (resource: Folder) => void,
  clickDocument: (resource: TextDocument) => void,
  onResourceNotFound: (id: TextDocumentId) => void,
  selectResource: (resource: HasId) => void,
  getFolderById: (id: FolderId) => void
}

export default class DocumentBrowserListView extends React.Component<Props> {
  render() {
    const { documents,
      clickFolder,
      clickDocument,
      folder,
      selectResource,
      selected,
      disabled,
      onResourceNotFound
    } = this.props
    return (
      <div className='ui divided item list'>
        <FolderListItems
          folder={folder}
          selected={selected}
          disabled={disabled}
          clickFolder={clickFolder}
          onResourceNotFound={onResourceNotFound}
          selectResource={selectResource}
        />
        <DocumentListView
          documents={documents}
          selected={selected}
          clickDocument={clickDocument}
          onResourceNotFound={onResourceNotFound}
          selectResource={selectResource}
        />
      </div>
    )
  }
}
