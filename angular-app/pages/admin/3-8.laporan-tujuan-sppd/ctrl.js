(function() {
	'use strict';

	angular
		.module('app')
		.controller('laporan-tujuan-sppd.ctrl', Controller);

	function Controller($q, $scope, $rootScope, $state, $uibModal, abstractPage, helper, dataservice) {
		$rootScope.isGrey = false;
		var vm = this;
		vm.listData = [];

		abstractPage.startCtrl().then(activate);
		function activate(startDate, endDate) {
			if (!startDate) vm.startDate = null;
			if (!endDate) vm.endDate = null;
			vm.search = '';

			var promises = [ dataservice.getAllSPPDState6( startDate, endDate ), dataservice.getProvinsi(), dataservice.getKota() ];
			$q.all( promises ).then( afterGetAll );
			function afterGetAll( responses ) {
				vm.listData = responses[0];
				var provinsi = responses[1];
				var kota = responses[2];

				_.forEach( vm.listData, function( data ) {
					dataservice.getSPPDOfficer( data.id ).then( afterGetSPPDOfficer );
					function afterGetSPPDOfficer( officers ) {
						data.officers = officers;
					}

					var k = _.find(kota, function( c ) {
						return data.objective === c.name;
					});
					var p = _.find(provinsi, function( p ) {
						return k.province_id === p.id;
					});
					data.provinceName = p.name;
				});
			}
		}

		vm.printLembar = printLembar;
		function printLembar(no, id) {
			window.open('print-lembar-' + no + '.php?id=' + id, '_blank');
		}


		vm.startDate;
		vm.endDate;
		vm.endDateOpt = {};
		vm.startDateChanged = startDateChanged;
		vm.submitSearch = submitSearch;
		vm.resetSearch = resetSearch;
		function startDateChanged() {
			vm.endDateOpt.minDate = vm.startDate;
		}
		function submitSearch() {
			if ( vm.startDate && vm.endDate ) activate(moment(vm.startDate).format('YYYY-MM-DD'), moment(vm.endDate).format('YYYY-MM-DD'));
		}
		function resetSearch() {
			activate();
		}
	}

})();