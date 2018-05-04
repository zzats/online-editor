import { getFolder } from 'actions/folder-actions'
import LoadingComponent from 'components/Loading'
import FolderItem from 'components/lists/FolderItem'
import wrapApiResource, { ApiResourceDispatch, mapGetResource, selectApiResource } from 'containers/ApiResourceHOC'
import ListItem, { ListItemProps } from 'containers/lists/ListItem'
import { RootState } from 'main/reducer'
import * as React from 'react'
import { Dispatch, connect } from 'react-redux'
import { ApiResource, ApiResourceId } from 'service/common'
import { Folder, isFolder } from 'service/folder-service'

type OwnProps = {
  resourceId: ApiResourceId
  selected: boolean,
  onSelect: (resource: Folder) => void,
  onClick: (resource: Folder) => void,
  onResourceNotFound: (id: ApiResourceId) => void
}

type MappedProps = {
  resourceId: ApiResourceId,
  resource: ApiResource<Folder>
  selected: boolean
}

type Props = ListItemProps<Folder> & OwnProps & ApiResourceDispatch & {
  resource: Folder
}
class ListItemFolder extends ListItem<Folder, Props> {
  render() {
    const { selected, resource, resourceId } = this.props
    return (
      <FolderItem
        resource={resource}
        resourceId={resourceId}
        selected={selected}
        onClick={this.handleOnClick}
        onSelect={this.handleOnSelect} />
    )
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps): MappedProps => {
  const { resourceId, selected } = ownProps
  return {
    ...selectApiResource<Folder>(state, 'folders', resourceId),
    selected
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootState>): ApiResourceDispatch => mapGetResource(dispatch, getFolder)

export default connect(mapStateToProps, mapDispatchToProps)(
  wrapApiResource<Folder, Props>(isFolder)(ListItemFolder, LoadingComponent))
