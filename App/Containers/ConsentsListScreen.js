// @flow
/**
 * Author: Bartłomiej Klinger <bartlomiej.klinger@positiverse.com>
 */

import React from 'react'
import { View, ScrollView, Text, KeyboardAvoidingView, Image, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { List, ListItem } from 'react-native-elements'

import ConsentListActions from '../Redux/ConsentsListRedux'
import { Images, Metrics } from '../Themes'
import { getDataControllers, getDataController } from '../Transforms/DataControllers'

// external libs
import Icon from 'react-native-vector-icons/FontAwesome'
import Animatable from 'react-native-animatable'
import { Actions as NavigationActions } from 'react-native-router-flux'

// Styles
import styles from './Styles/ConsentsListScreenStyle'

// I18n
import I18n from 'react-native-i18n'


class ConsentsListScreen extends React.Component {

  static propTypes = {
    consents: React.PropTypes.arrayOf(React.PropTypes.object),
    fetching: React.PropTypes.bool,
    fetchConsentList: React.PropTypes.func,
    dispatch: React.PropTypes.func,
  };

  constructor (props) {
    super(props)
    this.state = {
      dataControllers: getDataControllers(),
    }
  }

  componentWillMount () {
    this.props.fetchConsentList();
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <Image style={styles.backgroundImage} source={Images.background} />
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior='position'>
            {
              this.props.fetching ? (
                  <ActivityIndicator
                    animating={true}
                    style={[styles.centering, {height: 80}]}
                    size='large'
                    color='white'
                  />
                ):(
                  <List containerStyle={styles.listContainer}>
                    {
                      this.state.dataControllers  &&
                      this.state.dataControllers.map((dc, i) => (
                        <ListItem
                          key={i}
                          avatar={{uri: dc.dataControllerIcon}}
                          title={dc.dataControllerName}
                          subtitle={dc.dataControllerDescription}
                          onPress={() => NavigationActions.consentsDetails(dc.dataController)}
                        />
                      ))
                    }
                  </List>
                )
            }
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    consents: state.consentsList.consents,
    fetching: state.consentsList.fetching,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchConsentList: () => dispatch(ConsentListActions.consentsListRequest()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsentsListScreen)
