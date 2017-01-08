// @flow
/**
 * Author: Bartłomiej Klinger <bartlomiej.klinger@positiverse.com>
 */

import React from 'react'
import { View, ScrollView, Text, KeyboardAvoidingView, Image, ActivityIndicator } from 'react-native'
import { Card, List, ListItem, Button, CheckBox } from 'react-native-elements'
import { connect } from 'react-redux'
import R from 'ramda'
import processingPurposeTypeLong from '../Transforms/ProcessingPurposeTypeLong'
import { getDataControllers, getDataController } from '../Transforms/DataControllers'

import ConsentsListActions from '../Redux/ConsentsListRedux'
import { Metrics, Images, Colors } from '../Themes'
// external libs
import Icon from 'react-native-vector-icons/FontAwesome'
import Animatable from 'react-native-animatable'
import { Actions as NavigationActions } from 'react-native-router-flux'

// Styles
import styles from './Styles/ConsentsDetailsScreenStyle'

// I18n
import I18n from 'react-native-i18n'

class ConsentsDetailsScreen extends React.Component {

  static propTypes = {
    consents: React.PropTypes.arrayOf(React.PropTypes.object),
    dataControllerSelected: React.PropTypes.object,
    fetching: React.PropTypes.bool,
    withdrawing: React.PropTypes.bool,
    withdrawingIndex: React.PropTypes.number,
    withdrawConsent: React.PropTypes.func,
    dispatch: React.PropTypes.func,
  };

  constructor (props) {
    super(props)
  }

  render () {
    const { consents, dataControllerSelected } = this.props;

    const stat = consents && consents.length > 0 ? R.countBy((item) => {return item.processingType})(consents) : null

    if (__DEV__ && console.tron) {
      console.tron.display({
        name: 'CONSENTS DETAILS SCREEN',
        preview: 'Counting the requested consents types.',
        value: {
          consents: consents,
          stat: stat,
          dataControllerSelected: dataControllerSelected,
        }
      })
    }

    const consentsStat = `Consents requested: ${stat && stat.required ? stat.required : 'n/a'} required | ${stat && stat.optional ? stat.optional : 'n/a'} optional`
    const dataControllerInfo = dataControllerSelected != null ? getDataController(dataControllerSelected.dataController) : null

    return (
      <View style={styles.mainContainer}>
        <Image style={styles.backgroundImage} source={Images.background} />
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior='position'>
            <View style={styles.tabView}>

              {
                this.props.fetching ? (
                    <ActivityIndicator
                      animating={true}
                      style={[styles.centering, {height: 80}]}
                      size='large'
                      color='white'
                    />
                  ):(
                    consents && consents.length > 0 && consents.map((consent, cidx) => {
                      return (
                        <Card
                          key={cidx}
                          //title={`${consent.processingPurposeType} | ${consent.processingType}`}
                          title={processingPurposeTypeLong(consent.processingPurposeType)}
                          containerStyle={styles[`processingType_${consent.processingType}`]}
                        >
                          <Text style={{fontWeight: 'bold'}}>
                            Purpose of data usage:
                          </Text>
                          <Text style={{marginBottom: 10}}>
                            {consent.processingPurpose}
                          </Text>
                          {
                            consent.personalDataTypes.map((type, aidx) => {
                              return (
                                <ListItem
                                  key={aidx}
                                  roundAvatar
                                  hideChevron
                                  title={type}
                                  icon={false}
                                />
                              )
                            })
                          }
                          {
                            this.props.withdrawing &&
                            this.props.withdrawingIndex == cidx ? (
                                <ActivityIndicator
                                  animating={true}
                                  style={[styles.centering, {height: 67}]}
                                  size='large'
                                  color={Colors.positiverse1}
                                />
                              ):(
                                consents[cidx].withdrawTimestamp != null ? (
                                    <CheckBox
                                      checked={true}
                                      title='Press to withdraw the consent to the use of the personal data attributes listed above'
                                      checkedTitle='Your consent to use of the personal data attributes listed above has been withdrew.'
                                      textStyle={[styles.consentText, {color: Colors.charcoal1}]}
                                      iconType='material'
                                      checkedIcon='not-interested'
                                      uncheckedIcon='not-interested'
                                      checkedColor={Colors.charcoal1}
                                    />
                                  ):(
                                    consents[cidx].withdrawConsentTxHash != null ? (
                                        <CheckBox
                                          checked={true}
                                          title='Press to withdraw the consent to the use of the personal data attributes listed above'
                                          checkedTitle='Your withdraw of the consent to use of the personal data attributes listed above is pending.'
                                          textStyle={[styles.consentText, {color: Colors.charcoal1}]}
                                          iconType='material'
                                          checkedIcon='more-horiz'
                                          uncheckedIcon='more-horiz'
                                          checkedColor={Colors.charcoal1}
                                        />
                                      ):(
                                        <CheckBox
                                          checked={false}
                                          title='Press to withdraw the consent to the use of the personal data attributes listed above'
                                          checkedTitle='Your consent to use of the personal data attributes listed above has been withdrew.'
                                          onPress={(evt) => { this.props.withdrawConsent(cidx) }}
                                          textStyle={styles.consentText}
                                          iconType='material'
                                          checkedIcon='clear'
                                          uncheckedIcon='clear'
                                          uncheckedColor={Colors.charcoal}
                                        />
                                      )
                                  )
                              )
                          }
                        </Card>
                      )
                    })
                  )
              }

            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    consents: state.consentsList.consents,
    dataControllerSelected: state.consentsList.dataControllerSelected,
    withdrawing: state.consentsList.withdrawing,
    fetching: state.consentsList.fetching,
    withdrawingIndex: state.consentsList.withdrawingIndex,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    withdrawConsent: (consentIdx) => dispatch(ConsentsListActions.consentsListWithdrawConsent(consentIdx)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsentsDetailsScreen)
