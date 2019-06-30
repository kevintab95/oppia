// Copyright 2016 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Unit tests for the count vectorizer service.
 */

describe('Count vectorizer service', function() {
  beforeEach(angular.mock.module('oppia'));

  describe('Test count vectorizer service', function() {
    var service;
    beforeEach(angular.mock.inject(function($injector) {
      service = $injector.get('CountVectorizerService');
    }));

    it('should produce correct vector from tokens', function() {
      var tokens = ['a', 'b', 'a', 'c', 'd', 'b', 'a'];
      var vocabulary = {
        a: 0, b: 1, c: 2
      };
      var vector = service.vectorize(tokens, vocabulary);
      var expectedVector = [3, 2, 1];
      expect(vector.length).toEqual(3);
      expect(vector).toEqual(expectedVector);
    });
  });
});
