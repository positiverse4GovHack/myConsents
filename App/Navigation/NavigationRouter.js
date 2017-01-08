// @flow
/**
 * Author: Bartłomiej Klinger <bartlomiej.klinger@positiverse.com>
 */

import React, { Component } from 'react'
import { Scene, Router, ActionConst } from 'react-native-router-flux'
import TabIcon from '../Components/TabIcon'
import Styles from './Styles/NavigationContainerStyle'
import NavItems from './NavItems'


// screens identified by the router
import ConsentsScreen from '../Containers/ConsentsScreen'
import ConsentsListScreen from '../Containers/ConsentsListScreen'
import ConsentsDetailsScreen from '../Containers/ConsentsDetailsScreen'
import RequestsListScreen from '../Containers/RequestsListScreen'

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

class NavigationRouter extends Component {
  render () {
    return (
      <Router>
        <Scene key='main' leftButtonIconStyle={Styles.leftButton} rightButtonTextStyle={Styles.rightButton}>
          <Scene key="tabbar"
                 tabs
                 navigationBarStyle={Styles.navBar}
                 titleStyle={Styles.title}
                 tabBarStyle={Styles.tabBarStyle}
                 tabBarSelectedItemStyle={Styles.tabBarSelectedItemStyle}
          >
            <Scene key='requests'
                   icon={TabIcon}
                   title='Requests'
                   leftButtonIconStyle={Styles.leftButton}
                   rightButtonTextStyle={Styles.rightButton}
            >
              <Scene key='requestsList'
                     component={RequestsListScreen}
                     title='New Requests List'
                     navigationBarStyle={Styles.navBar}
                     titleStyle={Styles.title}
              />
              <Scene key='consentsScreen'
                     component={ConsentsScreen}
                     title='Consents Request'
                     navigationBarStyle={Styles.navBar}
                     titleStyle={Styles.title}
                     icon={TabIcon}
                     type={ActionConst.REPLACE}
              />
            </Scene>
            <Scene key='consents'
                   icon={TabIcon}
                   title='Consents'
                   leftButtonIconStyle={Styles.leftButton}
                   rightButtonTextStyle={Styles.rightButton}
            >
              <Scene key='consentsList'
                     component={ConsentsListScreen}
                     title='My Consents List'
                     navigationBarStyle={Styles.navBar}
                     titleStyle={Styles.title}
              />
              <Scene key='consentsDetails'
                     component={ConsentsDetailsScreen}
                     title='Consents Details'
                     navigationBarStyle={Styles.navBar}
                     titleStyle={Styles.title}
                     renderRightButton={NavItems.reloadButton}
              />
            </Scene>
          </Scene>
        </Scene>
      </Router>
    )
  }
}

export default NavigationRouter
