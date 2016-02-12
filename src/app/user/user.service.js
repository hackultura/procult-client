(function () {
	'use strict';

	angular
		.module('procultApp')
		.factory('UserService', UserService);

	UserService.$inject = ['$http', '$cookies', 'API_URI_PREFIX'];

	function UserService($http, $cookies, API_URI_PREFIX) {
		return {
			query: query,
			getUser: getUser,
			createUser: createUser,
			updateUser: updateUser,
			removeUser: removeUser,
			login: login,
			changePassword: changePassword,
			getAuthenticatedAccount: getAuthenticatedAccount,
			setAuthenticatedAccount: setAuthenticatedAccount,
			isAuthenticated: isAuthenticated,
			isAdmin: isAdmin,
			unauthenticate: unauthenticate
		};

		function query() {
			return $http.get(API_URI_PREFIX + '/usuarios/');
		}

		function getUser(id) {
			return $http.get(API_URI_PREFIX + '/usuarios/' + id + '/');
		}

		function createUser(user) {
			return $http.post(API_URI_PREFIX + '/usuarios/', user);
		}

		function updateUser(id, user) {
			return $http.put(API_URI_PREFIX + '/usuarios/' + id + '/', user);
		}

		function removeUser(id) {
			return $http.delete(API_URI_PREFIX + '/usuarios/' + id + '/');
		}

		function login(email, password) {
			return $http.post(API_URI_PREFIX + '/auth/login/', {
				email: email,
				password: password
			});
		}

		function changePassword(id, email, old_password, password1, password2) {
			return $http.post(API_URI_PREFIX + '/auth/password/change/' + id, {
				email: email,
				old_password: old_password,
				password1: password1,
				password2: password2
			});
		}

		function getAuthenticatedAccount() {
			if(!$cookies.get('user')) {
				return;
			}
			return JSON.parse($cookies.get('user'));
		}

		function setAuthenticatedAccount(account) {
			$cookies.put('user', JSON.stringify(account));
		}

		function isAuthenticated() {
			return !!$cookies.get('user');
		}

		function isAdmin() {
			return getAuthenticatedAccount().is_admin;
		}

		function unauthenticate() {
			$cookies.remove('user');
		}
	}
}());
