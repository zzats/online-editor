import ConnectedSwitch from 'containers/ConnectedSwitch'
import DocumentList from 'containers/DocumentList'
import DocumentView from 'containers/DocumentView'
import DummyLander from 'containers/DummyLander'
import Editor from 'containers/Editor'
import EditorToolbar from 'containers/EditorToolbar'
import MainToolbar from 'containers/MainToolbar'
import ViewToolbar from 'containers/ViewToolbar'
import * as React from 'react'
import { Route } from 'react-router-dom'

type Props = {
  error: {
    message: string | undefined,
    stack: string | undefined
  },
  clearError: () => any
}

export default (props: Props) => {
  const { error, clearError } = props
  return (
    <div className='ui main full height with padding'>
      <div className='ui fixed borderless grid menu'>
        <ConnectedSwitch>
          <Route path={'/edit/:documentId'} component={EditorToolbar} />
          <Route path={'/view/:documentId'} component={ViewToolbar} />
          <Route path='/folder/:folderId' component={MainToolbar} />
        </ConnectedSwitch>
      </div>
      <div className='ui padded equal full height grid'>
        {error.message &&
          <div className='ui row'>
            <div className='ui sixteen wide orange nag column'>
              <span className='title'>{error.message}</span>
              <i onClick={clearError} className='close icon'></i>
            </div>
          </div>
        }
        <div className='ui full height row content'>
          <section className='ui twelve wide computer sixteen wide tablet centered column without padding'>
            <ConnectedSwitch>
              <Route path='/view/:documentId' component={DocumentView} />
              <Route path='/edit/:documentId' component={Editor} />
              <Route path='/folder/:folderId' component={DocumentList} />
              <Route exact path='/' component={DummyLander} />
            </ConnectedSwitch>
          </section>
        </div>
      </div>
    </div >
  )
}
