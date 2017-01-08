// @flow
/**
 * Author: Bartłomiej Klinger <bartlomiej.klinger@positiverse.com>
 */

import Immutable from 'seamless-immutable'
import AppSettings from '../Config/AppConfig'

export default (object) => {
  const personalDataSubject = AppSettings.personalDataSubject
  return Immutable.merge(object, { personalDataSubject })
}
