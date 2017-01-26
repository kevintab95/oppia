// Copyright 2015 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Controller for the learner's view of a collection.
 */

oppia.constant(
  'COLLECTION_DATA_URL_TEMPLATE', '/collection_handler/data/<collection_id>');

oppia.animation('.oppia-collection-animate-slide', function() {
  return {
    enter: function(element) {
      element.hide().slideDown();
    },
    leave: function(element) {
      element.slideUp();
    }
  };
});

oppia.controller('CollectionPlayer', [
  '$scope', '$http', 'ReadOnlyCollectionBackendApiService',
  'CollectionObjectFactory', 'CollectionPlaythroughObjectFactory',
  'alertsService', 'UrlInterpolationService',
  function($scope, $http, ReadOnlyCollectionBackendApiService,
    CollectionObjectFactory, CollectionPlaythroughObjectFactory,
    alertsService, UrlInterpolationService) {
    $scope.collection = null;
    $scope.collectionPlaythrough = null;
    $scope.collectionId = GLOBALS.collectionId;
    $scope.showingAllExplorations = !GLOBALS.isLoggedIn;
    $scope.previewCardIsShown = true;
    $scope.getStaticImageUrl = UrlInterpolationService.getStaticImageUrl;
    $scope.pathIconParameters = [];

    $scope.setIconHighlight = function(index) {
      document.getElementById('highlight' + index).setAttribute('class','ng-show');
    };

    $scope.unsetIconHighlight = function(index) {
      document.getElementById('highlight' + index).setAttribute('class','ng-hide');
    };

    $scope.togglePreviewCard = function() {
      $scope.previewCardIsShown = !$scope.previewCardIsShown;
    };

    $scope.getCollectionNodeForExplorationId = function(explorationId) {
      var collectionNode = (
        $scope.collection.getCollectionNodeByExplorationId(explorationId));
      if (!collectionNode) {
        alertsService.addWarning('There was an error loading the collection.');
      }
      return collectionNode;
    };

    $scope.getCollectionNodesForExplorationIds = function(explorationIds) {
      var collectionNodes = [];
      for (var i = 0; i < explorationIds.length; i++) {
        collectionNodes[i] = $scope.getCollectionNodeForExplorationId(
          explorationIds[i]);
      }
      return collectionNodes;
    };

    $scope.getNextRecommendedCollectionNodes = function() {
      return $scope.getCollectionNodesForExplorationIds(
        $scope.collectionPlaythrough.getNextExplorationIds());
    };

    $scope.getCompletedExplorationNodes = function() {
      return $scope.getCollectionNodesForExplorationIds(
        $scope.collectionPlaythrough.getCompletedExplorationIds());
    };

    $scope.getNonRecommendedCollectionNodeCount = function() {
      return $scope.collection.getCollectionNodeCount() - (
        $scope.collectionPlaythrough.getNextRecommendedCollectionNodeCount() +
        $scope.collectionPlaythrough.getCompletedExplorationNodeCount());
    };

    $scope.getNonRecommendedCollectionNodes = function() {
      var displayedExplorationIds = (
        $scope.collectionPlaythrough.getNextExplorationIds().concat(
          $scope.collectionPlaythrough.getCompletedExplorationIds()));
      var nonRecommendedCollectionNodes = [];
      var collectionNodes = $scope.collection.getCollectionNodes();
      for (var i = 0; i < collectionNodes.length; i++) {
        var collectionNode = collectionNodes[i];
        var explorationId = collectionNode.getExplorationId();
        if (displayedExplorationIds.indexOf(explorationId) === -1) {
          nonRecommendedCollectionNodes.push(collectionNode);
        }
      }
      return nonRecommendedCollectionNodes;
    };

    $scope.toggleShowAllExplorations = function() {
      $scope.showingAllExplorations = !$scope.showingAllExplorations;
    };

    $scope.updateExplorationPreview = function(explorationId) {
      $scope.previewCardIsShown = false;
      $scope.currentExplorationId = explorationId;
      $scope.summaryToPreview = $scope.getCollectionNodeForExplorationId(
        explorationId).getExplorationSummaryObject();
    };

    $scope.generatePathParameters = function() {
      var pathSvgParameters = "M250 80  C 500 100, 500 280, 250 300"
      var collectionNodeCount = $scope.collection.getCollectionNodeCount()
      var sParameterExtension = ""
      $scope.svgHeight = 220
      if (collectionNodeCount === 1) {
        $scope.pathIconParameters = $scope.generatePathIconParameters();
        return ""
      }
      else if(collectionNodeCount === 2) {
        $scope.pathIconParameters = $scope.generatePathIconParameters();
        return pathSvgParameters
      }
      else {
        var y = 500;
        for(var i = 1; i < Math.floor(collectionNodeCount / 2) ; i++) {
          if(i % 2 === 0) {
            x = 500
          }
          else {
            x = 0
          }
          sParameterExtension += x + " " + y + ", "
          y += 20
          sParameterExtension += 250 + " " + y + ", "
          y += 200
        }
        pathSvgParameters += " S " + sParameterExtension
      }
        if(collectionNodeCount % 2 === 0) {
          $scope.svgHeight = y - 280;
        }
        else {
          $scope.svgHeight = y - 150;
        }
        $scope.pathIconParameters = $scope.generatePathIconParameters();
        return pathSvgParameters
    };

    $scope.generatePathIconParameters = function() {
      var collectionNodes = $scope.collection.getCollectionNodes();
      var arr = [];
      arr.push({
          thumbnailIconUrl: collectionNodes[0].getExplorationSummaryObject().thumbnail_icon_url,
          left: '225px',
          top: '60px',
          thumbnailBgColor: collectionNodes[0].getExplorationSummaryObject().thumbnail_bg_color
        });
      var x = 225;
      var y = 60;
      var count = 1;

      for (var i=1; i<$scope.collection.getCollectionNodeCount(); i++) {
        if (count === 0 && x === 225) {
          x = 30;
          y += 110;
          count = 1;
        }
        else if (count === 1 && x === 225) {
          x = 420;
          y += 110;
          count = 0;
        }
        else {
          x = 225;
          y += 110;
        }
        arr.push({
          thumbnailIconUrl: collectionNodes[i].getExplorationSummaryObject().thumbnail_icon_url,
          left: x + 'px',
          top: y + 'px',
          thumbnailBgColor: collectionNodes[i].getExplorationSummaryObject().thumbnail_bg_color
        });
      }
      return arr;
    };

    $http.get('/collectionsummarieshandler/data', {
      params: {
        stringified_collection_ids: JSON.stringify([$scope.collectionId])
      }
    }).then(
      function(response) {
        $scope.collectionSummary = response.data.summaries[0];
      },
      function() {
        alertsService.addWarning(
          'There was an error while fetching the collection summary.');
      }
    );

    // Load the collection the learner wants to view.
    ReadOnlyCollectionBackendApiService.loadCollection(
      $scope.collectionId).then(
      function(collectionBackendObject) {
        $scope.collection = CollectionObjectFactory.create(
          collectionBackendObject);
        $scope.collectionPlaythrough = (
          CollectionPlaythroughObjectFactory.create(
            collectionBackendObject.playthrough_dict));
      },
      function() {
        // TODO(bhenning): Handle not being able to load the collection.
        // NOTE TO DEVELOPERS: Check the backend console for an indication as to
        // why this error occurred; sometimes the errors are noisy, so they are
        // not shown to the user.
        alertsService.addWarning(
          'There was an error loading the collection.');
      }
    );
  }
]);
