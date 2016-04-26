/*
 * Copyright 2016-present Open Networking Laboratory
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 ONOS GUI -- Control Plane Manager View Module
 */
(function () {
    'use strict';

    // injected references
    var $log, $scope, $location, ks, fs, cbs, ns;

    var hasDeviceId;

    var labels = new Array(1);
    var data = new Array(6);
    for (var i = 0; i < 6; i++) {
        data[i] = new Array(1);
    }

    var date, max, merged;

    function ceil(num) {
        if (isNaN(num)) {
            return 0;
        }
        var pre = num.toString().length - 1
        var pow = Math.pow(10, pre);
        return (Math.ceil(num / pow)) * pow;
    }

    angular.module('ovCpman', ["chart.js"])
        .controller('OvCpmanCtrl',
        ['$log', '$scope', '$location', 'FnService', 'ChartBuilderService', 'NavService',

        function (_$log_, _$scope_, _$location_, _fs_, _cbs_, _ns_) {
            var params;
            $log = _$log_;
            $scope = _$scope_;
            $location = _$location_;
            fs = _fs_;
            cbs = _cbs_;
            ns = _ns_;

            params = $location.search();

            if (params.hasOwnProperty('devId')) {
                $scope.devId = params['devId'];
                hasDeviceId = true;
            } else {
                $scope.type = 'StackedBar';
                hasDeviceId = false;
            }

            cbs.buildChart({
                scope: $scope,
                tag: 'cpman',
                query: params
            });

            $scope.$watch('chartData', function () {
                if (!fs.isEmptyObject($scope.chartData)) {
                    $scope.showLoader = false;
                    var length = $scope.chartData.length;
                    labels = new Array(length);
                    for (var i = 0; i < 6; i++) {
                        data[i] = new Array(length);
                    }

                    $scope.chartData.forEach(function (cm, idx) {
                        data[0][idx] = cm.inbound_packet;
                        data[1][idx] = cm.outbound_packet;
                        data[2][idx] = cm.flow_mod_packet;
                        data[3][idx] = cm.flow_removed_packet;
                        data[4][idx] = cm.request_packet;
                        data[5][idx] = cm.reply_packet;

                        if(hasDeviceId) {
                            date = new Date(cm.label);
                            labels[idx] = date.getHours() + ":" + date.getMinutes();
                        } else {
                            labels[idx] = cm.label;
                        }
                    });
                }

                merged = [].concat.apply([], data);
                max = Math.max.apply(null, merged);
                $scope.labels = labels;
                $scope.data = data;
                $scope.options = {
                    scaleOverride : true,
                    scaleSteps : 10,
                    scaleStepWidth : ceil(max) / 10,
                    scaleStartValue : 0
                };
                $scope.onClick = function (points, evt) {
                    if (points[0]) {
                        // TODO: this will be replaced with real device id
                        var tmpId = 'of:000000000000020' + points[0].label;
                        ns.navTo('cpman', { devId: tmpId });
                        $log.log(points[0].label);
                    }
                };
            });

            $scope.series = ['INBOUND', 'OUTBOUND', 'FLOW-MOD',
                             'FLOW-REMOVED', 'STATS-REQUEST', 'STATS-REPLY'];
            $scope.labels = labels;
            $scope.data = data;

            $scope.chartColors = [
                      '#286090',
                      '#F7464A',
                      '#46BFBD',
                      '#FDB45C',
                      '#97BBCD',
                      '#4D5360',
                      '#8c4f9f'
                    ];
            Chart.defaults.global.colours = $scope.chartColors;

            $scope.showLoader = true;

            $log.log('OvCpmanCtrl has been created');
        }]);

}());
