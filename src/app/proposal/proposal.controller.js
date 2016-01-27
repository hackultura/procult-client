(function() {
	'use strict';

	angular
	.module('procultApp')
	.controller('ProposalController', ProposalController)
	.controller('ProposalNewController', ProposalNewController)
	.controller('ProposalUpdateController', ProposalUpdateController)
	.controller('ProposalDeleteController', ProposalDeleteController)
	.controller('ProposalAnalysisController', ProposalAnalysisController);

	ProposalController.$inject = ['$mdDialog'];
	ProposalNewController.$inject = [];
	ProposalDeleteController.$inject = ['$mdDialog'];
	ProposalAnalysisController.$inject = ['$mdDialog'];

	/* @ngInject */
	function ProposalController($mdDialog) { var vm = this;

		// Functions
		vm.init = init;
		vm.deleteDialog = deleteDialog;

		function init() {

		}

		function deleteDialog(event) {
			$mdDialog.show({
				controller: ProposalDeleteController,
				controllerAs: 'vm',
				templateUrl: 'proposal/proposal_delete.tmpl.html',
				parent: angular.element(document.body),
				targetEvent: event,
				clickOutsideToClose: false
			});
		}

	}

	/* @ngInject */
	function ProposalNewController() {
		var vm = this;

		// Functions
		vm.init = init;

		function init() {

		}
	}

	/* @ngInject */
	function ProposalUpdateController() {
		var vm = this;

		// Functions
		vm.init = init;

		function init() {

		}
	}

	/* @ngInject */
	function ProposalDeleteController($mdDialog) {
		var vm = this;

		// Functions
		vm.init = init;
		vm.hide = hide;
		vm.cancel = cancel;
		vm.deleteProposal = deleteProposal;

		function init() {

		}

		function hide() {
			$mdDialog.hide();
		}

		function cancel() {
			$mdDialog.cancel();
		}

		function deleteProposal() {}
	}

	/* @ngInject */
	function ProposalAnalysisController($mdDialog) {
		var vm = this;

		// Functions
		vm.init = init;
		vm.showProposal = showProposal;
		vm.hide = hide;
		vm.cancel = cancel;
		vm.deleteProposal = deleteProposal;

		function init() {

		}

		function showProposal(event) {
			$mdDialog.show({
				controller: ProposalAnalysisController,
				controllerAs: 'vm',
				templateUrl: 'proposal/proposal_detail.tmpl.html',
				parent: angular.element(document.body),
				targetEvent: event,
				clickOutsideToClose: true
			});
		}

		function hide() {
			$mdDialog.hide();
		}

		function cancel() {
			$mdDialog.cancel();
		}

		function deleteProposal() {}
	}
})();
