/**
 * Author: Bartłomiej Klinger <bartlomiej.klinger@positiverse.com>
 */

import { takeLatest } from 'redux-saga'
import SaaSAPI from '../Services/SaaSApi'
import SaaSFixtureAPI from '../Services/SaaSFixtureApi'

import DebugSettings from '../Config/DebugSettings'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { ConsentsManagerTypes } from '../Redux/ConsentsManagerRedux'
import { ConsentsListTypes } from '../Redux/ConsentsListRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { fetchMyConsents, withdrawConsent } from './ConsentsListSagas'
import { getRequest, fetchConsent, saveConsent } from './ConsentsManagerSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const saasApi = DebugSettings.useFixtures ? SaaSFixtureAPI : SaaSAPI.create()

//const api = DebugSettings.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield [
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    takeLatest(ConsentsManagerTypes.CONSENTS_MANAGER_GET_REQUEST, getRequest),
    // some sagas receive extra parameters in addition to an action
    takeLatest(ConsentsListTypes.CONSENTS_LIST_REQUEST, fetchMyConsents, saasApi),
    takeLatest(ConsentsManagerTypes.CONSENTS_MANAGER_FETCH_CONSENT, fetchConsent, saasApi),
    takeLatest(ConsentsManagerTypes.CONSENTS_MANAGER_SAVE_CONSENT, saveConsent, saasApi),
    takeLatest(ConsentsListTypes.CONSENTS_LIST_WITHDRAW_CONSENT, withdrawConsent, saasApi),
  ]
}
