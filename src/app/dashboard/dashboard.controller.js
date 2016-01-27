(function() {
	'use strict';

	angular
		.module('procultApp')
		.controller('DashboardController', DashboardController);

	// DashboardController.$inject = [];

	function DashboardController() {
		var vm = this;

		// Functions
		vm.init = init;

		function init() {
			vm.message = "Hello Open Mechanics";
		};

	}
})();
