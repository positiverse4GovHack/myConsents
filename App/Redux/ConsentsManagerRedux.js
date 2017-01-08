import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
/**
 * Author: Bartłomiej Klinger <bartlomiej.klinger@positiverse.com>
 */

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  consentsManagerGetRequest: null,
  consentsManagerRequestGot: ['consentsRequest'],
  consentsManagerFetchConsent: ['consentId'],
  consentsManagerConsentFetched: ['consentData'],
  consentsManagerSaveConsent: ['consentIdx'],
  consentsManagerConsentSaved: ['consentIdx','consentMeta'],
  consentsManagerConsentRemove: ['consentIdx'],
  consentsManagerFailure: ['error'],
})

export const ConsentsManagerTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  consentId: null,
  consentData: null,

  consentsRequest: null,
  getting: false,
  fetching: false,
  saving: false,
  savingIndex: null,
  error: null,
})

/* ------------- Reducers ------------- */
// check the request from other app
export const getRequest = (state) =>
  state.merge({ getting: true, fetching: false, saving: false, savingIndex: null, consentsRequest: null, error: null })

// get the other app's request data
export const requestGot = (state, action ) => {
  const { consentsRequest } = action
  return state.merge({ getting: false, fetching: false, saving: false, savingIndex: null, consentsRequest, error: null })
}

// request the data from an saasApi
export const fetchConsent = (state, { consentId }) =>
  state.merge({ getting: false, fetching: true, saving: false, savingIndex: null, consentId, consentData: null, error: null })

// successful saasApi lookup
export const consentFetched = (state, action) => {
  const { consentData } = action
  return state.merge({ getting: false, fetching: false, saving: false, savingIndex: null, consentData, error: null })
}

// save consent through saasApi
export const saveConsent = (state, action) => {
  const { consentIdx } = action

  let consentsRequest = Immutable.asMutable(state.consentsRequest, {deep: true})
  // console.tron.log({
  //   message: 'REDUCER saveConsent',
  //   consentActive: consentActive,
  //   consentsRequest: consentsRequest,
  // })

  return state.merge({ getting: false, fetching: false, saving: true, savingIndex: consentIdx, consentsRequest, error: null })
}

// successful consent save
export const consentSaved = (state, action) => {
  const { consentIdx } = action
  const { consentMeta } = action
  let consentsRequest = Immutable.asMutable(state.consentsRequest, {deep: true})

  // const consentActive = !consentsRequest.newConsents[consentIdx].consentActive
  // consentsRequest.newConsents[consentIdx].consentActive = consentActive

  consentsRequest.newConsents[consentIdx] = Object.assign(consentsRequest.newConsents[consentIdx], consentMeta)
  // console.tron.log({
  //   message: 'REDUCER consentSaved',
  //   consentsRequest: consentsRequest,
  // })
  //
  return state.merge({ getting: false, fetching: false, saving: false, savingIndex: null, consentsRequest, error: null })
}

// successful consent save
export const consentRemove = (state, action) => {
  const { consentIdx } = action
  let consentsRequest = Immutable.asMutable(state.consentsRequest, {deep: true})

  consentsRequest.newConsents.splice(consentIdx, 1)
  if (consentsRequest.newConsents.length == 0) {
    consentsRequest = null
  }
  // console.tron.log({
  //   message: 'REDUCER consentSaved',
  //   consentsRequest: consentsRequest,
  // })
  //
  return state.merge({ getting: false, fetching: false, saving: false, savingIndex: null, consentsRequest, error: null })
}

// Something went wrong somewhere.
export const failure = (state, action) => {
  const { error } = action
  return state.merge({ getting: false, fetching: false, saving: false, error: error })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CONSENTS_MANAGER_GET_REQUEST]: getRequest,
  [Types.CONSENTS_MANAGER_REQUEST_GOT]: requestGot,
  [Types.CONSENTS_MANAGER_FETCH_CONSENT]: fetchConsent,
  [Types.CONSENTS_MANAGER_CONSENT_FETCHED]: consentFetched,
  [Types.CONSENTS_MANAGER_SAVE_CONSENT]: saveConsent,
  [Types.CONSENTS_MANAGER_CONSENT_SAVED]: consentSaved,
  [Types.CONSENTS_MANAGER_CONSENT_REMOVE]: consentRemove,
  [Types.CONSENTS_MANAGER_FAILURE]: failure
})
