(function() {
	'use strict';

	angular
		.module('app')
		.controller('laporan-status-sppd.ctrl', Controller);

	function Controller($q, $scope, $rootScope, $state, $uibModal, abstractPage, helper, dataservice) {
		$rootScope.isGrey = false;
		var vm = this;
		vm.listData = [];

		abstractPage.startCtrl().then(activate);
		function activate(startDate, endDate) {
			if (!startDate) vm.startDate = null;
			if (!endDate) vm.endDate = null;
			vm.search = '';

			var promises = [ dataservice.getAllStateSPPD( startDate, endDate ) ];
			$q.all( promises ).then( afterGetAll );
			function afterGetAll( responses ) {
				vm.listData = responses[0];
				_.forEach( vm.listData, function( data ) {
					dataservice.getSPPDOfficer( data.id ).then( afterGetSPPDOfficer );
					function afterGetSPPDOfficer( officers ) {
						data.officers = officers;
					}
					if ( data.state === '0') data.status = 'Hapus/Batal';
					if ( data.state === '1') data.status = 'Entry Surat Tugas';
					if ( data.state === '2') data.status = 'Entry SPD';
					if ( data.state === '3') data.status = 'Entry Biaya Dinas';
					if ( data.state === '4') data.status = 'Entry Bukti Kas';
					if ( data.state === '5') data.status = 'Entry Hasil Dinas';
					if ( data.state === '6') data.status = 'Selesai';
				});
				console.log(vm.listData);
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