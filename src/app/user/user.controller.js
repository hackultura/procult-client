(function() {
	'use strict';

	angular
		.module('procultApp')
		.controller('UserController', UserController)
		.controller('UserProfileController', UserProfileController)
		.controller('UserRegisterController', UserRegisterController)
		.controller('LoginController', LoginController);

	UserController.$inject = [];
	UserProfileController.$inject = [];
	UserRegisterController.$inject = [];

	/* @ngInject */
	function UserController() {
		var vm = this;

		vm.init = init;

		function init() {
		}
	}

	/* @ngInject */
	function UserProfileController() {
		var vm = this;

		vm.init = init;

		function init() {
		}
	}

	/* @ngInject */
	function UserRegisterController() {
		var vm = this;

		// Variables
		vm.profile = '';

		//Functions
		vm.init = init;
		vm.setProfile = setProfile;

		function init() {
		}

		function setProfile(profile) {
			vm.profile = profile;
		}
	}

	/* @ngInject */
	function LoginController() {
		var vm = this;

		vm.init = init;

		function init() {
		}
	}

})();
