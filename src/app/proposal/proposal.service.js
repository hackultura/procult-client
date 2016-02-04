(function () {
	'use strict';

	angular
		.module('procultApp')
		.factory('ProposalService', ProposalService);

	ProposalService.$inject = ['$http', 'API_URI_PREFIX', 'UserService', 'Upload'];

	function ProposalService($http, API_URI_PREFIX, UserService, Upload) {
		var proposalSelected = {};
		return {
			query: query,
			myProposals: myProposals,
			createProposal: createProposal,
			sendProposal: sendProposal,
			getProposal: getProposal,
			setProposalSelected: setProposalSelected,
			updateProposal: updateProposal,
			updateAndSendProposal: updateAndSendProposal,
			deleteProposal: deleteProposal,
			uploadDocument: uploadDocument,
			deleteDocument: deleteDocument
		};

		function query() {
			return $http.get(API_URI_PREFIX + '/propostas/');
		}

		function myProposals(user_id) {
			return $http.get(API_URI_PREFIX + '/propostas/user/' + user_id + '/');
		}

		function createProposal(proposal) {
			return $http.post(API_URI_PREFIX + '/propostas/', {
					user: UserService.getAuthenticatedAccount().id,
					title: proposal.title
			});
		}

		function sendProposal(proposal) {
			return $http.post(API_URI_PREFIX + '/propostas/', {
					user: UserService.getAuthenticatedAccount().id,
					title: proposal.title,
					status: 'sended'
			});
		}

		function getProposal(number) {
			return $http.get(API_URI_PREFIX + '/propostas/' + number + '/');
		}

		function setProposalSelected(proposal) {
			proposalSelected = proposal;
		}

		function updateProposal(proposal) {
			return $http.put(API_URI_PREFIX + '/propostas/' + proposal.number + '/', {
					user: UserService.getAuthenticatedAccount().id,
					title: proposal.title
			});
		}

		function updateAndSendProposal(proposal) {
			return $http.put(API_URI_PREFIX + '/propostas/' + proposal.number + '/', {
					user: UserService.getAuthenticatedAccount().id,
					title: proposal.title,
					status: 'sended'
			});
		}

		function deleteProposal() {
			return $http.delete(API_URI_PREFIX + '/propostas/' + proposalSelected.number + '/');
		}

		function uploadDocument(proposal, file) {
			return Upload.upload({
				url: API_URI_PREFIX + '/propostas/' + proposal.number + '/upload/',
				data: {file: file.lfFile}
			});
		}

		function deleteDocument(uid) {
			return $http.delete(API_URI_PREFIX + '/propostas/documentos/' + uid + '/');
		}
	}
}());
