(function() {
    'use strict';

    angular
        .module('procultApp')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['$mdSidenav'];

    /* @ngInject */
    function HeaderController($mdSidenav) {
        var vm = this;

        // Functions
        vm.toggleSidenav = toggleSidenav;

        function toggleSidenav(menu) {
            $mdSidenav(menu).toggle();
        }
    }
})();
