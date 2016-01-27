(function () {
	'use strict';

	angular
		.module('procultApp')
		.config(appConfig)
		.run(runConfig);


	appConfig.$inject = [
		'$stateProvider',
		'$urlRouterProvider',
		'$mdThemingProvider'
	];

	runConfig.$inject = ['$rootScope', '$state'];

	function appConfig($stateProvider, $urlRouterProvider, $mdThemingProvider) {
		// Definindo a rota padrão
		$urlRouterProvider.otherwise('/propostas');

		// Os templates disponiveis no projeto, configurados para
		// serem herdado pelas rotas do sistema.
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

			// Todas as rotas do sistema
			$stateProvider.state('admin.propostas', {
				parent: 'admin',
				url: '/propostas',
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
				url: '/propostas/atualizar',
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
				views: {
					'content@admin': {
						templateUrl: 'proposal/proposal_analysis.html'
					}
				},
				data: {
					title: 'Propostas Enviadas'
				}
			})
			.state('admin.usuarios.lista', {
				parent: 'admin',
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
			.state('admin.usuarios', {
				parent: 'admin',
				url: '/usuarios/perfil',
				views: {
					'content@admin': {
						templateUrl: 'user/user_profile.html'
					}
				},
				data: {
					title: 'Perfil do Usuário'
				}
			})
			.state('admin.usuarios.novo', {
				parent: 'admin',
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
			.state('simple.register', {
				parent: 'simple',
				url: '/registro',
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

		function runConfig($rootScope, $state) {
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
