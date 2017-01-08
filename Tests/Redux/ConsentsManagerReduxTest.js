import test from 'ava'
import Actions, { reducer, INITIAL_STATE } from '../../App/Redux/ConsentsManagerRedux'

test('attempt', t => {
  const state = reducer(INITIAL_STATE, Actions.consentsManagerRequest('data'))

  t.true(state.fetching)
})

test('success', t => {
  const state = reducer(INITIAL_STATE, Actions.consentsManagerSuccess('hi'))

  t.is(state.payload, 'hi')
})

test('failure', t => {
  const state = reducer(INITIAL_STATE, Actions.consentsManagerFailure(99))

  t.false(state.fetching)
  t.true(state.error)
})
