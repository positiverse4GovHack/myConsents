// @flow
/**
 * Author: Bartłomiej Klinger <bartlomiej.klinger@positiverse.com>
 */

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'


/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  startup: null,
  initialized: ['linkedUrl'],
  startupFailure: ['error'],
})

export const StartupTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  linkedApp: null,
  error: null,
})

/* ------------- Reducers ------------- */

export const initialized = (state, action) => {
  const { linkedUrl } = action
  const linkedApp = linkedUrl != null ? { linkedUrl: linkedUrl } : null
  return state.merge({ initialized: true, linkedApp})
}

// we've had a problem logging in
export const failure = (state, { error }) =>
  state.merge({ error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INITIALIZED]: initialized,
  [Types.STARTUP_FAILURE]: failure,
})
