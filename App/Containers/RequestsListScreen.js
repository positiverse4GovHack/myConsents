// @flow
/**
 * Author: Bartłomiej Klinger <bartlomiej.klinger@positiverse.com>
 */

import React from 'react'
import { View, ScrollView, Text, KeyboardAvoidingView, Image, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { List, ListItem } from 'react-native-elements'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import { Images, Metrics } from '../Themes'

// external libs
import Icon from 'react-native-vector-icons/FontAwesome'
import Animatable from 'react-native-animatable'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { getDataControllers, getDataController } from '../Transforms/DataControllers'

// Styles
import styles from './Styles/RequestsListScreenStyle'

// I18n
import I18n from 'react-native-i18n'

class RequestsListScreen extends React.Component {

  static propTypes = {
    consentsRequests: React.PropTypes.object,
    fetching: React.PropTypes.bool,
    fetchRequestsList: React.PropTypes.func,
    dispatch: React.PropTypes.func,
  };

  constructor (props) {
    super(props)
    this.state = {
      dataControllers: getDataControllers(),
    }
  }

  componentWillMount () {
    //this.props.fetchRequestsList();
    NavigationActions.consentsScreen()
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
    // consentsRequests: state.requestsList.consents,
    // fetching: state.requestsList.fetching,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestsListScreen)




// @flow




class ConsentsListScreen extends React.Component {




}

// const mapStateToProps = (state) => {
//   return {
//     consents: state.consentsList.consents,
//     fetching: state.consentsList.fetching,
//   }
// }
//
// const mapDispatchToProps = (dispatch) => {
//   return {
//     fetchConsentList: () => dispatch(ConsentListActions.consentsListRequest()),
//   }
// }
//
