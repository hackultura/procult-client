(function () {
	'use strict';

	angular
		.module('procultApp')
		.factory('UtilsService', UtilsService);

	UtilsService.$inject = ['ACCEPTED_FORMAT_UPLOADS'];
	UtilsService.$inject = ['ADMIN_REGION'];

	function UtilsService(ACCEPTED_FORMAT_UPLOADS) {
		return {
			accept_files: accept_files,
		};

		function accept_files () {
			return ACCEPTED_FORMAT_UPLOADS.join(',');
		}
	}

	function UtilsService(ADMIN_REGION) {
		return {
			admin_regions: admin_regions,
		};

		function admin_regions () {
			return ADMIN_REGION;
		}
	}
}());
