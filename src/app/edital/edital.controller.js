(function() {
	'use strict';

	angular
	.module('procultApp')
	.controller('EditalController', EditalController)
	.controller('EditalUpdateController', EditalUpdateController)
	.controller('EditalNewController', EditalNewController);

	EditalController.$inject = ['EditalService', 'AlertService'];
	EditalNewController.$inject = ['EditalService', 'AlertService', '$state'];
	EditalUpdateController.$inject = ['EditalService', 'AlertService', '$state', '$stateParams'];
	
	/* @ngInject */
	function EditalController(EditalService, AlertService) {
		var vm = this;


		vm.editais = [];
		vm.errors = [];
		vm.hasOpenEdital = false;

		// Functions
		vm.init = init;
		vm.enableEnterEdital = enableEnterEdital;

		function init() {
			listEditais();
		}

		function listEditais() {
			EditalService.listEditais().then(function(response){
				vm.editais = response.data;
				checkDisableEdital();
			}, function(error){
				vm.errors = AlertService.message(error);
			});
		}

		function enableEnterEdital(edital) {
			return edital.is_available;
		}

		function checkDisableEdital() {
			if(vm.editais == null || vm.editais.length == 0)
				return;

			vm.hasOpenEdital = false;
			vm.editais.results.forEach(function(edital) {
				if(vm.enableEnterEdital(edital)) {
					vm.hasOpenEdital = true;
					return;
				}
			});
		}

	}

	/* @ngInject */
	function EditalNewController(EditalService, AlertService, $state) {
		var vm = this;

		vm.edital = {};
		vm.errors = [];

		// Functions
		vm.init = init;
		vm.createEdital = createEdital;

		function init() {
		}

		function createEdital() {
			if(vm.edital.is_available == null) {
				vm.edital.is_available = false;
			}
			EditalService.createEdital(vm.edital).then(function(){
				$state.transitionTo("admin.editais.painel");
			}, function(error) {
				console.log(vm.edital);
				vm.errors = AlertService.message(error);
			});
		}
	}

	/* @ngInject */
	function EditalUpdateController(EditalService, AlertService, $state, $stateParams) {
		var vm = this;

		vm.edital = {};
		vm.errors = [];

		// Functions
		vm.init = init;
		vm.updateEdital = updateEdital;

		function init() {
			EditalService.getEdital($stateParams.id).then(function(response) {
				vm.edital = response.data;
				console.log(vm.edital.is_available);
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

		function updateEdital() {
			if(vm.edital.is_available == null) {
				vm.edital.is_available = false;
			}
			EditalService.updateEdital(vm.edital).then(function(){
				$state.transitionTo("admin.editais.painel");
			}, function(error) {
				console.log(vm.edital);
				vm.errors = AlertService.message(error);
			});
		}
	}
})();
