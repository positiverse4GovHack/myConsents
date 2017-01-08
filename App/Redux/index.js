// @flow
/**
 * Author: Bartłomiej Klinger <bartlomiej.klinger@positiverse.com>
 */

import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'

export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = combineReducers({
    startup: require('./StartupRedux').reducer,

    consentsList: require('./ConsentsListRedux').reducer,
    consentsManager: require('./ConsentsManagerRedux').reducer,
  })

  return configureStore(rootReducer, rootSaga)
}
