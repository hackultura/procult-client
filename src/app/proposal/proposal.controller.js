(function() {
	'use strict';

	angular
	.module('procultApp')
	.controller('ProposalController', ProposalController)
	.controller('ProposalNewController', ProposalNewController)
	.controller('ProposalUpdateController', ProposalUpdateController)
	.controller('ProposalDeleteController', ProposalDeleteController)
	.controller('ProposalAnalysisController', ProposalAnalysisController)
	.controller('ProposalAnalysisDetailsController', ProposalAnalysisDetailsController);

	ProposalController.$inject = [
		'$mdDialog',
		'UserService',
		'ProposalService',
		'AlertService',
		'PROPOSAL_LIMIT'
	];
	ProposalNewController.$inject = ['$state', 'ProposalService', 'AlertService'];
	ProposalUpdateController.$inject = ['$state', '$stateParams', 'ProposalService', 'AlertService'];
	ProposalDeleteController.$inject = ['$mdDialog', '$state', 'ProposalService', 'AlertService'];
	ProposalAnalysisController.$inject = ['ProposalService', 'AlertService'];
	ProposalAnalysisDetailsController.$inject = ['$state', '$stateParams', 'ProposalService', 'AlertService'];

	/* @ngInject */
	function ProposalController($mdDialog, UserService, ProposalService, AlertService, PROPOSAL_LIMIT) {
		var vm = this;

		vm.proposals = [];

		vm.enableNewProposal = false;
		vm.errors = [];

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
				vm.errors = AlertService.message(error);
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
	function ProposalNewController($state, ProposalService, AlertService) {
		var vm = this;

		vm.proposal = {};
		vm.errors = [];

		// Functions
		vm.init = init;
		vm.createProposal = createProposal;
		vm.sendProposal = sendProposal;

		function init() {

		}

		function createProposal() {
			ProposalService.createProposal(vm.proposal).then(function(response) {
				if(response.status === 201) {
					vm.proposal.attachments.forEach(function(file){
						ProposalService.uploadDocument(response.data, file).finally(function() {
							$state.go('admin.propostas');
						});
					});
				}
			}, function(error){
				vm.errors = AlertService.message(error);
			});
		}

		function sendProposal() {
			ProposalService.sendProposal(vm.proposal).then(function(response) {
				if(response.status === 201) {
					vm.proposal.attachments.forEach(function(file){
						ProposalService.uploadDocument(response.data, file).finally(function() {
							$state.go('admin.propostas');
						});
					});
				}
			}, function(error){
				vm.errors = AlertService.message(error);
			});
		}
	}

	/* @ngInject */
	function ProposalUpdateController($state, $stateParams, ProposalService, AlertService) {
		var vm = this;

		vm.proposal = {};
		vm.errors = [];

		// Functions
		vm.init = init;
		vm.updateProposal = updateProposal;
		vm.sendProposal = sendProposal;
		vm.deleteDocument = deleteDocument;

		function init() {
			ProposalService.getProposal($stateParams.number).then(function(response) {
				vm.proposal = response.data;
				vm.proposal.new_attachments = [];
			}, function(error) {
				vm.errors = AlertService.message(error);
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
				vm.errors = AlertService.message(error);
			});
		}

		function sendProposal() {
			ProposalService.updateAndSendProposal(vm.proposal).then(function(response) {
				vm.proposal.new_attachments.forEach(function(file){
					ProposalService.uploadDocument(response.data, file).finally(function() {
						$state.go('admin.propostas');
					});
				});
				$state.go('admin.propostas');
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

		function deleteDocument(attachment) {
			ProposalService.deleteDocument(attachment.uid);
			vm.proposal.attachments.slice(attachment, 1);
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

		vm.errors = [];

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
	function ProposalAnalysisController(ProposalService, AlertService) {
		var vm = this;

		// Functions
		vm.init = init;

		vm.proposals = [];
		vm.errors = [];

		function init() {
			ProposalService.query().then(function(response) {
				vm.proposals = response.data;
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

	}

	/* @ngInject */
	function ProposalAnalysisDetailsController($state, $stateParams, ProposalService, AlertService) {
		var vm = this;

		// Functions
		vm.init = init;
		vm.approveProposal = approveProposal;
		vm.reproveProposal = reproveProposal;

		vm.proposal = {};
		vm.errors = [];

		function init() {
			ProposalService.getProposal($stateParams.number).then(function(response) {
				vm.proposal = response.data;
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

		function approveProposal() {
			ProposalService.approveProposal(vm.proposal).then(function() {
				$state.go('admin.propostas.analise');
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

		function reproveProposal() {
			ProposalService.reproveProposal(vm.proposal).then(function() {
				$state.go('admin.propostas.analise');
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

	}
})();
