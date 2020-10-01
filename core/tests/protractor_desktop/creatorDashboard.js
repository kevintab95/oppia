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
 * @fileoverview End-to-end tests for the creator dashboard page.
 */

var general = require('../protractor_utils/general.js');
var users = require('../protractor_utils/users.js');
var workflow = require('../protractor_utils/workflow.js');

var CreatorDashboardPage =
  require('../protractor_utils/CreatorDashboardPage.js');
var ExplorationPlayerPage =
  require('../protractor_utils/ExplorationPlayerPage.js');
var LibraryPage = require('../protractor_utils/LibraryPage.js');
var SubscriptionDashboardPage =
  require('../protractor_utils/SubscriptionDashboardPage.js');

describe('Creator dashboard functionality', function() {
  var EXPLORATION_TITLE_1 = 'Exploration 1';
  var EXPLORATION_TITLE_2 = 'Exploration 2';
  var EXPLORATION_TITLE_3 = 'Exploration 3';
  var EXPLORATION_TITLE_4 = 'Exploration 4';
  var EXPLORATION_TITLE_5 = 'Exploration 5';
  var EXPLORATION_TITLE_6 = 'Exploration 6';
  var EXPLORATION_OBJECTIVE = 'To explore something';
  var EXPLORATION_CATEGORY = 'Algorithms';
  var EXPLORATION_LANGUAGE = 'English';

  var creatorDashboardPage = null;
  var explorationPlayerPage = null;
  var libraryPage = null;
  var subscriptionDashboardPage = null;
  var i=0;

  beforeAll(function() {
    libraryPage = new LibraryPage.LibraryPage();
    creatorDashboardPage = new CreatorDashboardPage.CreatorDashboardPage();
    explorationPlayerPage = new ExplorationPlayerPage.ExplorationPlayerPage();
    subscriptionDashboardPage =
      new SubscriptionDashboardPage.SubscriptionDashboardPage();
  });

  it('should create and login as users 0-25', async function() {
    while (i<25) {
      await users.createUser(`dummy${i}@creator.com`, `dummy${i}`);
      i++;
    }
  });

  it('should create and login as users 25-50', async function() {
    while (i<50) {
      await users.createUser(`dummy${i}@creator.com`, `dummy${i}`);
      i++;
    }
  });

  it('should create and login as users 50-75', async function() {
    while (i<75) {
      await users.createUser(`dummy${i}@creator.com`, `dummy${i}`);
      i++;
    }
  });

  it('should create and login as users 75-100', async function() {
    while (i<100) {
      await users.createUser(`dummy${i}@creator.com`, `dummy${i}`);
      i++;
    }
  });

  it('should create and login as users 100-125', async function() {
    while (i<125) {
      await users.createUser(`dummy${i}@creator.com`, `dummy${i}`);
      i++;
    }
  });

  it('should create and login as users 125-150', async function() {
    while (i<150) {
      await users.createUser(`dummy${i}@creator.com`, `dummy${i}`);
      i++;
    }
  });

  it('should create and login as users 150-175', async function() {
    while (i<175) {
      await users.createUser(`dummy${i}@creator.com`, `dummy${i}`);
      i++;
    }
  });

  it('should create and login as users 175-200', async function() {
    while (i<200) {
      await users.createUser(`dummy${i}@creator.com`, `dummy${i}`);
      i++;
    }
  });

  afterEach(async function() {
    await general.checkForConsoleErrors([]);
  });
});