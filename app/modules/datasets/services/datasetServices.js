angular.module('pcApp.datasets.services.dataset', [
    'ngResource', 'pcApp.config', 'ngStorage'
])

    .factory('creationService', [
        '$log', '$sessionStorage', function ($log, storage) {

            var result = {};

            var initData = {
                step: null,
                inputTable: {
                    instance: null,
                    settings: {
                        colHeaders: true,
                        rowHeaders: true,
                        minRows: 20,
                        minCols: 10,
                        contextMenu: true,
                        stretchH: 'all',
                        outsideClickDeselects: false
                    },
                    items: [[]]
                },
                resultTable: {
                    instance: null,
                    settings: {
                        autoColumnSize: true,
                        contextMenu: false,
                        stretchH: 'all',
                        outsideClickDeselects: false,
                        readOnly: false
                    },
                    items: []
                },
                classPreSelection: [],
                individualsOrder: [],
                individualSelection: [],
                individualSelectionBackup: [],
                individuals_suggestions: [],
                timeResolution: null,
                time: {
                    start: null,
                    end: null
                },
                indicator: [],
                timeSeries: null,
                dataset: {}
            };

            result.data = null;

            if (storage.newdataset) {
                result.data = storage.newdataset;
            } else {
                result.data = angular.copy(initData);
                storage.newdataset = result.data;
            }

            result.reset = function () {
                delete storage.newdataset;
                this.data = angular.copy(initData);
                storage.newdataset = this.data;
            };

            return result;
        }
    ]);
