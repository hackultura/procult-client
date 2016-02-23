(function() {
	'use strict';

	angular
	.module('procultApp')
	.controller('ProposalController', ProposalController)
	.controller('ProposalNewController', ProposalNewController)
	.controller('ProposalDetailsController', ProposalDetailsController)
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
	ProposalNewController.$inject = ['$state', '$timeout', '$mdDialog', 'ProposalService', 'AlertService'];
	ProposalDetailsController.$inject = ['$state', '$stateParams', 'ProposalService', 'AlertService'];
	ProposalUpdateController.$inject = ['$state', '$timeout', '$stateParams', '$mdDialog', 'ProposalService', 'AlertService'];
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
		vm.isEditable = isEditable;

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

		function isEditable(proposal) {
			return ProposalService.disableProposal(proposal);
		}
	}

	/* @ngInject */
	function ProposalNewController($state, $timeout, $mdDialog, ProposalService, AlertService) {
		var vm = this;

		vm.proposal = {};
		vm.errors = [];

		// Functions
		vm.init = init;
		vm.createProposal = createProposal;
		vm.sendProposal = sendProposal;

		function init() {
			vm.proposal.attachments = [];
		}

		function createProposal() {
			showDialog();
			ProposalService.createProposal(vm.proposal).then(function(response) {
				if(response.status === 201) {
					ProposalService.setProposalSelected(response.data);
					vm.proposal.attachments.forEach(function(file){
						uploadDocuments(response.data, file);
					});
				}
			}, function(error){
				vm.errors = AlertService.message(error);
			});
		}

		function sendProposal() {
			showDialog();
			ProposalService.sendProposal(vm.proposal).then(function(response) {
				if(response.status === 201) {
					ProposalService.setProposalSelected(response.data);
					vm.proposal.attachments.forEach(function(file){
						uploadDocuments(response.data, file);
					});
				}
			}, function(error){
				vm.errors = AlertService.message(error);
			});
		}

		function uploadDocuments(data, file) {
			file.upload = ProposalService.uploadDocument(data, file);

			file.upload.then(function() {
				if (!ProposalService.isUploadIsProgress()) {
					$timeout(function() {
						$mdDialog.hide();
						$state.go('admin.propostas.detalhe_impressao', {number: data.number});
					}, 300);
				}
			}, function(response) {
				if(response.status > 0) {
					vm.errors = AlertService.error('Erro ao enviar arquivo: ' + response.data);
				}
			});
		}

		function showDialog(ev) {
			$mdDialog.show({
				controller: ProposalUpdateController,
				templateUrl: 'proposal/creating_proposal.tmpl.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:false
			});
		}
	}

	/* @ngInject */
	function ProposalDetailsController($state, $stateParams, ProposalService, AlertService) {
		var vm = this;

		vm.proposal = {};

		vm.init = init;

		function init() {
			ProposalService.getProposal($stateParams.number).then(function(response) {
				vm.proposal = response.data;
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}
	}

	/* @ngInject */
	function ProposalUpdateController($state, $timeout, $stateParams, $mdDialog, ProposalService, AlertService) {
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
			showDialog();
			ProposalService.updateProposal(vm.proposal).then(function(response) {
				if (vm.proposal.new_attachments.length > 0) {
					vm.proposal.new_attachments.forEach(function(file){
						uploadDocuments(response.data, file);
					});
				} else {
					$mdDialog.hide();
					$state.go('admin.propostas');
				}
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

		function sendProposal() {
			showDialog();
			ProposalService.updateAndSendProposal(vm.proposal).then(function(response) {
				if (vm.proposal.new_attachments.length > 0) {
					vm.proposal.new_attachments.forEach(function(file){
						uploadDocuments(response.data, file);
					});
				} else {
					$mdDialog.hide();
					$state.go('admin.propostas');
				}
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

		function deleteDocument(attachment) {
			ProposalService.deleteDocument(attachment.uid).then(function(response) {
				if(response.status === 204) {
					vm.proposal.attachments = vm.proposal.attachments.filter(function(item) {
						if(item.uid !== attachment.uid) {
							return item;
						}
					});
				}
			});
		}

		function uploadDocuments(data, file) {
			file.upload = ProposalService.uploadDocument(data, file);

			file.upload.then(function() {
				if (!ProposalService.isUploadIsProgress()) {
					$timeout(function() {
						$mdDialog.hide();
						$state.go('admin.propostas.detalhe_impressao', {number: data.number});
					}, 300);
				}
			}, function(response) {
				if(response.status > 0) {
					vm.errors = AlertService.error('Erro ao enviar arquivo: ' + response.data);
				}
			});
		}

		function showDialog(ev) {
			$mdDialog.show({
				controller: ProposalUpdateController,
				templateUrl: 'proposal/creating_proposal.tmpl.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:false
			});
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
