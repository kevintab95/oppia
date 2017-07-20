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
 * @fileoverview Utility service for Hints in the learner's view.
 */

oppia.factory('SolutionManagerService', [
  '$timeout',
  function($timeout) {
    var solution = null;
    var solutionIsExhausted = false;
    var _getCurrentSolution = function() {
      return solution;
    };

    return {
      consumeSolution: function () {
        if (!solutionIsExhausted) {
          solutionIsExhausted = true;
          return _getCurrentSolution();
        }
      },
      isCurrentSolutionAvailable: function() {
        return solution && !solutionIsExhausted;
      },
      reset: function(newSolution) {
        solution = newSolution;
        solutionIsExhausted = false;
      }
    };
  }]);
