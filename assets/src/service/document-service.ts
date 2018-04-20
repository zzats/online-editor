import axios from 'axios'
import { FolderId } from 'service/folder-service'

import {
  ApiResourceId,
  HasId,
  Map,
  Partial,
  isAxiosError
} from './common'

export type TextDocumentId = ApiResourceId

export type TextDocument = {
  readonly id: ApiResourceId,
  readonly name: string,
  readonly content: string,
  readonly owner: string,
  readonly folder: string,
  readonly inserted_at: string,
  readonly updated_at: string
}

export type PartialTextDocument = Partial<TextDocument>

export function isDocument(candidate: any): candidate is TextDocument {
  return Boolean(document &&
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.content === 'string')
}

export function create(document: PartialTextDocument): Promise<TextDocument> {
  return axios.post<Promise<TextDocument>>('/api/documents', document)
    .then(response => response.data)
}

export function update(id: ApiResourceId, document: PartialTextDocument): Promise<TextDocument> {
  return axios.put<TextDocument>(`/api/documents/${id}?overwrite=false`, document)
    .then(res => res.data)
    .catch(err => {
      if (isAxiosError(err) && err.response && err.response.status === 409) {
        console.log('rejecting')
        return Promise.reject(new Error('An updated version of the document exists, please reload the document'))
      } else {
        return Promise.reject(err)
      }
    })
}

export function getAllByFolder(id: FolderId): Promise<Array<TextDocument>> {
  return axios.get<Array<TextDocument>>('/api/documents?folder=' + id)
    .then(res => res.data)
}

export function getAll(): Promise<Array<TextDocument>> {
  return axios.get<Array<TextDocument>>('/api/documents').then(res => res.data)
}

export function getById(id: ApiResourceId): Promise<TextDocument> {
  return axios.get<TextDocument>(`/api/documents/${id}`).then(res => res.data)
}

export function deleteByDocument(d: HasId): Promise<ApiResourceId> {
  return axios.delete('/api/documents/' + d.id).then(() => d.id)
}

export function deleteMultiple(items: Map<HasId>): Promise<ApiResourceId[]> {
  const documents: Array<TextDocument> = Object.keys(items)
    .map(id => (items[id] as TextDocument))
    .filter(d => isDocument(d))
  const deletions = documents.map(d => deleteByDocument(d))
  return Promise.all(deletions)
}
