(function() {
	'use strict';

	angular
	.module('procultApp')
	.controller('HeaderController', HeaderController);

	HeaderController.$inject = ['$mdSidenav', '$state', 'UserService'];

	/* @ngInject */
	function HeaderController($mdSidenav, $state, UserService) {
		var vm = this;

		// Variables
		vm.user = {};

		// Functions
		vm.init = init;
		vm.toggleSidenav = toggleSidenav;
		vm.logout = logout;

		function init() {
			vm.user = UserService.getAuthenticatedAccount();
		}

		function toggleSidenav(menu) {
			$mdSidenav(menu).toggle();
		}

		function logout() {
			UserService.unauthenticate();
			$state.transitionTo('simple.login');
		}
	}
})();
