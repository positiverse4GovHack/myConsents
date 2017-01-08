import test from 'ava'
import Actions, { reducer, INITIAL_STATE } from '../../App/Redux/ConsentsListRedux'

test('attempt', t => {
  const state = reducer(INITIAL_STATE, Actions.consentsListRequest('data'))

  t.true(state.fetching)
})

test('success', t => {
  const state = reducer(INITIAL_STATE, Actions.consentsListSuccess('hi'))

  t.is(state.payload, 'hi')
})

test('failure', t => {
  const state = reducer(INITIAL_STATE, Actions.consentsListFailure(99))

  t.false(state.fetching)
  t.true(state.error)
})
