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
 * @fileoverview Controllers, services and filters for hints.
 */

oppia.controller('StateHints', [
  '$scope', '$rootScope', '$modal', '$filter', 'editorContextService',
  'alertsService', 'INTERACTION_SPECS', 'stateHintsService',
  'explorationStatesService', 'stateInteractionIdService',
  'UrlInterpolationService', 'HintObjectFactory',
  function(
    $scope, $rootScope, $modal, $filter, editorContextService,
    alertsService, INTERACTION_SPECS, stateHintsService,
    explorationStatesService, stateInteractionIdService,
    UrlInterpolationService, HintObjectFactory) {
    $scope.editorContextService = editorContextService;
    $scope.stateHintsService = stateHintsService;
    $scope.activeHintIndex = null;

    $scope.dragDotsImgUrl = UrlInterpolationService.getStaticImageUrl(
      '/general/drag_dots.png');

    $scope.$on('stateEditorInitialized', function(evt, stateData) {
      stateHintsService.init(
        editorContextService.getActiveStateName(),
          stateData.interaction.hints);

      $scope.activeHintIndex = null;
    });

    $scope.getHintSummary = function(hint) {
      var hintAsPlainText = (
        hint.hint_text.length ?
          $filter('convertToPlainText')(hint.hint_text) : '');
      return hintAsPlainText;
    };

    $scope.changeActiveHintIndex = function(newIndex) {
    // If the current hint is being clicked on again, close it.
      if (newIndex === $scope.activeHintIndex) {
        $scope.activeHintIndex = null;
      } else {
        $scope.activeHintIndex = newIndex;
      }
    };

    // This returns false if the current interaction ID is null.
    $scope.isCurrentInteractionLinear = function() {
      var interactionId = stateInteractionIdService.savedMemento;
      return interactionId && INTERACTION_SPECS[interactionId].is_linear;
    };

    $scope.openAddHintModal = function() {
      alertsService.clearWarnings();
      $rootScope.$broadcast('externalSave');

      $modal.open({
        templateUrl: 'modals/addHint',
        backdrop: true,
        controller: [
          '$scope', '$modalInstance', 'editorContextService',
          function($scope, $modalInstance, editorContextService) {
            $scope.HINT_FORM_SCHEMA = {
              type: 'html',
              ui_config: {}
            };

            $scope.tmpHint = HintObjectFactory.createDefault('');

            $scope.addHintForm = {};

            $scope.hintIndex = stateHintsService.displayed.length + 1;

            $scope.saveHint = function() {
              // Close the modal and save it afterwards.
              $modalInstance.close({
                hint: angular.copy($scope.tmpHint)
              });
            };

            $scope.cancel = function() {
              $modalInstance.dismiss('cancel');
              alertsService.clearWarnings();
            };
          }
        ]
      }).result.then(function(result) {
        stateHintsService.displayed.push(result.hint);
        stateHintsService.saveDisplayedValue();
      });
    };

    // When the page is scrolled so that the top of the page is above the
    // browser viewport, there are some bugs in the positioning of the helper.
    // This is a bug in jQueryUI that has not been fixed yet. For more details,
    // see http://stackoverflow.com/q/5791886
    $scope.HINT_LIST_SORTABLE_OPTIONS = {
      axis: 'y',
      cursor: 'move',
      handle: '.oppia-hint-sort-handle',
      items: '.oppia-sortable-hint',
      revert: 100,
      tolerance: 'pointer',
      start: function(e, ui) {
        $rootScope.$broadcast('externalSave');
        $scope.activeHintIndex = null;
        ui.placeholder.height(ui.item.height());
      },
      stop: function() {
        stateHintsService.saveDisplayedValue();
      }
    };

    $scope.deleteHint = function(index, evt) {
      // Prevent clicking on the delete button from also toggling the display
      // state of the answer group.
      evt.stopPropagation();

      alertsService.clearWarnings();
      $modal.open({
        templateUrl: 'modals/deleteHint',
        backdrop: true,
        controller: [
          '$scope', '$modalInstance', function($scope, $modalInstance) {
            $scope.reallyDelete = function() {
              $modalInstance.close();
            };

            $scope.cancel = function() {
              $modalInstance.dismiss('cancel');
              alertsService.clearWarnings();
            };
          }
        ]
      }).result.then(function() {
        stateHintsService.displayed.splice(index, 1);
        stateHintsService.saveDisplayedValue();
      });
    };

    $scope.onComponentSave = function() {
      stateHintsService.saveDisplayedValue();
    };
  }
]);
