// @flow
/**
 * Author: Bartłomiej Klinger <bartlomiej.klinger@positiverse.com>
 */

import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/NavItemsStyle'
import ConsentListActions from '../Redux/ConsentsListRedux'
import { Colors, Metrics } from '../Themes'
import Icon from 'react-native-vector-icons/FontAwesome'

class ReloadButton extends React.Component {

  static propTypes = {
    fetchConsentList: React.PropTypes.func,
    dispatch: React.PropTypes.func,
  };

  render () {
    return (
      <TouchableOpacity onPress={() => { this.props.fetchConsentList() }}>
        <Icon name='refresh'
              size={Metrics.icons.small}
              color={Colors.snow}
              style={styles.reloadButton}
        />
      </TouchableOpacity>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchConsentList: () => dispatch(ConsentListActions.consentsListRequest()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReloadButton)
