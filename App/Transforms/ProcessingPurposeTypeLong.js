// @flow
/**
 * Author: Bartłomiej Klinger <bartlomiej.klinger@positiverse.com>
 */

const processingPurposeTypes = {
  serviceSignUp: 'Service sign-up',
  serviceUsage: 'Service usage',
  transaction: 'Current transaction processing',
  profiling: 'User profiling',
  marketing: 'Marketing',
}

export default (processingPurposeType) => processingPurposeTypes[processingPurposeType]
