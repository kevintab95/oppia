// Copyright 2018 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Controller for the main topic editor.
 */

require(
  'pages/topic-editor-page/editor-tab/topic-editor-stories-list.directive.ts');

require('components/entity-creation-services/story-creation.service.ts');
require('domain/editor/undo_redo/undo-redo.service.ts');
require('domain/topic/topic-update.service.ts');
require('domain/utilities/url-interpolation.service.ts');
require('pages/topic-editor-page/services/topic-editor-state.service.ts');

angular.module('oppia').directive('topicEditorTab', [
  'UrlInterpolationService', function(UrlInterpolationService) {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
        '/pages/topic-editor-page/editor-tab/topic-editor-tab.directive.html'),
      controller: [
        '$scope', '$uibModal', '$timeout', 'TopicEditorStateService', 'TopicUpdateService',
        'UndoRedoService', 'UrlInterpolationService', 'StoryCreationService',
        'EVENT_STORY_SUMMARIES_INITIALIZED', 'EVENT_TOPIC_INITIALIZED',
        'EVENT_TOPIC_REINITIALIZED',
        function(
            $scope, $uibModal, $timeout, TopicEditorStateService, TopicUpdateService,
            UndoRedoService, UrlInterpolationService, StoryCreationService,
            EVENT_STORY_SUMMARIES_INITIALIZED, EVENT_TOPIC_INITIALIZED,
            EVENT_TOPIC_REINITIALIZED) {
          var _initEditor = function() {
            $scope.topic = TopicEditorStateService.getTopic();
            $scope.topicRights = TopicEditorStateService.getTopicRights();
            $scope.topicNameEditorIsShown = false;
            $scope.editableName = $scope.topic.getName();
            $scope.editableAbbreviatedName = $scope.topic.getAbbreviatedName();
            $scope.editableDescription = $scope.topic.getDescription();
            $scope.editableThumbnailDataUrl = $scope.topic.getThumbnail() || UrlInterpolationService.getStaticImageUrl('/icons/story-image-icon.png');
            $scope.editableDescriptionIsEmpty = (
              $scope.editableDescription === '');
            $scope.topicDescriptionChanged = false;
          };

          var _initStorySummaries = function() {
            $scope.canonicalStorySummaries =
              TopicEditorStateService.getCanonicalStorySummaries();
          };

          $scope.getStaticImageUrl = UrlInterpolationService.getStaticImageUrl;

          $scope.showEditThumbnailModal = function() {
            $uibModal.open({
              templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
                '/pages/topic-editor-page/modal-templates/' +
                'edit-topic-thumbnail-modal.template.html'),
              backdrop: true,
              controller: [
                '$scope', '$uibModalInstance', function(
                    $scope, $uibModalInstance) {
                  $scope.uploadedImage = null;
                  $scope.croppedImageDataUrl = '';
                  $scope.invalidImageWarningIsShown = false;

                  $scope.onFileChanged = function(file) {
                    $('.oppia-thumbnail-uploader').fadeOut(function() {
                      $scope.invalidImageWarningIsShown = false;

                      var reader = new FileReader();
                      reader.onload = function(e) {
                        $scope.$apply(function() {
                          $scope.uploadedImage = (<FileReader>e.target).result;
                        });
                      };
                      reader.readAsDataURL(file);

                      $timeout(function() {
                        $('.oppia-thumbnail-uploader').fadeIn();
                      }, 100);
                    });
                  };

                  $scope.reset = function() {
                    $scope.uploadedImage = null;
                    $scope.croppedImageDataUrl = '';
                  };

                  $scope.onInvalidImageLoaded = function() {
                    $scope.uploadedImage = null;
                    $scope.croppedImageDataUrl = '';
                    $scope.invalidImageWarningIsShown = true;
                  };

                  $scope.confirm = function() {
                    $uibModalInstance.close($scope.croppedImageDataUrl);
                  };

                  $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                  };
                }
              ]
            }).result.then(function(newThumbnailDataUrl) {
              $scope.editableThumbnailDataUrl = newThumbnailDataUrl;
              $scope.updateTopicThumbnail(newThumbnailDataUrl);
            });
          }

          $scope.createCanonicalStory = function() {
            if (UndoRedoService.getChangeCount() > 0) {
              $uibModal.open({
                templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
                  '/pages/topic-editor-page/modal-templates/' +
                  'topic-save-pending-changes-modal.template.html'),
                backdrop: true,
                controller: [
                  '$scope', '$uibModalInstance',
                  function($scope, $uibModalInstance) {
                    $scope.cancel = function() {
                      $uibModalInstance.dismiss('cancel');
                    };
                  }
                ]
              });
            } else {
              StoryCreationService.createNewCanonicalStory(
                $scope.topic.getId());
            }
          };

          $scope.updateTopicDescriptionStatus = function(description) {
            $scope.editableDescriptionIsEmpty = (description === '');
            $scope.topicDescriptionChanged = true;
          };

          $scope.updateTopicName = function(newName) {
            if (newName === $scope.topic.getName()) {
              return;
            }
            TopicUpdateService.setTopicName($scope.topic, newName);
            $scope.topicNameEditorIsShown = false;
          };

          $scope.updateAbbreviatedName = function(newAbbreviatedName) {
            if (newAbbreviatedName === $scope.topic.getAbbreviatedName()) {
              return;
            }
            TopicUpdateService.setAbbreviatedTopicName($scope.topic, newAbbreviatedName);
          };

          $scope.updateTopicThumbnail = function(newThumbnailDataUrl) {
            if (newThumbnailDataUrl === $scope.topic.getThumbnail()) {
              return;
            }
            TopicUpdateService.setThumbnailDataUrl($scope.topic, newThumbnailDataUrl);
          };

          $scope.updateTopicDescription = function(newDescription) {
            if (newDescription !== $scope.topic.getDescription()) {
              TopicUpdateService.setTopicDescription(
                $scope.topic, newDescription);
            }
          };

          $scope.$on(EVENT_TOPIC_INITIALIZED, _initEditor);
          $scope.$on(EVENT_TOPIC_REINITIALIZED, _initEditor);
          $scope.$on(EVENT_STORY_SUMMARIES_INITIALIZED, _initStorySummaries);

          _initEditor();
          _initStorySummaries();
        }
      ]
    };
  }]);
