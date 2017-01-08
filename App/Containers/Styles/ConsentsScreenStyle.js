// @flow
/**
 * Author: Bartłomiej Klinger <bartlomiej.klinger@positiverse.com>
 */

import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  tabView: {
    paddingBottom: 70,
  },
  tabSelectedstyle: {

  },
  listContainer: {
    marginTop: 0,
    marginBottom: Metrics.baseMargin,
    marginHorizontal: Metrics.baseMargin,
  },
  processingType_prerequisite: {
    borderLeftWidth: 5,
    borderLeftColor: Colors.panther,
  },
  processingType_required: {
    borderLeftWidth: 5,
    borderLeftColor: Colors.fire,
  },
  processingType_optional: {
    borderLeftWidth: 5,
    borderLeftColor: Colors.positiverse3,
  },
  consentText: {
    fontWeight: 'bold',
  },
})
