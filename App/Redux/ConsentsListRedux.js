import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
/**
 * Author: Bartłomiej Klinger <bartlomiej.klinger@positiverse.com>
 */

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  consentsListRequest: null,
  consentsListSuccess: ['consents'],
  consentsListSelectConsents: ['dataControllerSelected'],
  consentsListWithdrawConsent: ['consentIdx'],
  consentsListConsentWithdrew: ['consentIdx','consentMeta'],
  consentsListFailure: ['error']
})

export const ConsentsListTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  withdrawing: false,
  withdrawingIndex: null,
  consents: null,
  dataControllerSelected: null,
  error: null
})

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state) =>
  state.merge({ fetching: true, withdrawing: false, withdrawingIndex: null, consents: null, dataControllerSelected: null })

// successful api lookup
export const success = (state, action) => {
  const { consents } = action
  return state.merge({ fetching: false, withdrawing: false, withdrawingIndex: null, consents, dataControllerSelected: null, error: null })
}

export const selectConsents = (state, action) => {
  const {dataControllerSelected} = action
  return state.merge({fetching: false, dataControllerSelected })
}

// withdraw consent through saasApi
export const withdrawConsent = (state, action) => {
  const { consentIdx } = action
  //let consentsRequest = Immutable.asMutable(state.consentsRequest, {deep: true})
  // console.tron.log({
  //   message: 'REDUCER saveConsent',
  //   consentActive: consentActive,
  //   consentsRequest: consentsRequest,
  // })
  return state.merge({ fetching: false, withdrawing: true, withdrawingIndex: consentIdx, error: null })
}

// successful consent withdrew
export const consentWithdrew = (state, action) => {
  const { consentIdx } = action
  const { consentMeta } = action
  let consents = Immutable.asMutable(state.consents, {deep: true})
  consents[consentIdx] = Object.assign(consents[consentIdx], consentMeta)
  // console.tron.log({
  //   message: 'REDUCER consentWithdrew',
  //   consentWithdrew: consents[consentIdx],
  // })
  //
  return state.merge({ fetching: false, withdrawing: true, withdrawingIndex: null, consents, error: null })
}

// Something went wrong somewhere.
export const failure = (state, error) =>
  state.merge({ fetching: false, consents: null, dataControllerSelected: null, error: error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CONSENTS_LIST_REQUEST]: request,
  [Types.CONSENTS_LIST_SELECT_CONSENTS]: selectConsents,
  [Types.CONSENTS_LIST_WITHDRAW_CONSENT]: withdrawConsent,
  [Types.CONSENTS_LIST_CONSENT_WITHDREW]: consentWithdrew,
  [Types.CONSENTS_LIST_SUCCESS]: success,
  [Types.CONSENTS_LIST_FAILURE]: failure
})
