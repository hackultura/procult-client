(function() {
	'use strict';

	angular
	.module('procultApp')
	.controller('ProposalController', ProposalController)
	.controller('ProposalNewController', ProposalNewController)
	.controller('ProposalUpdateController', ProposalUpdateController)
	.controller('ProposalDeleteController', ProposalDeleteController)
	.controller('ProposalAnalysisController', ProposalAnalysisController);

	ProposalController.$inject = ['$mdDialog', 'UserService', 'ProposalService', 'PROPOSAL_LIMIT'];
	ProposalNewController.$inject = ['$state', 'ProposalService'];
	ProposalUpdateController.$inject = ['$state', '$stateParams', 'ProposalService'];
	ProposalDeleteController.$inject = ['$mdDialog', '$state', 'ProposalService'];
	ProposalAnalysisController.$inject = ['$mdDialog'];

	/* @ngInject */
	function ProposalController($mdDialog, UserService, ProposalService, PROPOSAL_LIMIT) {
		var vm = this;

		vm.proposals = [];

		vm.enableNewProposal = false;

		// Functions
		vm.init = init;
		vm.deleteDialog = deleteDialog;

		function init() {
			listProposal();
		}

		function listProposal() {
			var user = UserService.getAuthenticatedAccount();
			ProposalService.myProposals(user.id).then(function(response){
				vm.proposals = response.data;
				vm.enableNewProposal = vm.proposals.length === PROPOSAL_LIMIT;
			}, function(error){
				console.log(error);
			});
		}

		function deleteDialog(event, number) {
			ProposalService.getProposal(number).then(function(response){
				ProposalService.setProposalSelected(response.data);
			});
			$mdDialog.show({
				controller: ProposalDeleteController,
				controllerAs: 'vm',
				templateUrl: 'proposal/proposal_delete.tmpl.html',
				parent: angular.element(document.body),
				targetEvent: event,
				clickOutsideToClose: false
			}).then(function() {
				listProposal();
			});
		}

	}

	/* @ngInject */
	function ProposalNewController($state, ProposalService) {
		var vm = this;

		vm.proposal = {};

		// Functions
		vm.init = init;
		vm.createProposal = createProposal;

		function init() {

		}

		function createProposal() {
			ProposalService.createProposal(vm.proposal).then(function(response) {
				if(response.status === 201) {
					vm.proposal.attachments.forEach(function(file){
						ProposalService.uploadDocument(response.data, file).finally(function() {
							console.log('acabou');
							$state.go('admin.propostas');
						});
					});
				}
			}, function(error){
				console.log(error);
			});
		}
	}

	/* @ngInject */
	function ProposalUpdateController($state, $stateParams, ProposalService) {
		var vm = this;

		vm.proposal = {};

		// Functions
		vm.init = init;
		vm.updateProposal = updateProposal;
		vm.deleteDocument = deleteDocument;

		function init() {
			ProposalService.getProposal($stateParams.number).then(function(response) {
				vm.proposal = response.data;
				vm.proposal.new_attachments = [];
			}, function(error) {
				console.log(error);
			});
		}

		function updateProposal() {
			ProposalService.updateProposal(vm.proposal).then(function(response) {
				vm.proposal.new_attachments.forEach(function(file){
					ProposalService.uploadDocument(response.data, file).finally(function() {
						$state.go('admin.propostas');
					});
				});
				$state.go('admin.propostas');
			}, function(error) {
				console.log(error);
			});
		}

		function deleteDocument(attachment) {
			console.log(vm.proposal.attachments);
			ProposalService.deleteDocument(attachment.uid);
			vm.proposal.attachments.slice(attachment, 1);
			console.log(vm.proposal.attachments);
		}
	}

	/* @ngInject */
	function ProposalDeleteController($mdDialog, $state, ProposalService) {
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

		function deleteProposal() {
			ProposalService.deleteProposal();

			$mdDialog.hide();
			$state.transitionTo('admin.propostas');
		}
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
