// @flow
/**
 * Author: Bartłomiej Klinger <bartlomiej.klinger@positiverse.com>
 */

import React from 'react'
import { View, ScrollView, ListView, Text, Image, ActivityIndicator, KeyboardAvoidingView, Linking, UIManager, LayoutAnimation } from 'react-native'
import { Card, List, ListItem, Button, CheckBox } from 'react-native-elements'
import { connect } from 'react-redux'
import R from 'ramda'
import ConsentsManagerActions from '../Redux/ConsentsManagerRedux'
import { Metrics, Images, Colors } from '../Themes'
import processingPurposeTypeLong from '../Transforms/ProcessingPurposeTypeLong'
import { getDataControllers, getDataController } from '../Transforms/DataControllers'

// external libs
// import Icon from 'react-native-vector-icons/FontAwesome'
// import Animatable from 'react-native-animatable'
// import { Actions as NavigationActions } from 'react-native-router-flux'

// Styles
import styles from './Styles/ConsentsScreenStyle'

// I18n
// import I18n from 'react-native-i18n'

const CustomLayoutSpring = {
  duration: 400,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: 0.7,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 0.7,
  },
};

// Linear with easing
const CustomLayoutLinear = {
  duration: 200,
  create: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.curveEaseInEaseOut,
  },
};

class ConsentsScreen extends React.Component {

  static propTypes = {
    consentsRequest: React.PropTypes.object,
    getting: React.PropTypes.bool,
    fetching: React.PropTypes.bool,
    saving: React.PropTypes.bool,
    savingIndex: React.PropTypes.number,

    getConsentRequest: React.PropTypes.func,
    fetchConsent: React.PropTypes.func,
    saveConsent: React.PropTypes.func,
    dispatch: React.PropTypes.func,
  };

  constructor (props) {
    super(props)
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  // componentWillReceiveProps () {
  //   this.props.getConsentRequest();
  // }

  componentDidMount () {
    this.props.getConsentRequest();
  }

  componentWillUpdate() {
    //zLayoutAnimation.easeInEaseOut();
    //LayoutAnimation.configureNext(CustomLayoutSpring);
  }

  render () {
    const { consentsRequest } = this.props;

    //const prerequisites = consentsRequest.newConsents
    const stat = R.countBy((item) => {return item.processingType})(consentsRequest && consentsRequest.newConsents ? consentsRequest.newConsents : [])

    if (__DEV__ && console.tron) {
      console.tron.display({
        name: 'CONSENTS SCREEN',
        preview: 'Counting the requested consents types.',
        value: {
          stat: stat,
        }
      })
    }

    const consentsRequestStat = `Consents requested: ${stat && stat.required ? stat.required : 'n/a'} required | ${stat && stat.optional ? stat.optional : 'n/a'} optional`

    const dataControllerInfo = consentsRequest != null ? getDataController(consentsRequest.dataController) : null
    return (
      <View style={styles.mainContainer}>
        <Image style={styles.backgroundImage} source={Images.background} />
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior='position'>

            {
              this.props.getting ? (
                  <ActivityIndicator
                    animating={true}
                    style={[styles.centering, {height: 80}]}
                    size='large'
                    color='white'
                  />
                ):(
                  consentsRequest == null ?
                    (
                      <View style={styles.section} >
                        <Text style={styles.sectionText} >
                          You don't have any new consents requests
                        </Text>
                      </View>
                    ):(
                      <View style={styles.tabView}>
                        <View>
                          <Text style={styles.sectionText} >
                            New consents request from:
                          </Text>
                          <List containerStyle={styles.listContainer}>
                            {
                              dataControllerInfo != null ? (
                                  <ListItem
                                    avatar={{uri: dataControllerInfo.dataControllerIcon}}
                                    title={dataControllerInfo.dataControllerName}
                                    consentsRequestStat
                                    subtitle={consentsRequestStat}
                                    // subtitle={dataControllerInfo.dataControllerDescription}
                                    hideChevron
                                  />
                                ):(
                                  <ListItem
                                    title={consentsRequest.dataControllerName}
                                    hideChevron
                                  />
                                )
                            }
                          </List>

                        </View>
                        {
                          consentsRequest.newConsents &&
                          consentsRequest.newConsents.length > 0 &&
                          consentsRequest.newConsents.map((consent, cidx) => {
                            return (
                              <Card
                                key={cidx}
                                title={processingPurposeTypeLong(consent.processingPurposeType)}
                                // title={`${consent.processingPurposeType} | ${consent.processingType}`}
                                containerStyle={styles[`processingType_${consent.processingType}`]}
                              >
                                <Text style={{fontWeight: 'bold'}}>
                                  Purpose of data usage:
                                </Text>
                                <Text style={{marginBottom: 10}}>
                                  {consent.processingPurpose}
                                </Text>
                                {
                                  consent.personalDataAttributes.map((attribute, aidx) => {
                                    return (
                                      <ListItem
                                        key={aidx}
                                        roundAvatar
                                        hideChevron
                                        title={attribute.personalDataType}
                                        subtitle={attribute.personalData}
                                        icon={false}
                                      />
                                    )
                                  })
                                }
                                {
                                  this.props.saving &&
                                  this.props.savingIndex == cidx ? (
                                      <ActivityIndicator
                                        animating={true}
                                        style={[styles.centering, {height: 67}]}
                                        size='large'
                                        color={Colors.positiverse1}
                                      />
                                    ):(
                                      consentsRequest.newConsents[cidx].giveConsentTxHash != null ? (
                                          <CheckBox
                                            checked={true}
                                            title='Press to consent to the use of the personal data attributes listed above'
                                            checkedTitle='Your consent to use of the personal data attributes listed above has been given.'
                                            textStyle={[styles.consentText, {color: 'green'}]}
                                          />
                                        ):(
                                          <CheckBox
                                            checked={false}
                                            title='Press to consent to the use of the personal data attributes listed above'
                                            checkedTitle='Your consent to use of the personal data attributes listed above has been given.'
                                            onPress={(evt) => { this.props.saveConsent(cidx) }}
                                            textStyle={styles.consentText}
                                          />

                                        )
                                    )
                                }
                              </Card>
                            )
                          })
                        }
                      </View>
                    )
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
    consentsRequest: state.consentsManager.consentsRequest,
    getting: state.consentsManager.getting,
    fetching: state.consentsManager.fetching,
    saving: state.consentsManager.saving,
    savingIndex: state.consentsManager.savingIndex,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchConsent: (consentId) => dispatch(ConsentsManagerActions.consentsManagerFetchConsent(consentId)),
    saveConsent: (consentIdx) => dispatch(ConsentsManagerActions.consentsManagerSaveConsent(consentIdx)),
    getConsentRequest: () => dispatch(ConsentsManagerActions.consentsManagerGetRequest()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsentsScreen)
