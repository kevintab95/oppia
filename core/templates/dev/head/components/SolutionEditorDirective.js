// Copyright 2017 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Directive for the solution editor.
 */

oppia.directive('solutionEditor', [
  'UrlInterpolationService', function(UrlInterpolationService) {
    return {
      restrict: 'E',
      scope: {
        solution: '=',
        objectType: '=',
        ruleDescriptionChoices: '=',
        getOnSaveFn: '&onSave'
      },
      templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
        '/components/' + 'solution_editor_directive.html'),
      controller: [
        '$scope', 'editabilityService', function($scope, editabilityService) {
          $scope.isEditable = editabilityService.isEditable();

          $scope.editSolutionForm = {};
          $scope.solutionEditorIsOpen = false;

          $scope.solutionMemento = null;

          $scope.EXPLANATION_FORM_SCHEMA = {
            type: 'html',
            ui_config: {}
          };

          $scope.openSolutionEditor = function() {
            if ($scope.isEditable) {
              $scope.solutionMemento = angular.copy($scope.solution);
              $scope.solutionEditorIsOpen = true;
              $scope.solution.answerIsExclusive = (
                $scope.solution.answerIsExclusive.toString());
              if ($scope.objectType === 'RegionSelect') {
                $scope.solution.correctAnswer = (
                  $scope.solution.correctAnswer.clickedRegions[0]);
              }
            }
          };

          $scope.saveThisSolution = function() {
            $scope.solutionEditorIsOpen = false;
            $scope.solutionMemento = null;
            $scope.solution.answerIsExclusive = (
              $scope.solution.answerIsExclusive === 'true');
            $scope.getOnSaveFn()();
          };

          $scope.cancelThisSolutionEdit = function() {
            $scope.solution = angular.copy($scope.solutionMemento);
            $scope.solutionMemento = null;
            $scope.solutionEditorIsOpen = false;
          };

          $scope.$on('externalSave', function() {
            if ($scope.solutionEditorIsOpen &&
              $scope.editSolutionForm.$valid) {
              $scope.saveThisSolution();
            }
          });
        }
      ]
    };
  }]);
