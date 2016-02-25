(function () {
	'use strict';

	angular
		.module('procultApp')
		.factory('UtilsService', UtilsService);

	UtilsService.$inject = ['ACCEPTED_FORMAT_UPLOADS'];

	function UtilsService(ACCEPTED_FORMAT_UPLOADS) {
		return {
			accept_files: accept_files,
		};

		function accept_files () {
			return ACCEPTED_FORMAT_UPLOADS.join(',');
		}
	}
}());
