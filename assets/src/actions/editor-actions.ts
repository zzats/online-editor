import { getFolder } from 'actions/folder-actions'
import { ByResourceParams } from 'library/service/common'
import { push } from 'react-router-redux'
import { PartialTextDocument, TextDocument, TextDocumentId, create, deleteByDocument } from 'service/document-service'
import { Folder, PartialFolder } from 'service/folder-service'
import actionCreatorFactory from 'typescript-fsa'
import { bindThunkAction } from 'typescript-fsa-redux-thunk'

import {
  createDocumentAction,
  deleteDocumentAction
} from './document-actions'
import {
  createFolder, createFolderAction
} from './folder-actions'

export const UPDATE_DOCUMENT_CONTENT = 'UPDATE_DOCUMENT_CONTENT'
export const UPDATE_DOCUMENT_NAME = 'UPDATE_DOCUMENT_NAME'
export const RESET_DOCUMENT_CHANGES = 'RESET_DOCUMENT_CHANGES'
export const TOGGLE_DOCUMENT_RENAME = 'TOGGLE_DOCUMENT_RENAME'
export const EXPECT_CONFIRM_ACTION = 'EXPECT_CONFIRM_ACTION'

const actionCreator = actionCreatorFactory()

export type ConfirmActionName = 'home' | 'view' | 'refresh' | 'delete' | undefined

export type ExpectConfirmAction = {
  action: ConfirmActionName
}

export type UpdateParams = {
  id: TextDocumentId,
  modifications: PartialTextDocument & { updated_at: string }
}

export const resetDocumentChanges = actionCreator<undefined>(RESET_DOCUMENT_CHANGES)

export const modifyDocument = actionCreator<UpdateParams>(UPDATE_DOCUMENT_CONTENT)

export const expectConfirmAction = actionCreator<ExpectConfirmAction>(EXPECT_CONFIRM_ACTION)

export const deleteAndRefresh = bindThunkAction(deleteDocumentAction, async (params, dispatch): Promise<TextDocumentId> => {
  const deletedId = await deleteByDocument(params.resource)
  await getFolder(dispatch, { id: params.resource.folder })
  dispatch(push('/'))
  return deletedId
})

export const createAndSelect = bindThunkAction(createDocumentAction, async (params: ByResourceParams<PartialFolder>, dispatch): Promise<TextDocument> => {
  const document = await create(params.resource)
  await getFolder(dispatch, { id: document.folder })
  dispatch(push('/edit/' + document.id))
  return document
})

export const createFolderAndRefresh = bindThunkAction(createFolderAction, async (params: ByResourceParams<PartialFolder>, dispatch): Promise<Folder> => {
  const folder = await createFolder(dispatch, params)
  await getFolder(dispatch, { id: folder.parent })
  return folder
})
