(function() {
  'use strict';

  angular
    .module('procultApp')
    .controller('UserController', UserController)
    .controller('UserProfileController', UserProfileController)
    .controller('UserRegisterController', UserRegisterController)
    .controller('UserUpdateController', UserUpdateController)
    .controller('UserDeleteController', UserDeleteController)
    .controller('UserChangePasswordController', UserChangePasswordController)
    .controller('LoginController', LoginController);

  UserController.$inject = ['$mdDialog', 'UserService', 'AlertService'];
  UserProfileController.$inject = ['$state', '$stateParams', 'UserService', 'AlertService'];
  UserRegisterController.$inject = ['UserService', 'AlertService', '$state'];
  UserUpdateController.$inject = ['$state', '$stateParams', '$filter', 'UserService', 'AlertService'];
  UserDeleteController.$inject = ['$state', '$mdDialog', 'UserService', 'AlertService'];
  UserChangePasswordController.$inject = ['$state', '$stateParams', 'UserService', 'AlertService'];
  LoginController.$inject = ['$state', 'UserService', 'ProposalService'];

  /* @ngInject */
  function UserController($mdDialog, UserService, AlertService) {
    var vm = this;

    vm.users = [];
    vm.errors = [];

    vm.init = init;
    vm.deleteDialog = deleteDialog;
    vm.nextPage = nextPage;
    vm.previousPage = previousPage;

    function init() {
      listUsers();
    }

    function deleteDialog(event, user) {
      $mdDialog.show({
        controller: UserDeleteController,
        controllerAs: 'vm',
        templateUrl: 'user/user_delete.tmpl.html',
        parent: angular.element(document.body),
        locals: {user: user},
        bindToController: true,
        targetEvent: event,
        clickOutsideToClose: false
      }).then(function() {
        listUsers();
      });
    }

    function nextPage() {
      UserService.queryPaginate(vm.users.next).then(function(response) {
        vm.users = response.data;
      }, function(error) {
        vm.errors = AlertService.message(error);
      });
    }

    function previousPage() {
      UserService.queryPaginate(vm.users.previous).then(function(response) {
        vm.users = response.data;
      }, function(error) {
        vm.errors = AlertService.message(error);
      });
    }

    function listUsers() {
      UserService.query().then(function(response){
        vm.users = response.data;
      }, function(erro){
        vm.errors = AlertService.message(erro);
      });
    }
  }

  /* @ngInject */
  function UserProfileController($state, $stateParams, UserService, AlertService) {
    var vm = this;

    vm.user = {};
    vm.errors = [];

    vm.init = init;
    vm.saveProfile = saveProfile;
    vm.saveAdminProfile = saveAdminProfile;

    function init() {
      UserService.getUser($stateParams.id).then(function(response) {
        vm.user = response.data;
      }, function(error) {
        vm.errors = AlertService.message(error);
      });
    }

    function saveProfile() {
      updateProfile();
    }

    function saveAdminProfile() {
      delete vm.user.ente;
    }

    function updateProfile() {
      UserService.updateUser($stateParams.id, vm.user).then(function() {
        UserService.setAuthenticatedAccount(vm.user);
        if(vm.user.is_admin) {
          $state.go('admin.propostas.painel');
        } else {
          $state.go('admin.propostas');
        }
      }, function(error) {
        vm.errors = AlertService.message(error);
      });
    }
  }

  /* @ngInject */
  function UserRegisterController(UserService, AlertService, $state) {
    var vm = this;

    // Variables
    vm.profile = '';
    vm.user_admin = false;
    vm.user = {};
    vm.errors = [];

    //Functions
    vm.init = init;
    vm.setProfile = setProfile;
    vm.createUser = createUser;
    vm.createAdmin = createAdmin;

    function init() {
      if(UserService.getAuthenticatedAccount() !== undefined){
        vm.user_admin = UserService.getAuthenticatedAccount().is_admin;
      }
    }

    function setProfile(profile) {
      vm.profile = profile;
    }

    function createUser() {
      UserService.createUser(vm.user).then(function(){
        $state.transitionTo($state.previous.name, $state.previous.params);
      }, function(error) {
        vm.errors = AlertService.message(error);
      });
    }

    function createAdmin() {
      UserService.createAdmin(vm.user).then(function() {
        $state.transitionTo($state.previous.name, $state.previous.params);
      }, function(erro){
        vm.errors = AlertService.message(erro);
      });
    }
  }

  /* @ngInject */
  function UserUpdateController($state, $stateParams, $filter, UserService, AlertService) {
    var vm = this;

    vm.init = init;
    vm.updateUser = updateUser;

    vm.user = {};
    vm.errors = [];

    function init() {
      UserService.getUser($stateParams.id).then(function(response) {
        vm.user = response.data;
        vm.user = filterUserData(vm.user);
      }, function(error) {
        vm.errors = AlertService.message(error);
      });
    }

    function updateUser() {
      UserService.updateUser($stateParams.id, vm.user).then(function() {
        $state.go('admin.usuarios');
      }, function(error) {
        vm.errors = AlertService.message(error);
      });
    }

    function filterUserData(user) {
      user.ente.cpf = $filter('brCpf')(user.ente.cpf);
      user.ente.cnpj = $filter('brCnpj')(user.ente.cnpj);
      return user;
    }
  }

  /* @ngInject */
  function UserDeleteController($state, $mdDialog, UserService, AlertService) {
    var vm = this;

    vm.errors = [];

    vm.deleteUser = deleteUser;
    vm.hide = hide;
    vm.cancel = cancel;

    function deleteUser() {
      UserService.removeUser(vm.user.id).then(function() {
        $mdDialog.hide();
      }, function(error) {
        vm.errors = AlertService.message(error);
      });
    }

    function hide() {
      $mdDialog.hide();
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }

  /* @ngInject */
  function UserChangePasswordController($state, $stateParams, UserService, AlertService) {
    var vm = this;

    vm.init = init;
    vm.changePassword = changePassword;

    vm.user = {};
    vm.errors = [];

    function init() {
      UserService.getUser($stateParams.id).then(function(response) {
        vm.user.email = response.data.email;
      }, function(error) {
        vm.errors = AlertService.message(error);
      });
    }

    function changePassword() {
      UserService.changePassword(
        $stateParams.id,
        vm.user.email,
        vm.user.old_password,
        vm.user.password1,
        vm.user.password2
      ).then(function() {
        UserService.unauthenticate();
        $state.transitionTo('simple.login');
      }, function(error) {
        vm.errors = AlertService.message(error);
      });
    }
  }

  /* @ngInject */
  function LoginController($state, UserService) {
    var vm = this;

    vm.user = {};
    vm.errors = [];

    vm.init = init;
    vm.login = login;

    function init() {
    }

    function login() {
      UserService.login(vm.user.email, vm.user.password).then(function(response){
        UserService.setAuthenticatedAccount(response.data);
        if (UserService.getAuthenticatedAccount().is_admin) {
          $state.go('admin.propostas.painel');
        } else {
          //$state.go('admin.propostas');
          $state.go('admin.comunicado');
        }
      }, function(error){
        if(error.status === -1) {
          vm.errors.push({msg: 'Ocorreu um problema no acesso a base de dados. Por favor, contacte a Secretaria de Cultura ou tente mais tarde.'});
        } else {
          vm.errors.push({msg: error.data.message});
        }
      });
    }
  }

})();
