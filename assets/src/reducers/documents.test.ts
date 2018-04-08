import {
  ACTION_CREATE_DOCUMENT,
  ACTION_GET_DOCUMENT,
  ACTION_GET_DOCUMENTS
} from 'actions/document-actions'
import { Action } from 'redux'
import { TextDocument } from 'service/document-service'
import actionCreatorFactory from 'typescript-fsa'

import documentReducer, {
  DocumentReducerState,
  initialState
} from './documents'

const actionFactory = actionCreatorFactory()
const document: TextDocument = {
  id: 'foo',
  name: 'example',
  owner: 'barguy',
  content: 'example document',
  inserted_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

const other: TextDocument = {
  id: 'bar',
  name: 'example2',
  owner: 'barguy',
  content: 'example document 2',
  inserted_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

const modifiedDocument: TextDocument = {
  ...document,
  content: 'modified content'
}

const newDocument: TextDocument = {
  id: 'newId',
  name: '',
  owner: 'barguy',
  content: '',
  inserted_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

const createDocument = actionFactory.async<{}, TextDocument>(ACTION_CREATE_DOCUMENT)
const getDocuments = actionFactory.async<{}, TextDocument>(ACTION_GET_DOCUMENTS)
const getDocument = actionFactory.async<{}, TextDocument>(ACTION_GET_DOCUMENT)

describe('Document reducer', () => {
  it('should return the state as-is if action is not recognized', () => {
    expect(documentReducer(initialState, {
      type: 'NOP'
    })).toEqual(initialState)
  })

  it('should save the crated document to the state', () => {
    const action = createDocument.done({ params: {}, result: newDocument })
    const modifiedState = documentReducer(initialState, action)
    expect(modifiedState.all).toEqual([newDocument])
    expect(modifiedState.byId[newDocument.id]).toEqual(newDocument)
  })
})
