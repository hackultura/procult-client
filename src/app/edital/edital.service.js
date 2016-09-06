(function () {
	'use strict';

	angular
		.module('procultApp')
		.factory('EditalService', EditalService);

	EditalService.$inject = [
		'$http',
    	'$window',
		'API_URI_PREFIX',
		'UserService',
	];

	function EditalService($http, $window, API_URI_PREFIX, UserService) {
		return {
			listEditais: listEditais,
			getEdital: getEdital,
			createEdital: createEdital,
			updateEdital: updateEdital,
		};

		function listEditais() {
			return $http.get(API_URI_PREFIX + '/editais/');
		}

		function getEdital(number) {
			return $http.get(API_URI_PREFIX + '/edital/' + number + '/');
		}

		function createEdital(edital) {
			return $http.post(API_URI_PREFIX + '/editais/', {
					title: edital.title,
					description: edital.description,
					is_available: edital.is_available,
			});
		}

		function updateEdital(edital) {
			return $http.put(API_URI_PREFIX + '/edital/' + edital.id + '/', {
					title: edital.title,
					description: edital.description,
					is_available: edital.is_available,
			});
		}
	}
}());
