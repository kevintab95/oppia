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
 * @fileoverview End-to-end tests for additional features of the exploration
 * editor and player. Additional features include those features without which
 * an exploration can still be published. These include hints, solutions,
 * refresher explorations, state parameters, etc.
 */

var forms = require('../protractor_utils/forms.js');
var general = require('../protractor_utils/general.js');
var users = require('../protractor_utils/users.js');
var waitFor = require('../protractor_utils/waitFor.js');
var workflow = require('../protractor_utils/workflow.js');


var AdminPage = require('../protractor_utils/AdminPage.js');
var CollectionEditorPage =
  require('../protractor_utils/CollectionEditorPage.js');
var CreatorDashboardPage =
  require('../protractor_utils/CreatorDashboardPage.js');
var ExplorationEditorPage =
  require('../protractor_utils/ExplorationEditorPage.js');
var ExplorationPlayerPage =
  require('../protractor_utils/ExplorationPlayerPage.js');
var LibraryPage = require('../protractor_utils/LibraryPage.js');

describe('Full exploration editor', function() {
  var adminPage = null;
  var collectionEditorPage = null;
  var creatorDashboardPage = null;
  var explorationEditorPage = null;
  var explorationPlayerPage = null;
  var libraryPage = null;

  var explorationEditorMainTab = null;
  var explorationEditorSettingsTab = null;

  beforeAll(async function() {
    adminPage = new AdminPage.AdminPage();
    collectionEditorPage = new CollectionEditorPage.CollectionEditorPage();
    creatorDashboardPage = new CreatorDashboardPage.CreatorDashboardPage();
    explorationEditorPage = new ExplorationEditorPage.ExplorationEditorPage();
    explorationPlayerPage = new ExplorationPlayerPage.ExplorationPlayerPage();
    libraryPage = new LibraryPage.LibraryPage();

    explorationEditorMainTab = explorationEditorPage.getMainTab();
    explorationEditorSettingsTab = explorationEditorPage.getSettingsTab();
  });

  it('should walk through the tutorial when user repeatedly clicks Next',
    async function() {
      await users.createUser(
        'userTutorial@stateEditor.com', 'userTutorialStateEditor');
      await users.login('userTutorial@stateEditor.com');

      await workflow.createExplorationAndStartTutorial();
      await explorationEditorMainTab.startTutorial();
      await explorationEditorMainTab.playTutorial();
      await explorationEditorMainTab.finishTutorial();
      await users.logout();
    }
  );

  it('should reflect skills and goal in exploration editor settings',
    async function() {
      await users.createUser('user@editorAndPlayer.com', 'userEditorAndPlayer');
      await users.login('user@editorAndPlayer.com');
      const EXPLORATION_OBJECTIVE =
      'Let us learn how to add fractions in an amazing way';
      const EXPLORATION_TITLE = 'Fractions';
      const EXPLORATION_CATEGORY = 'Mathematics';
      const EXPLORATION_LANGUAGE = 'Deutsch';
      const EXPLORATION_TAGS = ['maths', 'english', 'fractions', 'addition'];
      await workflow.createAddExpDetailsAndPublishExp(
        EXPLORATION_TITLE,
        EXPLORATION_CATEGORY,
        EXPLORATION_OBJECTIVE,
        EXPLORATION_LANGUAGE,
        EXPLORATION_TAGS);
      await explorationEditorPage.navigateToSettingsTab();
      await explorationEditorPage.verifyExplorationSettingFields(
        EXPLORATION_TITLE,
        EXPLORATION_CATEGORY,
        EXPLORATION_OBJECTIVE,
        EXPLORATION_LANGUAGE,
        EXPLORATION_TAGS
      );
      await users.logout();
    });

  it('should report an exploration to moderators', async function() {
    var EXPLORATION_OBJECTIVE = 'Let us learn how to add fractions';
    await users.createUser(
      'creator@editorAndPlayer.com', 'creatorEditorAndPlayer');
    await users.login('creator@editorAndPlayer.com');
    await workflow.createAndPublishExploration(
      'Fractions',
      'Mathematics',
      EXPLORATION_OBJECTIVE,
      'English');
    await users.logout();
    await users.createUser('learner@editorAndPlayer.com', 'learner');
    await users.login('learner@editorAndPlayer.com');
    await libraryPage.get();
    await libraryPage.clickExplorationObjective();
    await explorationPlayerPage.reportExploration();
  });

  it('should let learners suggest changes to an exploration', async function() {
    await users.createUser(
      'creator2@editorAndPlayer.com', 'creator2EditorAndPlayer');
    await users.login('creator2@editorAndPlayer.com');
    await workflow.createAndPublishExploration('Adding Fractions',
      'Mathematics', 'Let us learn how to add fractions', 'English');
    await users.logout();

    await users.createUser('learner2@editorAndPlayer.com', 'learner2');
    await users.login('learner2@editorAndPlayer.com');
    await libraryPage.get();
    await libraryPage.findExploration('Adding Fractions');
    await libraryPage.playExploration('Adding Fractions');
    await explorationPlayerPage.clickSuggestChangesButton();
    await explorationPlayerPage.fillAndSubmitSuggestion(
      'Lets test the suggestion feature', 'Oh wow, It works!');
    await users.logout();
  });

  it('should prevent going back when help card is shown', async function() {
    await users.createUser('user2@editorAndPlayer.com', 'user2EditorAndPlayer');
    await users.login('user2@editorAndPlayer.com');
    await workflow.createExploration();
    await explorationEditorMainTab.setStateName('card 1');
    await explorationEditorMainTab.setContent(
      await forms.toRichText('this is card 1'));
    await explorationEditorMainTab.setInteraction('Continue');
    await (
      await explorationEditorMainTab.getResponseEditor('default')
    ).setDestination('card 2', true, null);

    await explorationEditorMainTab.moveToState('card 2');
    await explorationEditorMainTab.setContent(await forms.toRichText(
      'this is card 2 with non-inline interaction'));
    await explorationEditorMainTab.setInteraction(
      'LogicProof',
      '', '', 'from p we have p');
    await explorationEditorMainTab.addResponse(
      'LogicProof', await forms.toRichText('Great'),
      'final card', true, 'Correct');

    // Setup a terminating state.
    await explorationEditorMainTab.moveToState('final card');
    await explorationEditorMainTab.setInteraction('EndExploration');
    await explorationEditorPage.saveChanges();

    await general.moveToPlayer();
    await explorationPlayerPage.submitAnswer('Continue');
    var buttons = element.all(by.css('.protractor-test-back-button'));
    expect(await buttons.count()).toBe(1);
    await explorationPlayerPage.submitAnswer('LogicProof');
    expect(await buttons.count()).toBe(0);

    await explorationPlayerPage.clickThroughToNextCard();
    await explorationPlayerPage.expectExplorationToBeOver();
    await users.logout();
  });

  it('should redirect back to parent exploration correctly when parent id is' +
      ' given as query parameter', async function() {
    await users.createUser('user1@editorAndPlayer.com', 'user1EditorAndPlayer');
    await users.login('user1@editorAndPlayer.com');

    workflow.createAndPublishExploration(
      'Parent Exploration 1',
      'Algebra',
      'This is the topmost parent exploration.');
    var parentId1 = await general.getExplorationIdFromEditor();

    workflow.createAndPublishExploration(
      'Parent Exploration 2',
      'Algebra',
      'This is the second parent exploration to which refresher ' +
      'exploration redirects.');
    var parentId2 = await general.getExplorationIdFromEditor();

    workflow.createAndPublishExploration(
      'Refresher Exploration',
      'Algebra',
      'This is the most basic refresher exploration');

    var refresherExplorationId = await general.getExplorationIdFromEditor();

    await browser.get(
      '/explore/' + refresherExplorationId + '?parent=' + parentId1 +
      '&parent=' + parentId2);
    waitFor.pageToFullyLoad();

    explorationPlayerPage.clickOnReturnToParentButton();

    var url = await browser.getCurrentUrl();
    var currentExplorationId = url.split('/')[4].split('?')[0];
    expect(currentExplorationId).toBe(parentId2);
    explorationPlayerPage.clickOnReturnToParentButton();

    url = await browser.getCurrentUrl();
    currentExplorationId = url.split('/')[4];
    expect(currentExplorationId).toBe(parentId1);
    await users.logout();
  });

  it('should give option for redirection when author has specified ' +
      'a refresher exploration Id', async function() {
    await users.createAndLoginAdminUser('testadm@collections.com', 'testadm');

    // Create Parent Exploration not added to collection.
    creatorDashboardPage.get();
    creatorDashboardPage.clickCreateActivityButton();
    creatorDashboardPage.clickCreateExplorationButton();
    explorationEditorMainTab.exitTutorial();
    explorationEditorPage.navigateToSettingsTab();
    explorationEditorSettingsTab.setTitle(
      'Parent Exploration not in collection');
    explorationEditorSettingsTab.setCategory('Algebra');
    explorationEditorSettingsTab.setObjective('This is a parent exploration');
    explorationEditorPage.navigateToMainTab();
    explorationEditorMainTab.setContent(forms.toRichText(
      'Parent Exploration Content'));
    explorationEditorMainTab.setInteraction(
      'MultipleChoiceInput',
      [forms.toRichText('Correct'), forms.toRichText('Incorrect')]);
    explorationEditorMainTab.addResponse(
      'MultipleChoiceInput', null, 'card 2', true,
      'Equals', 'Correct');
    var responseEditor = explorationEditorMainTab.getResponseEditor('default');
    responseEditor.setFeedback(forms.toRichText('try again'));
    explorationEditorMainTab.moveToState('card 2');
    explorationEditorMainTab.setInteraction('EndExploration');
    explorationEditorPage.saveChanges();
    workflow.publishExploration();

    // Create Parent Exploration added in collection.
    creatorDashboardPage.get();
    creatorDashboardPage.clickCreateActivityButton();
    creatorDashboardPage.clickCreateExplorationButton();
    explorationEditorMainTab.exitTutorial();
    explorationEditorPage.navigateToSettingsTab();
    explorationEditorSettingsTab.setTitle('Parent Exploration in collection');
    explorationEditorSettingsTab.setCategory('Algebra');
    explorationEditorSettingsTab.setObjective('This is a parent exploration');
    explorationEditorPage.navigateToMainTab();
    explorationEditorMainTab.setContent(forms.toRichText(
      'Parent Exploration Content'));
    explorationEditorMainTab.setInteraction(
      'MultipleChoiceInput',
      [forms.toRichText('Correct'), forms.toRichText('Incorrect')]);
    explorationEditorMainTab.addResponse(
      'MultipleChoiceInput', null, 'card 2', true,
      'Equals', 'Correct');
    responseEditor = explorationEditorMainTab.getResponseEditor('default');
    responseEditor.setFeedback(forms.toRichText('try again'));
    explorationEditorMainTab.moveToState('card 2');
    explorationEditorMainTab.setInteraction('EndExploration');
    explorationEditorPage.saveChanges();
    workflow.publishExploration();

    // Create Refresher Exploration.
    creatorDashboardPage.get();
    creatorDashboardPage.clickCreateActivityButton();
    creatorDashboardPage.clickCreateExplorationButton();
    explorationEditorMainTab.exitTutorial();
    explorationEditorPage.navigateToSettingsTab();
    explorationEditorSettingsTab.setTitle('Refresher Exploration');
    explorationEditorSettingsTab.setCategory('Algebra');
    explorationEditorSettingsTab.setObjective(
      'This is the refresher exploration');
    explorationEditorPage.navigateToMainTab();
    explorationEditorMainTab.setContent(forms.toRichText(
      'Refresher Exploration Content'));
    explorationEditorMainTab.setInteraction('EndExploration');
    explorationEditorPage.saveChanges();
    workflow.publishExploration();
    // Add refresher exploration's Id to both parent explorations.
    var refresherExplorationId = await general.getExplorationIdFromEditor();
    creatorDashboardPage.get();
    creatorDashboardPage.editExploration('Parent Exploration in collection');
    responseEditor = explorationEditorMainTab.getResponseEditor('default');
    responseEditor.setDestination(null, false, refresherExplorationId);
    explorationEditorPage.saveChanges('Add Refresher Exploration Id');

    creatorDashboardPage.get();
    creatorDashboardPage.editExploration(
      'Parent Exploration not in collection');
    responseEditor = explorationEditorMainTab.getResponseEditor('default');
    responseEditor.setDestination(null, false, refresherExplorationId);
    explorationEditorPage.saveChanges('Add Refresher Exploration Id');

    // Create collection and add created exploration.
    creatorDashboardPage.get();
    creatorDashboardPage.clickCreateActivityButton();
    creatorDashboardPage.clickCreateCollectionButton();
    collectionEditorPage.searchForAndAddExistingExploration(
      'Parent Exploration in collection');
    collectionEditorPage.saveDraft();
    collectionEditorPage.closeSaveModal();
    collectionEditorPage.publishCollection();
    collectionEditorPage.setTitle('Test Collection');
    collectionEditorPage.setObjective('This is a test collection.');
    collectionEditorPage.setCategory('Algebra');
    collectionEditorPage.saveChanges();

    // Play-test exploration and visit the refresher exploration.
    libraryPage.get();
    libraryPage.findExploration('Parent Exploration not in collection');
    libraryPage.playExploration('Parent Exploration not in collection');
    explorationPlayerPage.submitAnswer('MultipleChoiceInput', 'Incorrect');
    explorationPlayerPage.clickConfirmRedirectionButton();
    explorationPlayerPage.expectExplorationNameToBe(
      'Refresher Exploration');
    explorationPlayerPage.clickOnReturnToParentButton();
    explorationPlayerPage.submitAnswer('MultipleChoiceInput', 'Incorrect');
    explorationPlayerPage.clickCancelRedirectionButton();
    explorationPlayerPage.expectContentToMatch(
      forms.toRichText('Parent Exploration Content'));
    explorationPlayerPage.submitAnswer('MultipleChoiceInput', 'Correct');

    libraryPage.get();
    libraryPage.findCollection('Test Collection');
    libraryPage.playCollection('Test Collection');
    // Click first exploration in collection.
    await element.all(by.css(
      '.protractor-test-collection-exploration')).first().click();
    explorationPlayerPage.submitAnswer('MultipleChoiceInput', 'Incorrect');
    explorationPlayerPage.clickConfirmRedirectionButton();
    // Check the current url to see if collection_id is present in it.
    var url = await browser.getCurrentUrl();
    var pathname = url.split('/');
    expect(
      pathname[4].split('?')[1].split('=')[0]).toEqual('collection_id');
    await users.logout();
  });

  it('should navigate multiple states correctly, with parameters',
    async function() {
      await users.createUser(
        'user4@editorAndPlayer.com', 'user4EditorAndPlayer');
      await users.login('user4@editorAndPlayer.com');

      await workflow.createExploration();
      explorationEditorMainTab.setStateName('card 1');
      explorationEditorMainTab.setContent(forms.toRichText('this is card 1'));
      explorationEditorMainTab.setInteraction('NumericInput');
      explorationEditorMainTab.addResponse(
        'NumericInput', null, 'final card', true, 'Equals', 21);
      explorationEditorMainTab.getResponseEditor(0).setDestination(
        'card 2', true, null);

      explorationEditorMainTab.moveToState('card 2');
      explorationEditorMainTab.setContent(forms.toRichText(
        'this is card 2 with previous answer {{answer}}'));
      explorationEditorMainTab.setInteraction(
        'MultipleChoiceInput',
        [forms.toRichText('return'), forms.toRichText('complete')]);
      explorationEditorMainTab.addResponse(
        'MultipleChoiceInput', null, 'card 1', false,
        'Equals', 'return');
      explorationEditorMainTab.getResponseEditor('default').setDestination(
        'final card', false, null);
      // Setup a terminating state.
      explorationEditorMainTab.moveToState('final card');
      explorationEditorMainTab.setInteraction('EndExploration');
      explorationEditorPage.saveChanges();

      general.moveToPlayer();
      explorationPlayerPage.expectContentToMatch(
        forms.toRichText('this is card 1'));
      explorationPlayerPage.submitAnswer('NumericInput', 19);
      explorationPlayerPage.submitAnswer('NumericInput', 21);
      explorationPlayerPage.expectContentToMatch(forms.toRichText(
        'this is card 2 with previous answer 21'));
      explorationPlayerPage.submitAnswer('MultipleChoiceInput', 'return');
      explorationPlayerPage.expectContentToMatch(forms.toRichText(
        'this is card 1'));
      explorationPlayerPage.submitAnswer('NumericInput', 21);
      explorationPlayerPage.expectContentToMatch(forms.toRichText(
        'this is card 2 with previous answer 21'));
      explorationPlayerPage.expectExplorationToNotBeOver();
      explorationPlayerPage.submitAnswer('MultipleChoiceInput', 'complete');
      explorationPlayerPage.expectExplorationToBeOver();
      await users.logout();
    });

  it('uses hints and solutions in an exploration', async function() {
    var explorationPlayerPage = (
      new ExplorationPlayerPage.ExplorationPlayerPage());
    await users.createUser('user1@hintsAndSolutions.com', 'hintsAndSolutions');

    // Creator creates and publishes an exploration.
    await users.login('user1@hintsAndSolutions.com');
    await workflow.createExploration();

    explorationEditorMainTab.setStateName('Introduction');
    explorationEditorMainTab.setContent(
      forms.toRichText('What language is Oppia?'));
    explorationEditorMainTab.setInteraction('TextInput');
    explorationEditorMainTab.addResponse(
      'TextInput', forms.toRichText('Good job'), 'End', true, 'Equals',
      'Finnish');
    explorationEditorMainTab.getResponseEditor('default').setFeedback(
      forms.toRichText('Try again'));
    explorationEditorMainTab.addHint('Try language of Finland');
    explorationEditorMainTab.addSolution('TextInput', {
      correctAnswer: 'Finnish',
      explanation: 'Finland language'
    });
    explorationEditorMainTab.moveToState('End');
    explorationEditorMainTab.setInteraction('EndExploration');
    explorationEditorPage.saveChanges();
    general.moveToPlayer();
    explorationPlayerPage.expectContentToMatch(
      forms.toRichText('What language is Oppia?'));
    explorationPlayerPage.submitAnswer('TextInput', 'Roman');
    explorationPlayerPage.viewHint();
    explorationPlayerPage.submitAnswer('TextInput', 'Greek');

    explorationPlayerPage.viewSolution();
    explorationPlayerPage.expectExplorationToNotBeOver();
    explorationPlayerPage.submitAnswer('TextInput', 'Finnish');
    explorationPlayerPage.clickThroughToNextCard();
    explorationPlayerPage.expectExplorationToBeOver();
    await users.logout();
  });

  it('should play the recommended exploration successfully', async function() {
    await users.createUser('user9@editorAndPlayer.com', 'user9editorAndPlayer');
    await users.createUser('user10@editorAndPlayer.com',
      'user10editorAndPlayer');
    await users.login('user9@editorAndPlayer.com');
    // Publish new exploration.
    await workflow.createExploration();
    explorationEditorMainTab.setContent(
      forms.toRichText('You should recommend this exploration'));
    explorationEditorMainTab.setInteraction('EndExploration');
    var explorationEditorSettingsTab = explorationEditorPage.getSettingsTab();
    explorationEditorPage.navigateToSettingsTab();
    explorationEditorSettingsTab.setTitle('Recommended Exploration 1');
    explorationEditorSettingsTab.setCategory('Algorithm');
    explorationEditorSettingsTab.setObjective('To be recommended');
    explorationEditorPage.navigateToMainTab();
    explorationEditorPage.saveChanges();
    workflow.publishExploration();
    await users.logout();

    await users.login('user10@editorAndPlayer.com');
    libraryPage.get();
    libraryPage.findExploration('Recommended Exploration 1');
    libraryPage.playExploration('Recommended Exploration 1');
    // Using the Id from Player and create a new exploration
    // and add the Id as suggestion.
    var recommendedExplorationId = await general.getExplorationIdFromPlayer();
    await workflow.createExploration();
    explorationEditorMainTab.setContent(
      forms.toRichText('I want to recommend an exploration at the end'));
    explorationEditorMainTab.setInteraction(
      'EndExploration', [recommendedExplorationId]);
    explorationEditorPage.navigateToSettingsTab();
    explorationEditorSettingsTab.setTitle(
      'Exploration with Recommendation');
    explorationEditorSettingsTab.setCategory('Algorithm');
    explorationEditorSettingsTab.setObjective(
      'To display recommended exploration');
    explorationEditorPage.navigateToMainTab();
    explorationEditorPage.saveChanges();
    workflow.publishExploration();

    // Play-test the exploration and visit the recommended exploration
    libraryPage.get();
    libraryPage.findExploration('Exploration with Recommendation');
    libraryPage.playExploration('Exploration with Recommendation');
    var recommendedExplorationTile = element(
      by.css('.protractor-test-exp-summary-tile-title'));
    expect(recommendedExplorationTile.getText())
      .toEqual('Recommended Exploration 1');
    await recommendedExplorationTile.click();
    explorationPlayerPage.expectExplorationNameToBe(
      'Recommended Exploration 1');
    await users.logout();
  });

  afterEach(function() {
    general.checkForConsoleErrors([]);
  });
});
