(function() {
  'use strict';

  angular
  .module('procultApp')
  .controller('SidenavController', SidenavController);

  SidenavController.$inject = ['$state'];

  /* @ngInject */
  function SidenavController($state) {
    var vm = this;

    vm.menu = [
      {
        link : 'admin.propostas',
        title: 'Propostas',
        icon: 'dashboard'
      }
    ];

    vm.stateGo = stateGo;

    function stateGo() {
    }
  }
})();
