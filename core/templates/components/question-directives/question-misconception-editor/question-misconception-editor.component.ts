// Copyright 2020 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Component for the question misconception editor.
 */

require('directives/angular-html-bind.directive.ts');

require('domain/utilities/url-interpolation.service.ts');
require(
  'components/state-editor/state-editor-properties-services/' +
  'state-editor.service.ts');
require(
  'components/question-directives/question-misconception-selector/' +
  'question-misconception-selector.component.ts');

angular.module('oppia').component('questionMisconceptionEditor', {
  bindings: {
    getTaggedSkillMisconceptionId: '&taggedSkillMisconceptionId',
    isEditable: '=',
    getOnSaveTaggedMisconception: '&onSaveTaggedMisconception',
    getOnSaveAnswerGroupFeedbackFn: '&onSaveAnswerGroupFeedback',
    outcome: '=',
    rules: '=',
  },
  template: require('./question-misconception-editor.component.html'),
  controller: [
    '$rootScope', '$uibModal', 'StateEditorService',
    'UrlInterpolationService',
    function(
        $rootScope, $uibModal, StateEditorService,
        UrlInterpolationService) {
      var ctrl = this;
      var _getTaggedMisconceptionName = function(skillMisconceptionId) {
        if (skillMisconceptionId) {
          if (typeof skillMisconceptionId === 'string' &&
              skillMisconceptionId.split('-').length === 2) {
            var skillId = skillMisconceptionId.split('-')[0];
            var misconceptionId = skillMisconceptionId.split('-')[1];
            var misconceptions = ctrl.misconceptionsBySkill[skillId];

            for (var i = 0; i < misconceptions.length; i++) {
              if (misconceptions[i].getId().toString() ===
                misconceptionId) {
                ctrl.misconceptionName = misconceptions[i].getName();
                ctrl.selectedMisconception = misconceptions[i];
                ctrl.selectedMisconceptionSkillId = skillId;
              }
            }
          } else {
            throw new Error(
              'Expected skillMisconceptionId to be ' +
              '<skillId>-<misconceptionId>.');
          }
        }
      };

      ctrl.containsMisconceptions = function() {
        var containsMisconceptions = false;
        Object.keys(ctrl.misconceptionsBySkill).forEach(function(skillId) {
          if (ctrl.misconceptionsBySkill[skillId].length > 0) {
            containsMisconceptions = true;
          }
        });
        return containsMisconceptions;
      };

      ctrl.tagAnswerGroupWithMisconception = function() {
        var taggedSkillMisconceptionId = (
          ctrl.getTaggedSkillMisconceptionId());
        var modalInstance = $uibModal.open({
          templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
            '/pages/topic-editor-page/modal-templates/' +
            'tag-misconception-modal.template.html'),
          backdrop: true,
          controller: [
            '$scope', '$uibModalInstance', 'StateEditorService',
            function($scope, $uibModalInstance, StateEditorService) {
              $scope.misconceptionsBySkill = (
                StateEditorService.getMisconceptionsBySkill());
              $scope.tempSelectedMisconception = null;
              $scope.tempSelectedMisconceptionSkillId = null;
              $scope.tempMisconceptionFeedbackIsUsed = true;
              $scope.taggedSkillMisconceptionId = (
                taggedSkillMisconceptionId);

              $scope.done = function() {
                $uibModalInstance.close({
                  misconception: $scope.tempSelectedMisconception,
                  misconceptionSkillId: $scope.tempSelectedMisconceptionSkillId,
                  feedbackIsUsed: $scope.tempMisconceptionFeedbackIsUsed
                });
              };

              $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
              };
            }
          ]
        });

        modalInstance.result.then(function(returnObject) {
          var misconception = returnObject.misconception;
          var misconceptionSkillId = returnObject.misconceptionSkillId;
          var feedbackIsUsed = returnObject.feedbackIsUsed;
          ctrl.selectedMisconception = misconception;
          ctrl.selectedMisconceptionSkillId = misconceptionSkillId;
          ctrl.feedbackIsUsed = feedbackIsUsed;
          ctrl.updateMisconception();
        }, function() {
          // Note to developers:
          // This callback is triggered when the Cancel button is clicked.
          // No further action is needed.
        });
      };

      ctrl.updateMisconception = function() {
        var skillId = ctrl.selectedMisconceptionSkillId;
        var misconceptionId = ctrl.selectedMisconception.getId();
        ctrl.getOnSaveTaggedMisconception()(misconceptionId, skillId);
        _getTaggedMisconceptionName(`${skillId}-${misconceptionId}`);
        var outcome = angular.copy(ctrl.outcome);
        if (ctrl.feedbackIsUsed) {
          outcome.feedback.setHtml(
            ctrl.selectedMisconception.getFeedback());
          ctrl.getOnSaveAnswerGroupFeedbackFn()(outcome);
          $rootScope.$broadcast('externalSave');
        }
        ctrl.misconceptionEditorIsOpen = false;
      };

      ctrl.editMisconception = function() {
        ctrl.misconceptionEditorIsOpen = true;
      };

      ctrl.$onInit = function() {
        ctrl.misconceptionName = null;
        ctrl.selectedMisconception = null;
        ctrl.selectedMisconceptionSkillId = null;
        ctrl.misconceptionsBySkill = (
          StateEditorService.getMisconceptionsBySkill());
        _getTaggedMisconceptionName(ctrl.getTaggedSkillMisconceptionId());
        ctrl.feedbackIsUsed = true;
      };
    }
  ]
});
