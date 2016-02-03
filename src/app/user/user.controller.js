(function() {
	'use strict';

	angular
		.module('procultApp')
		.controller('UserController', UserController)
		.controller('UserProfileController', UserProfileController)
		.controller('UserRegisterController', UserRegisterController)
		.controller('UserUpdateController', UserUpdateController)
		.controller('LoginController', LoginController);

	UserController.$inject = ['UserService'];
	UserProfileController.$inject = ['$state', '$stateParams', 'UserService'];
	UserRegisterController.$inject = ['UserService', 'AlertService', '$state'];
	UserUpdateController.$inject = ['$state', '$stateParams', 'UserService'];
	LoginController.$inject = ['$state', 'UserService'];

	/* @ngInject */
	function UserController(UserService) {
		var vm = this;

		vm.users = [];

		vm.init = init;

		function init() {
			listUsers();
		}

		function listUsers() {
			UserService.query().then(function(response){
				vm.users = response.data;
			}, function(erro){
				console.log(erro);
			});
		}
	}

	/* @ngInject */
	function UserProfileController($state, $stateParams, UserService) {
		var vm = this;

		vm.user = {};

		vm.init = init;
		vm.saveProfile = saveProfile;

		function init() {
			UserService.getUser($stateParams.id).then(function(response) {
				vm.user = response.data;
			}, function(error) {
				console.log(error);
			});
		}

		function saveProfile() {
			UserService.updateUser($stateParams.id, vm.user).then(function() {
				$state.go('admin.propostas');
			}, function(error) {
				console.log(error);
			});
		}
	}

	/* @ngInject */
	function UserRegisterController(UserService, AlertService, $state) {
		var vm = this;

		// Variables
		vm.profile = '';
		vm.user = {};
		vm.errors = [];

		//Functions
		vm.init = init;
		vm.setProfile = setProfile;
		vm.createUser = createUser;

		function init() {
		}

		function setProfile(profile) {
			vm.profile = profile;
		}

		function createUser() {
			console.log(vm.user);
			UserService.createUser(vm.user).then(function(){
				AlertService.success({
					msg: 'Usuário criado com sucesso. Agora faça o seu login.',
					show: true
				});
				$state.transitionTo($state.previous.name, $state.previous.params);
			}, function(erro){
				console.log(erro);
				vm.errors = erro.data;
			});
		}
	}

	/* @ngInject */
	function UserUpdateController($state, $stateParams, UserService) {
		var vm = this;

		vm.init = init;
		vm.updateUser = updateUser;

		vm.user = {};

		function init() {
			UserService.getUser($stateParams.id).then(function(response) {
				vm.user = response.data;
			}, function(error) {
				console.log(error);
			});
		}

		function updateUser() {
			UserService.updateUser($stateParams.id, vm.user).then(function() {
				$state.go('admin.usuarios');
			}, function(error) {
				console.log(error);
			});
		}
	}

	/* @ngInject */
	function LoginController($state, UserService) {
		var vm = this;

		vm.user = {};
		vm.errors = [];

		vm.init = init;
		vm.login = login;

		function init() {
		}

		function login() {
			UserService.login(vm.user.email, vm.user.password).then(function(response){
				UserService.setAuthenticatedAccount(response.data);
				$state.go('admin.propostas');
			}, function(error){
				console.log(error.data.message);
				vm.errors.push({msg: error.data.message});
			});
		}
	}

})();
