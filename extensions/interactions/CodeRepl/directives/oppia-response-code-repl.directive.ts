// Copyright 2019 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Directive for the CodeRepl response.
 *
 * IMPORTANT NOTE: The naming convention for customization args that are passed
 * into the directive is: the name of the parameter, followed by 'With',
 * followed by the name of the arg.
 */

require('domain/utilities/url-interpolation.service.ts');
require('services/html-escaper.service.ts');
require('services/stateful/focus-manager.service.ts');

angular.module('oppia').directive('oppiaResponseCodeRepl', [
  'HtmlEscaperService', 'UrlInterpolationService',
  function(HtmlEscaperService, UrlInterpolationService) {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {},
      templateUrl: UrlInterpolationService.getExtensionResourceUrl(
        '/interactions/CodeRepl/directives/' +
        'code-repl-response.directive.html'),
      controllerAs: '$ctrl',
      controller: [
        '$attrs', 'FocusManagerService',
        function($attrs, FocusManagerService) {
          var ctrl = this;
          ctrl.$onInit = function() {
            ctrl.answer = HtmlEscaperService.escapedJsonToObj($attrs.answer);

            if (ctrl.answer.error) {
              ctrl.errorFocusLabel = FocusManagerService.generateFocusLabel();
              FocusManagerService.setFocus(ctrl.errorFocusLabel);
            }
          };
        }
      ]
    };
  }
]);
