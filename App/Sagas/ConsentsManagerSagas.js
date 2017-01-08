/**
 * Author: Bartłomiej Klinger <bartlomiej.klinger@positiverse.com>
 */

import { delay } from 'redux-saga'
import { take, call, put, select } from 'redux-saga/effects'
import { Linking } from 'react-native'
import forge from 'node-forge'
import { StartupTypes } from '../Redux/StartupRedux'
import ConsentsManagerActions from '../Redux/ConsentsManagerRedux'
import addPersonalDataSubjectId from '../Transforms/AddPersonalDataSubjectId'


// const consentsRaw = [
//   {
//     dataController: '0x0e81ba2134e382f2d36ad3f247035bc035746756',
//     processingPurpose: 'Processing of the personal data usage consents through myConsents mobile app.',
//     processingPurposeType: 'serviceSignUp',
//     processingType: 'prerequisite',
//     potentialDisclosures: 'none',
//     consentActive: false,
//     personalDataAttributes: [
//       {
//         personalDataType: 'mobileNumber',
//         personalData: '+48 12345678',
//       },
//     ],
//   },
//   {
//     dataController: '0x0e81ba2134e382f2d36ad3f247035bc035746756',
//     processingPurpose: 'Usage of services offered by eCommerce, processing of a shopping basket and purchases of products offered.',
//     processingPurposeType: 'serviceUsage',
//     processingType: 'required',
//     potentialDisclosures: 'none',
//     consentActive: false,
//     personalDataAttributes: [
//       {
//         personalDataType: 'name',
//         personalData: 'John Smith',
//       },
//       {
//         personalDataType: 'emailAddress',
//         personalData: 'John.Smith@gamil.com',
//       },
//       {
//         personalDataType: 'birthDate',
//         personalData: 'John Smith',
//       },
//       {
//         personalDataType: 'mobileNumber',
//         personalData: '+48 12345678',
//       },
//     ]
//   },
//   {
//     dataController: '0x0e81ba2134e382f2d36ad3f247035bc035746756',
//     processingPurpose: 'Finalization of the shopping transaction and delivery of purchased products.',
//     processingPurposeType: 'transaction',
//     processingType: 'required',
//     potentialDisclosures: 'none',
//     consentActive: false,
//     personalDataAttributes: [
//       {
//         personalDataType: 'name',
//         personalData: 'John Smith',
//       },
//       {
//         personalDataType: 'emailAddress',
//         personalData: 'John.Smith@gamil.com',
//       },
//       {
//         personalDataType: 'mobileNumber',
//         personalData: '+48 12345678',
//       },
//       {
//         personalDataType: 'postalAddress',
//         personalData: 'Freedom Str 1, New York, 091-121-123, Poland',
//       },
//     ]
//   },
//   {
//     dataController: '0x0e81ba2134e382f2d36ad3f247035bc035746756',
//     processingPurpose: 'Better user experience of eCommerce service, registration of you shopping preference, analytics of eCommerce online service usage.',
//     processingPurposeType: 'profiling',
//     processingType: 'optional',
//     potentialDisclosures: 'none',
//     consentActive: false,
//     personalDataAttributes: [
//       {
//         personalDataType: 'browserCookies',
//       },
//     ]
//   },
//   {
//     dataController: '0x0e81ba2134e382f2d36ad3f247035bc035746756',
//     processingPurpose: 'Marketing communication in an electronic form.',
//     processingPurposeType: 'marketing',
//     processingType: 'optional',
//     potentialDisclosures: 'none',
//     consentActive: false,
//     personalDataAttributes: [
//       {
//         personalDataType: 'emailAddress',
//         personalData: 'John.Smith@gamil.com',
//       },
//     ]
//   },
// ]

// const consents = forge.util.encode64(JSON.stringify(consentsRaw));

// exported to make available for tests
export const selectDataControllerAddress = (state) => state.consentsManager.consentsRequest.dataControllerAddress
export const selectConsentToSave = (state, idx) => state.consentsManager.consentsRequest.newConsents[idx]

export function * getRequest() {
  try {
    //yield take(StartupTypes.INITIALIZED);
    let consentsRequest = null

    //@TODO Make it more bullet proof
    const url = yield Linking.getInitialURL();
    if(url) {
      const urlPartsRegex = /^(?:\w+\:\/\/)?(?:[^\/]+)[\/](.*)$/
      const urlParsed = urlPartsRegex.exec(url)
      consentsRequest = JSON.parse(forge.util.decode64(urlParsed[1]))
    }
    //let consentsRequest = JSON.parse(forge.util.decode64(consents))

    console.tron.log({
      message: 'SAGA getRequest',
      url: url,
      consentsRequest: consentsRequest,
    })
    yield put(ConsentsManagerActions.consentsManagerRequestGot(consentsRequest, url))
  } catch(err) {
    yield put(ConsentsManagerActions.consentsManagerFailure(err))
  }
}


export function * fetchConsent(api, action) {
  const { consentId } = action
  // make the call to the api
  try {
    const response = yield call(api.fetchConsent, consentId)

    // success?
    if (response.ok) {
      // You might need to change the response here - do this with a 'transform',
      // located in ../Transforms/. Otherwise, just pass the data back from the api.
      yield put(ConsentsManagerActions.consentsManagerConsentFetched(response.data))
    } else {
      yield put(ConsentsManagerActions.consentsManagerFailure(response))
    }
  } catch(err) {
    yield put(ConsentsManagerActions.consentsManagerFailure(err))
  }
}

export function * saveConsent(api, action) {
  // const { consentNew } = action
  const { consentIdx } = action
  // make the call to the api
  try {
    const dataController = yield select(selectDataControllerAddress)
    let consentToSave = yield select(selectConsentToSave, consentIdx)

    // check if there is anything to save
    if (consentToSave == null)
      throw new Error('No consentToSave data in the store')

    consentToSave = addPersonalDataSubjectId(consentToSave)
    consentToSave = consentToSave.merge({ dataController })
    const response = yield call(api.saveConsent, consentToSave)

    // success?
    if (response.ok) {
      // You might need to change the response here - do this with a 'transform',
      // located in ../Transforms/. Otherwise, just pass the data back from the api.

      yield put(ConsentsManagerActions.consentsManagerConsentSaved(consentIdx, response.data))

      yield delay(1000)

      yield put(ConsentsManagerActions.consentsManagerConsentRemove(consentIdx))
    } else {
      yield put(ConsentsManagerActions.consentsManagerFailure(response))
    }
  } catch(err) {
    yield put(ConsentsManagerActions.consentsManagerFailure(err))
  }
}

