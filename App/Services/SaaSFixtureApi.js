// @flow
/**
 * Author: Bartłomiej Klinger <bartlomiej.klinger@positiverse.com>
 */

export default {
  // Functions return fixtures
  getConsent: (consentId) => {
    // This fixture only supports Boise or else returns toronto
    const consent = require('../Fixtures/consent.json')
    return {
      ok: true,
      data: consent,
    }
  }
}
