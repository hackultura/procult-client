(function() {
	'use strict';

	angular
	.module('procultApp')
	.controller('EditalController', EditalController)
	.controller('EditalUpdateController', EditalUpdateController)
	.controller('EditalNewController', EditalNewController)
	.controller('TagsController', TagsController)
	.controller('TagsNewController', TagsNewController)
	.controller('TagsUpdateController', TagsUpdateController)
	.controller('TagsEditalController', TagsEditalController);

	EditalController.$inject = ['EditalService', 'AlertService'];
	EditalNewController.$inject = ['EditalService', 'AlertService', '$state'];
	EditalUpdateController.$inject = ['EditalService', 'AlertService', '$state', '$stateParams'];
	TagsController.$inject = ['ProposalService', 'EditalService', 'AlertService'];
	TagsNewController.$inject = ['EditalService', 'AlertService', '$state'];
	TagsUpdateController.$inject = ['EditalService', 'AlertService', '$state', '$stateParams'];
	TagsEditalController.$inject = ['ProposalService', 'EditalService', 'AlertService','$state', '$stateParams'];

	/* @ngInject */
	function EditalController(EditalService, AlertService) {
		var vm = this;


		vm.editais = [];
		vm.errors = [];
		vm.hasOpenEdital = false;

		// Functions
		vm.init = init;
		vm.enableEnterEdital = enableEnterEdital;

		function init() {
			listEditais();
		}

		function listEditais() {
			EditalService.listEditais().then(function(response){
				vm.editais = response.data;
				checkDisableEdital();
			}, function(error){
				vm.errors = AlertService.message(error);
			});
		}

		function enableEnterEdital(edital) {
			return edital.is_available;
		}

		function checkDisableEdital() {
			if(vm.editais == null || vm.editais.length == 0)
				return;

			vm.hasOpenEdital = false;
			vm.editais.results.forEach(function(edital) {
				if(vm.enableEnterEdital(edital)) {
					vm.hasOpenEdital = true;
					return;
				}
			});
		}

	}

	/* @ngInject */
	function EditalNewController(EditalService, AlertService, $state) {
		var vm = this;

		vm.edital = {};
		vm.errors = [];

		// Functions
		vm.init = init;
		vm.createEdital = createEdital;

		function init() {
		}

		function createEdital() {
			if(vm.edital.is_available == null) {
				vm.edital.is_available = false;
			}
			EditalService.createEdital(vm.edital).then(function(){
				$state.transitionTo("admin.editais.painel");
			}, function(error) {
				console.log(vm.edital);
				vm.errors = AlertService.message(error);
			});
		}
	}

	/* @ngInject */
	function EditalUpdateController(EditalService, AlertService, $state, $stateParams) {
		var vm = this;

		vm.edital = {};
		vm.errors = [];

		// Functions
		vm.init = init;
		vm.updateEdital = updateEdital;

		function init() {
			EditalService.getEdital($stateParams.id).then(function(response) {
				vm.edital = response.data;
				console.log(vm.edital.is_available);
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

		function updateEdital() {
			if(vm.edital.is_available == null) {
				vm.edital.is_available = false;
			}
			EditalService.updateEdital(vm.edital).then(function(){
				$state.transitionTo("admin.editais.painel");
			}, function(error) {
				console.log(vm.edital);
				vm.errors = AlertService.message(error);
			});
		}
	}

	/* @ngInject */
	function TagsController(ProposalService, EditalService, AlertService) {
		var vm = this;

		// Functions
		vm.init = init;
		vm.nextPage = nextPage;
		vm.previousPage = previousPage;
    	vm.exportProposals = exportProposals;

		vm.tags = [];
		vm.errors = [];

		function init() {
			EditalService.queryAllTags().then(function(response) {
				vm.tags = response.data;
				console.log(vm.tags);
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

		function nextPage() {
			ProposalService.queryPaginate(vm.tags.next).then(function(response) {
				vm.tags = response.data;
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

		function previousPage() {
			ProposalService.queryPaginate(vm.tags.previous).then(function(response) {
				vm.tags = response.data;
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

	    function exportProposals() {
	      ProposalService.exportProposals();
	    }
	}

	/* @ngInject */
	function TagsNewController(EditalService, AlertService, $state) {
		var vm = this;

		vm.tag = {};
		vm.errors = [];

		// Functions
		vm.init = init;
		vm.createTags = createTags;

		function init() {
		}

		function createTags() {
			console.log(vm.tag);
			EditalService.createTags(vm.tag).then(function(){
				$state.transitionTo("admin.tags");
			}, function(error) {
				console.log(vm.edital);
				vm.errors = AlertService.message(error);
			});
		}
	}

	/* @ngInject */
	function TagsUpdateController(EditalService, AlertService, $state, $stateParams) {
		var vm = this;

		vm.tag = {};
		vm.errors = [];

		// Functions
		vm.init = init;
		vm.updateTags = updateTags;

		function init() {
			EditalService.getTag($stateParams.id).then(function(response) {
				vm.tag = response.data;
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

		function updateTags() {
			EditalService.updateTag(vm.tag).then(function(){
				$state.transitionTo("admin.tags");
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}
	}

	/* @ngInject */
	function TagsEditalController(ProposalService, EditalService, AlertService, $state, $stateParams) {
		var vm = this;

		// Functions
		vm.init = init;
		vm.tags = {};
		vm.allTags = {};
		vm.edital = {}

		vm.errors = [];

		vm.saveTags = saveTags;
		vm.getTagsId = getTagsId;
		vm.isTag = isTag;
		vm.setTags = setTags;

		function init() {
			EditalService.queryAllTags().then(function(response) {
				vm.allTags = response.data;
				EditalService.getEdital($stateParams.id).then(function(response) {
					vm.edital = response.data;
					setTags();
					console.log(vm.edital.tags_available);
				}, function(error) {
					vm.errors = AlertService.message(error);
				});
				// Get tags for this notice, than fill the lists
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

		function saveTags() {
			vm.edital.tags_available = getTagsId();
			console.log(vm.tags);
			console.log(vm.edital.tags_available);
			EditalService.updateEditalTags(vm.edital).then(function(){
				$state.transitionTo("admin.tags");
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

		function isTag(id) {
			if(vm.edital == null || vm.edital.tags_available == null) {
				return;
			}
			for(var i = 0; i < vm.edital.tags_available.length; i++) {
				if(vm.edital.tags_available[i] == id) return true;
			}
			return false;
		}

		function getTagsId() {
			var tag_ids = [];
			for(var id in vm.tags){				
				if(vm.tags[id] != false) {
					tag_ids.push(vm.tags[id]);
				}
			}
			return tag_ids;
		}

		function setTags() {
			console.log(vm.edital.tags_available);
			for(var id in vm.allTags.results){
				if( isTag(vm.allTags.results[id].id) ) {
					vm.tags[id] = vm.allTags.results[id].id;
				}
			}
		}
	}

})();
