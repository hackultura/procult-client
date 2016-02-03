(function () {
	'use strict';

	angular
		.module('procultApp')
		.factory('AlertService', AlertService);

	function AlertService() {
		var msgSuccess = {};
		var msgError = {};
		var msgInfo = {};
		var alert = false;
		return {
			success: success,
			error: error,
			info: info,
			hasAlert: hasAlert
		};

		function success(value) {
			msgSuccess = value;
			alert = true;
		}

		function error(value) {
			msgError = value;
			alert = true;
		}

		function info(value) {
			msgInfo = value;
			alert = true;
		}

		function hasAlert() {
			return alert;
		}
	}
}());
