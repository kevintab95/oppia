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
 * @fileoverview End-to-end tests for collections.
 */

var general = require('../protractor_utils/general.js');
var users = require('../protractor_utils/users.js');
var admin = require('../protractor_utils/admin.js');

describe('Collections', function() {
  beforeAll(function() {
    var USERNAME = 'aliceCollections';
    users.createAndLoginAdminUser('alice@collections.com', USERNAME);
    browser.get(general.ADMIN_URL_SUFFIX);
    element.all(by.css(
      '.protractor-test-reload-collection-button')).first().click();
    general.acceptAlert();
    browser.waitForAngular();
    admin.editConfigProperty(
      'Names of users allowed to use the collection editor',
      'List', function(listEditor) {
        listEditor.addItem('Unicode').setValue(USERNAME);
      }
    );
    users.logout();
  });

  it('visits the collection editor', function() {
    users.login('alice@collections.com');
    browser.get(general.SERVER_URL_PREFIX);
    var dropdown = element(by.css('.protractor-test-profile-dropdown'));
    browser.actions().mouseMove(dropdown).perform();
    dropdown.element(by.css('.protractor-test-dashboard-link')).click();
    browser.waitForAngular();
    element(by.css('.protractor-test-create-activity')).click();
    // Create new collection.
    element(by.css('.protractor-test-create-collection')).click();
    // Add existing explorations.
    element(by.css('.protractor-test-add-exploration-input')).sendKeys('0\n');
    element(by.css('.protractor-test-add-exploration-input')).sendKeys('4\n');
    element(by.css('.protractor-test-add-exploration-input')).sendKeys('13\n');
    // Shifting nodes in the node graph.
    element.all(by.css('.protractor-test-editor-shift-left')).get(1).click();
    element.all(by.css('.protractor-test-editor-shift-right')).get(1).click();
    // Delete node in the node graph.
    element.all(by.css('.protractor-test-editor-delete-node')).get(1).click();
    // Publish the collection.
    element(by.css('.protractor-test-save-draft-button')).click();
    element(by.css('.protractor-test-close-save-modal')).click();
    element(by.css('.protractor-test-editor-publish-button')).click();
    element(by.css('.protractor-collection-editor-title-input')
    ).sendKeys('Test Collection');
    element(by.css('.protractor-collection-editor-objective-input')
    ).sendKeys('This is a test collection.');
    var options = element.all(
      by.css('.protractor-test-collection-editor-category-dropdown')
    );
    options.first().click();
    browser.driver.switchTo().activeElement().sendKeys('Algebra\n');
    element(by.css('.protractor-test-collection-save-changes-button')).click();
    browser.waitForAngular();
    users.logout();
  });

  it('visits the collection player', function() {
    users.login('alice@collections.com');
    browser.get('/collection/0');
    browser.waitForAngular();
    users.logout();
  });

  afterEach(function() {
    general.checkForConsoleErrors([]);
  });
});
