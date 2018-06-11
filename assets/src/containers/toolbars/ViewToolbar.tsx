import { getDocument } from 'actions/document-actions'
import DocumentToolbarView from 'components/toolbars/DocumentView'
import ToolbarLoadingView from 'components/toolbars/ToolbarLoadingView'
import createApiResourceWrapper, {
  mapGetResource,
  selectApiResource
} from 'library/containers/ApiResourceHOC'
import {
  ApiResource
} from 'library/service/common'
import * as React from 'react'
import {
  Dispatch,
  connect
} from 'react-redux'
import { push } from 'react-router-redux'
import {
  TextDocument,
  TextDocumentId,
  isDocument
} from 'service/document-service'

import { RootState, RouterProvidedProps } from 'main/store'

export type StateProps = {
  resourceId: TextDocumentId,
  resource: ApiResource<TextDocument>
}

type DispatchProps = {
  getResource: (id: TextDocumentId) => void,
  navigate: (route: string) => void
}

export type Props = StateProps & DispatchProps & {
  resource: TextDocument
}

class ViewToolbar extends React.Component<Props> {
  editDocument = () => {
    const { navigate, resourceId } = this.props
    navigate('/edit/' + resourceId)
  }

  refreshDocument = () => {
    const { resourceId, getResource } = this.props
    getResource(resourceId)
  }

  render() {
    const { resource } = this.props
    const commonProps = {
      editDocument: this.editDocument,
      refreshDocument: this.refreshDocument
    }
    return <DocumentToolbarView
      {...commonProps}
      title={resource.name}
    />
  }
}

const mapStateToProps = (state: RootState, ownProps: RouterProvidedProps) => {
  const resourceId: TextDocumentId = ownProps.match.params.documentId
  return selectApiResource<TextDocument>(state.model.documents, resourceId)
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    ...mapGetResource(dispatch, getDocument),
    navigate: (route: string) => dispatch(push(route))
  }
}
const wrappedResource = createApiResourceWrapper<TextDocument, Props>(isDocument)(ViewToolbar, ToolbarLoadingView)
export default connect(mapStateToProps, mapDispatchToProps)(wrappedResource)
