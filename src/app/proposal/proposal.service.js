(function () {
	'use strict';

	angular
		.module('procultApp')
		.factory('ProposalService', ProposalService);

	ProposalService.$inject = [
		'$http',
		'API_URI_PREFIX',
		'UserService',
		'Upload',
		'PROPOSAL_STATUS'
	];

	function ProposalService($http, API_URI_PREFIX, UserService,
													 Upload, PROPOSAL_STATUS) {
		var proposalSelected = {};
		return {
			query: query,
			myProposals: myProposals,
			createProposal: createProposal,
			sendProposal: sendProposal,
			approveProposal: approveProposal,
			reproveProposal: reproveProposal,
			getProposal: getProposal,
			getProposalSelected: getProposalSelected,
			setProposalSelected: setProposalSelected,
			updateProposal: updateProposal,
			updateAndSendProposal: updateAndSendProposal,
			deleteProposal: deleteProposal,
			uploadDocument: uploadDocument,
			deleteDocument: deleteDocument,
			disableProposal: disableProposal,
			enableProposal: enableProposal
		};

		function query() {
			return $http.get(API_URI_PREFIX + '/propostas/');
		}

		function myProposals(user_id) {
			return $http.get(API_URI_PREFIX + '/propostas/user/' + user_id + '/');
		}

		function createProposal(proposal) {
			return $http.post(API_URI_PREFIX + '/propostas/', {
					ente: UserService.getAuthenticatedAccount().ente.id,
					title: proposal.title,
					status: 'draft'
			});
		}

		function sendProposal(proposal) {
			return $http.post(API_URI_PREFIX + '/propostas/', {
					ente: UserService.getAuthenticatedAccount().ente.id,
					title: proposal.title,
					status: 'sended'
			});
		}

		function approveProposal(proposal) {
			return $http.put(API_URI_PREFIX + '/propostas/' + proposal.number + '/', {
					ente: proposal.ente,
					title: proposal.title,
					status: 'approved'
			});
		}

		function reproveProposal(proposal) {
			return $http.put(API_URI_PREFIX + '/propostas/' + proposal.number + '/', {
					ente: proposal.ente,
					title: proposal.title,
					status: 'reproved'
			});
		}

		function getProposal(number) {
			return $http.get(API_URI_PREFIX + '/propostas/' + number + '/');
		}

		function getProposalSelected() {
			return proposalSelected;
		}

		function setProposalSelected(proposal) {
			proposalSelected = proposal;
		}

		function updateProposal(proposal) {
			return $http.put(API_URI_PREFIX + '/propostas/' + proposal.number + '/', {
					ente: UserService.getAuthenticatedAccount().ente.id,
					title: proposal.title,
					status: proposal.status || 'draft'
			});
		}

		function updateAndSendProposal(proposal) {
			return $http.put(API_URI_PREFIX + '/propostas/' + proposal.number + '/', {
					ente: UserService.getAuthenticatedAccount().ente.id,
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

		function disableProposal(proposal) {
			return PROPOSAL_STATUS.block_update.indexOf(proposal.status) !== -1;
		}

		function enableProposal(proposal) {
			return PROPOSAL_STATUS.draft === proposal.status;
		}
	}
}());
