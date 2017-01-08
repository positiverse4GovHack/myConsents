// @flow

import React from 'react'
import { View, Text } from 'react-native'
import { Colors } from '../Themes/'
import styles from './Styles/TabIconStyle'

export default class TabIcon extends React.Component {

  static propTypes = {
    selected: React.PropTypes.bool,
    title: React.PropTypes.string,
  };

  render () {
    return (
      <Text
        //style={[styles.label, { color: this.props.selected ? Colors.positiverse3 : Colors.snow }]}
        style={[styles.label, { borderBottomWidth: this.props.selected ? 3 : 0 }]}
      >
        {this.props.title}
      </Text>
    )
  }
}

// // Prop type warnings
// TabIcon.propTypes = {
//   someProperty: React.PropTypes.object,
//   someSetting: React.PropTypes.bool.isRequired
// }
//
// // Defaults for props
// TabIcon.defaultProps = {
//   someSetting: false
// }
