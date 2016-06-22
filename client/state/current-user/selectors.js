/**
 * External dependencies
 */
import get from 'lodash/get';

/**
 * Internal dependencies
 */
import { getUser } from 'state/users/selectors';
import createSelector from 'lib/create-selector';

/**
 * Returns the user object for the current user.
 *
 * @param  {Object}  state  Global state tree
 * @return {?Object}        Current user
 */
export function getCurrentUser( state ) {
	if ( ! state.currentUser.id ) {
		return null;
	}

	return getUser( state, state.currentUser.id );
}

/**
 * Returns the locale slug for the current user.
 *
 * @param  {Object}  state  Global state tree
 * @return {?String}        Current user locale
 */
export function getCurrentUserLocale( state ) {
	const user = getCurrentUser( state );
	if ( ! user ) {
		return null;
	}

	return user.localeSlug || null;
}

/**
 * Returns true if the current user has the specified capability for the site,
 * false if the user does not have the capability, or null if the capability
 * cannot be determined (if the site is not currently known, or if specifying
 * an invalid capability).
 *
 * @see https://codex.wordpress.org/Function_Reference/current_user_can
 *
 * @param  {Object}   state      Global state tree
 * @param  {Number}   siteId     Site ID
 * @param  {String}   capability Capability label
 * @return {?Boolean}            Whether current user has capability
 */
export function canCurrentUser( state, siteId, capability ) {
	return get( state.currentUser.capabilities, [ siteId, capability ], null );
}

/**
 * Returns a log of actions from certain types that have previously been
 * dispatched for the current user. This includes actions from a permanent
 * queue that persists in localStorage, as well as actions from a temporary
 * queue that only lasts for the duration of the current Calypso session.
 *
 * These actions are to be consumed by and inform Calypso's Guided Tours
 * framework.
 *
 * Since this selector is pulls from two sources and merges them, it will
 * always return a different object instance even when called with the same
 * `state`. Thus, we need to memoize it with `createSelector` — not for its own
 * benefit, but for that of other selectors which depend on it.
 *
 * @param  {Object}   state      Global state tree
 * @return {Array}               Array of Redux actions, each with timestamp
 */
export const getActionLog = createSelector(
	state => [
		...state.currentUser.actionLog.permanent,
		...state.currentUser.actionLog.temporary,
	],
	state => [
		state.currentUser.actionLog.permanent,
		state.currentUser.actionLog.temporary,
	]
);
