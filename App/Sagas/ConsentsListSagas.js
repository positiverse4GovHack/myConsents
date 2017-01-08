/**
 * Author: Bartłomiej Klinger <bartlomiej.klinger@positiverse.com>
 */

import { call, put, select } from 'redux-saga/effects'
import ConsentsListActions from '../Redux/ConsentsListRedux'
import AppConfig from '../Config/AppConfig'

// exported to make available for tests
export const selectConsentToWithdraw = (state, idx) => state.consentsList.consents[idx]

export function * fetchMyConsents (api, action) {
  try {
    const dataSubjectAddress = AppConfig.personalDataSubject
    const response = yield call(api.fetchMyConsents, dataSubjectAddress)

    // success?
    if (response.ok) {
      // You might need to change the response here - do this with a 'transform',
      // located in ../Transforms/. Otherwise, just pass the data back from the api.
      yield put(ConsentsListActions.consentsListSuccess(response.data))
    } else {
      yield put(ConsentsListActions.consentsListFailure(response))
    }
  } catch(err) {
    yield put(ConsentsListActions.consentsListFailure(err))
  }
}

export function * withdrawConsent(api, action) {
  const { consentIdx } = action
  const dataSubjectAddress = AppConfig.personalDataSubject
  try {
    const consentToWithdraw = yield select(selectConsentToWithdraw, consentIdx)

    // check if there is anything ready to withdraw
    if (consentToWithdraw == null)
      throw new Error('No consentToWithdraw data in the store')
    if (consentToWithdraw.giveConsentTxHash == null)
      throw new Error('ConsentToWithdraw does not contain giveConsentTxHash data')

    const withdrawRequest = {
      personalDataSubject: dataSubjectAddress,
      giveConsentTxHash: consentToWithdraw.giveConsentTxHash,
    }
    const response = yield call(api.withdrawConsent, withdrawRequest)

    if (response.ok) {
      yield put(ConsentsListActions.consentsListConsentWithdrew(consentIdx, response.data))
    } else {
      yield put(ConsentsListActions.consentsListFailure(response))
    }
  } catch(err) {
    yield put(ConsentsListActions.consentsListFailure(err))
  }
}


