// Copyright 2014 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Controllers for the exploration graph.
 */

oppia.controller('ExplorationGraph', [
  '$scope', '$uibModal', 'EditorStateService', 'AlertsService',
  'explorationStatesService', 'editabilityService', 'RouterService',
  'graphDataService', 'UrlInterpolationService',
  function(
    $scope, $uibModal, EditorStateService, AlertsService,
    explorationStatesService, editabilityService, RouterService,
    graphDataService, UrlInterpolationService) {
    $scope.getGraphData = graphDataService.getGraphData;
    $scope.isEditable = editabilityService.isEditable;

    // We hide the graph at the outset in order not to confuse new exploration
    // creators.
    $scope.isGraphShown = function() {
      return Boolean(explorationStatesService.isInitialized() &&
        explorationStatesService.getStateNames().length > 1);
    };

    $scope.deleteState = function(deleteStateName) {
      explorationStatesService.deleteState(deleteStateName);
    };

    $scope.onClickStateInMinimap = function(stateName) {
      RouterService.navigateToMainTab(stateName);
    };

    $scope.getActiveStateName = function() {
      return EditorStateService.getActiveStateName();
    };

    $scope.openStateGraphModal = function() {
      AlertsService.clearWarnings();

      $uibModal.open({
        templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
          '/pages/exploration_editor/editor_tab/' +
          'exploration_graph_modal_directive.html'),
        backdrop: true,
        resolve: {
          isEditable: function() {
            return $scope.isEditable;
          }
        },
        windowClass: 'oppia-large-modal-window',
        controller: [
          '$scope', '$uibModalInstance', 'EditorStateService',
          'graphDataService', 'isEditable',
          function($scope, $uibModalInstance, EditorStateService,
                   graphDataService, isEditable) {
            $scope.currentStateName = EditorStateService.getActiveStateName();
            $scope.graphData = graphDataService.getGraphData();
            $scope.isEditable = isEditable;

            $scope.deleteState = function(stateName) {
              $uibModalInstance.close({
                action: 'delete',
                stateName: stateName
              });
            };

            $scope.selectState = function(stateName) {
              $uibModalInstance.close({
                action: 'navigate',
                stateName: stateName
              });
            };

            $scope.cancel = function() {
              $uibModalInstance.dismiss('cancel');
              AlertsService.clearWarnings();
            };
          }
        ]
      }).result.then(function(closeDict) {
        if (closeDict.action === 'delete') {
          explorationStatesService.deleteState(closeDict.stateName);
        } else if (closeDict.action === 'navigate') {
          $scope.onClickStateInMinimap(closeDict.stateName);
        } else {
          console.error('Invalid closeDict action: ' + closeDict.action);
        }
      });
    };
  }
]);
