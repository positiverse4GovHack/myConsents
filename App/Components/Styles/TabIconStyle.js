// @flow

import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts, ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Metrics.titlePadding
  },
  label: {
    ...Fonts.style.h5,
    fontWeight: 'bold',
    color: Colors.snow,
    borderBottomColor: Colors.snow,
  },
})
