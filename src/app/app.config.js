(function () {
	'use strict';

	angular
		.module('procultApp')
		.config(appConfig)
		.run(runConfig);


	appConfig.$inject = [
		'$httpProvider',
		'$stateProvider',
		'$urlRouterProvider',
		'$mdThemingProvider',
		'cfpLoadingBarProvider'
	];

	runConfig.$inject = ['$rootScope', '$state', '$http', '$cookies', 'UserService'];

	function appConfig($httpProvider, $stateProvider, $urlRouterProvider,
										 $mdThemingProvider, cfpLoadingBarProvider) {
		// Define CSRF
		$httpProvider.defaults.xsrfCookieName = 'csrftoken';
		$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

		// Customize loading
		cfpLoadingBarProvider.includeSpinner = false;
		cfpLoadingBarProvider.latencyThreshold = 500;

		// Define default router
		$urlRouterProvider.otherwise('/login');

		// Router templates base
		$stateProvider
			.state('admin', {
				abstract: true,
				views: {
					'@': {
						templateUrl: 'pages/layouts/admin.html'
					},
					'header@admin': {
						templateUrl: 'pages/header.html',
						controller: 'HeaderController',
						controllerAs: 'vm'
					},
					'sidenav@admin': {
						templateUrl: 'pages/sidenav.html',
						controller: 'SidenavController',
						controllerAs: 'vm'
					},
					'main@admin':  {templateUrl: 'pages/main.html'}
				},
				data: {
					pageClasses: ''
				}
			})
			.state('simple', {
				abstract: true,
				views: {
					'@': {
						templateUrl: 'pages/layouts/simple.html'
					},
					'main@simple':  {templateUrl: 'pages/main.html'}
				},
				data: {
					pageClasses: ''
				}
			});

			// Routes of system
			$stateProvider.state('admin.propostas', {
				parent: 'admin',
				url: '/propostas',
				authenticate: true,
				views: {
					'content@admin': {
						templateUrl: 'proposal/proposal.html'
					}
				},
				data: {
					title: 'Minhas Propostas'
				}
			})
			.state('admin.propostas.novo', {
				parent: 'admin',
				url: '/propostas/novo',
				authenticate: true,
				views: {
					'content@admin': {
						templateUrl: 'proposal/proposal_new.html'
					}
				},
				data: {
					title: 'Nova Proposta'
				}
			})
			.state('admin.propostas.editar', {
				parent: 'admin',
				url: '/propostas/atualizar/:number',
				authenticate: true,
				views: {
					'content@admin': {
						templateUrl: 'proposal/proposal_update.html'
					}
				},
				data: {
					title: 'Atualizar Proposta'
				}
			})
			.state('admin.propostas.analise', {
				parent: 'admin',
				url: '/propostas/analise',
				authenticate: true,
				admin: true,
				views: {
					'content@admin': {
						templateUrl: 'proposal/proposal_analysis.html'
					}
				},
				data: {
					title: 'Propostas Enviadas'
				}
			})
			.state('admin.propostas.analise.detalhe', {
				parent: 'admin',
				url: '/propostas/analise/:number',
				authenticate: true,
				admin: true,
				views: {
					'content@admin': {
						templateUrl: 'proposal/proposal_detail.html'
					}
				},
				data: {
					title: 'Detalhe da Proposta'
				}
			})
			.state('admin.usuarios', {
				parent: 'admin',
				authenticate: true,
				admin: true,
				url: '/usuarios',
				views: {
					'content@admin': {
						templateUrl: 'user/user_list.html'
					}
				},
				data: {
					title: 'Usuários'
				}
			})
			.state('admin.usuarios.novo', {
				parent: 'admin',
				authenticate: true,
				admin: true,
				url: '/usuarios/novo',
				views: {
					'content@admin': {
						templateUrl: 'user/register.html'
					}
				},
				data: {
					title: 'Registro'
				}
			})
			.state('admin.usuarios.editar', {
				parent: 'admin',
				authenticate: true,
				admin: true,
				url: '/usuarios/:id/atualizar',
				views: {
					'content@admin': {
						templateUrl: 'user/user_update.html'
					}
				}
			})
			.state('admin.perfil', {
				parent: 'admin',
				authenticate: true,
				admin: false,
				url: '/usuarios/:id/perfil',
				views: {
					'content@admin': {
						templateUrl: 'user/user_profile.html'
					}
				},
				data: {
					title: 'Perfil do Usuário'
				}
			})
			.state('admin.change_password', {
				parent: 'admin',
				authenticate: true,
				admin: false,
				url: '/usuarios/:id/senha/alterar',
				views: {
					'content@admin': {
						templateUrl: 'user/user_changepassword.html'
					}
				},
				data: {
					title: 'Perfil do Usuário'
				}
			})
			.state('simple.register', {
				parent: 'simple',
				url: '/registro',
				authenticate: false,
				admin: false,
				views: {
					'content@simple': {
						templateUrl: 'user/register.html'
					}
				},
				data: {
					title: 'Registro'
				}
			})
			.state('simple.login', {
				parent: 'simple',
				url: '/login',
				authenticate: false,
				admin: false,
				views: {
					'content@simple': {
						templateUrl: 'user/login.html'
					}
				},
				data: {
						title: 'Login de Acesso',
						pageClasses: 'login login_bg'
				}
			});

			$mdThemingProvider.theme('default')
			.primaryPalette('blue')
			.accentPalette('light-green');
		}

		function runConfig($rootScope, $state, $http, $cookies, UserService) {
			// Config CSRF Token
			$http.defaults.headers.common['X-CSRFToken'] = $cookies.get('csrftoken');

			// Verify if user is authenticated
			$rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
				if(toState.authenticate && !UserService.isAuthenticated()) {
					$state.nextState = {};
					$state.nextState.name = toState.name;
					$state.nextState.params = toParams;

					$state.transitionTo('simple.login');
					event.preventDefault();
				}

				if(toState.admin && !UserService.isAdmin()) {
					$state.transitionTo('admin.propostas');
					event.preventDefault();
				}
			});

			// Assign values to $rootScope made in data on router states
			$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
				$state.previous = {};
				$state.previous.name = fromState.name;
				$state.previous.params = fromParams;

				$rootScope.title = toState.data.title;
				$rootScope.pageClasses = toState.data.pageClasses;
			});

			$rootScope.back = function() {
				$state.go($state.previous.name, $state.previous.params);
			};
		}
}());
