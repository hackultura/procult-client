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

	runConfig.$inject = ['$rootScope', '$state', 'UserService'];

	function appConfig($stateProvider, $urlRouterProvider, $mdThemingProvider) {
		// Definindo a rota padrão
		$urlRouterProvider.otherwise('/login');

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

		function runConfig($rootScope, $state, UserService) {
			// Verify if user is authenticated
			$rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
				console.log('Verificando rota...');
				console.log('Usuario esta autenticado? ' + UserService.isAuthenticated());
				console.log(toState);
				if(toState.authenticate && !UserService.isAuthenticated()) {
					console.log('Nao esta autenticado. Indo para login...');
					$state.nextState = {};
					$state.nextState.name = toState.name;
					$state.nextState.params = toParams;

					$state.transitionTo('simple.login');
					event.preventDefault();
				}

				if(toState.admin && !UserService.isAdmin()) {
					console.log(UserService.isAdmin());
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
