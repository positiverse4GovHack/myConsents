// @flow
/**
 * Author: Bartłomiej Klinger <bartlomiej.klinger@positiverse.com>
 */

import {StyleSheet} from 'react-native'
import { Metrics, Colors } from '../../Themes/'

const navButton = {
  backgroundColor: Colors.transparent,
  justifyContent: 'center'
}

export default StyleSheet.create({
  backButton: {
    ...navButton,
    marginTop: Metrics.baseMargin,
    marginLeft: Metrics.baseMargin
  },
  searchButton: {
    ...navButton,
    marginTop: Metrics.section,
    marginRight: Metrics.baseMargin,
    alignItems: 'center'
  },
  reloadButton: {
    ...navButton,
    marginTop: 0,
    marginRight: Metrics.baseMargin,
  }
})
