/**
 * Author: Bartłomiej Klinger <bartlomiej.klinger@positiverse.com>
 */

import { put, select } from 'redux-saga/effects'
import { Linking } from 'react-native'
import StartupActions from '../Redux/StartupRedux'

// process STARTUP actions
export function * startup (action) {
  try {
    const url = yield Linking.getInitialURL();
    if (__DEV__ && console.tron) {
      console.tron.display({
        name: 'MYCONSENTS APP STARTUP',
        preview: 'Starting and initializing myConsents App.',
        value: {
          linkingUrl: url,
        }
      })
    }
    yield put(StartupActions.initialized(url))
  } catch(err) {
    yield put(StartupActions.startupFailure(err))
  }

}
