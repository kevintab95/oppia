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
 * @fileoverview Unit tests for this.ResponsesService.
 */

import { UpgradedServices } from 'services/UpgradedServices';

fdescribe('Responses Service', function() {
  // angular.mock.module.sharedInjector();
  beforeEach(angular.mock.module('oppia', function($provide) {
    // this.ugs = new UpgradedServices();
    for (let [key, value] of Object.entries(UpgradedServices.prototype.getUpgradedServices())) {
      $provide.value(key, value);
    }
  }));
  beforeEach(angular.mock.module('oppia', function($provide) {
    $provide.value('StateSolutionService', {
      savedMemento: {
        correctAnswer: 'This is a correct answer'
      }
    });
  }));
  beforeEach(angular.mock.inject(function($injector) {
    this.ResponsesService = $injector.get('ResponsesService');
    this.InteractionObjectFactory = $injector.get('InteractionObjectFactory');
    this.OutcomeObjectFactory = $injector.get('OutcomeObjectFactory');
    this.StateEditorService = $injector.get('StateEditorService');
    this.AlertsService = $injector.get('AlertsService');
    this.StateInteractionIdService = $injector.get('StateInteractionIdService');
    this.AnswerGroupsCacheService = $injector.get('AnswerGroupsCacheService');
    this.AnswerGroupObjectFactory = $injector.get('AnswerGroupObjectFactory');
    this.LoggerService = $injector.get('LoggerService');

    this.interactionData = this.InteractionObjectFactory.createFromBackendDict({
      id: 'TextInput',
      answer_groups: [{
        outcome: {
          dest: '',
          feedback: {
            content_id: 'feedback_1',
            html: ''
          },
        },
        rule_specs: [],
      }],
      default_outcome: {
        dest: 'Hola',
        feedback: {
          content_id: '',
          html: '',
        },
      },
      confirmed_unclassified_answers: [],
      customization_args: {
        rows: {
          value: true
        },
        placeholder: {
          value: 1
        }
      },
      hints: [],
    });
    this.interactionDataWithRules = this.InteractionObjectFactory.createFromBackendDict({
      id: 'TextInput',
      answer_groups: [{
        outcome: {
          dest: '',
          feedback: {
            content_id: 'feedback_1',
            html: ''
          },
        },
        rule_specs: [{
          type: '',
          inputs: {
            x: ['c', 'd', 'e'],
            y: ['a', 'b', 'c']
          }
        }],
      }],
      default_outcome: {
        dest: 'Hola',
        feedback: {
          content_id: '',
          html: '',
        },
      },
      confirmed_unclassified_answers: [],
      customization_args: {
        rows: {
          value: true
        },
        placeholder: {
          value: 1
        }
      },
      hints: [],
    });
  }));

  fit('test 0', function() {
    expect(1).toBe(1);
  });
  fit('test 1', function() {
    expect(1).toBe(1);
  });
  fit('test 2', function() {
    expect(1).toBe(1);
  });
  fit('test 3', function() {
    expect(1).toBe(1);
  });
  fit('test 4', function() {
    expect(1).toBe(1);
  });
  fit('test 5', function() {
    expect(1).toBe(1);
  });
  fit('test 6', function() {
    expect(1).toBe(1);
  });
  fit('test 7', function() {
    expect(1).toBe(1);
  });
  fit('test 8', function() {
    expect(1).toBe(1);
  });
  fit('test 9', function() {
    expect(1).toBe(1);
  });
  fit('test 10', function() {
    expect(1).toBe(1);
  });
  fit('test 11', function() {
    expect(1).toBe(1);
  });
  fit('test 12', function() {
    expect(1).toBe(1);
  });
  fit('test 13', function() {
    expect(1).toBe(1);
  });
  fit('test 14', function() {
    expect(1).toBe(1);
  });
  fit('test 15', function() {
    expect(1).toBe(1);
  });
  fit('test 16', function() {
    expect(1).toBe(1);
  });
  fit('test 17', function() {
    expect(1).toBe(1);
  });
  fit('test 18', function() {
    expect(1).toBe(1);
  });
  fit('test 19', function() {
    expect(1).toBe(1);
  });
  fit('test 20', function() {
    expect(1).toBe(1);
  });
  fit('test 21', function() {
    expect(1).toBe(1);
  });
  fit('test 22', function() {
    expect(1).toBe(1);
  });
  fit('test 23', function() {
    expect(1).toBe(1);
  });
  fit('test 24', function() {
    expect(1).toBe(1);
  });
  fit('test 25', function() {
    expect(1).toBe(1);
  });
  fit('test 26', function() {
    expect(1).toBe(1);
  });
  fit('test 27', function() {
    expect(1).toBe(1);
  });
  fit('test 28', function() {
    expect(1).toBe(1);
  });
  fit('test 29', function() {
    expect(1).toBe(1);
  });
  fit('test 30', function() {
    expect(1).toBe(1);
  });

  // it('should init the service', function() {
  //   this.ResponsesService.init(this.interactionData);
  //   this.StateInteractionIdService.init('stateName', 'TextInput');
  //   expect(this.ResponsesService.getActiveAnswerGroupIndex()).toBe(-1);
  //   expect(this.ResponsesService.getActiveRuleIndex()).toBe(0);
  //   expect(this.ResponsesService.getActiveAnswerGroupIndex()).toBe(-1);
  //   expect(this.ResponsesService.getAnswerGroups()).toEqual(
  //     this.interactionData.answerGroups);
  //   expect(this.ResponsesService.getAnswerGroup(0)).toEqual(
  //     this.interactionData.answerGroups[0]);
  //   expect(this.ResponsesService.getAnswerGroupCount()).toBe(1);
  //   expect(this.ResponsesService.getDefaultOutcome()).toEqual(
  //     this.interactionData.defaultOutcome);
  //   expect(this.ResponsesService.getConfirmedUnclassifiedAnswers()).toEqual(
  //     this.interactionData.confirmedUnclassifiedAnswers);
  // });

  // it('should change active answer group index', function() {
  //   this.ResponsesService.changeActiveAnswerGroupIndex(1);
  //   expect(this.ResponsesService.getActiveAnswerGroupIndex()).toBe(1);

  //   // Click again in the current group.
  //   this.ResponsesService.changeActiveAnswerGroupIndex(1);
  //   expect(this.ResponsesService.getActiveAnswerGroupIndex()).toBe(-1);
  // });

  // it('should update default outcome', function() {
  //   this.addInfoMessageSpy = spyOn(this.AlertsService, 'addInfoMessage')
  //     .and.callThrough();
  //   this.ResponsesService.init(this.interactionData);
  //   this.StateEditorService.setInteraction(this.interactionData);
  //   this.StateEditorService.setActiveStateName('Hola');
  //   this.StateInteractionIdService.init('stateName', 'TextInput');

  //   this.ResponsesService.init(this.interactionData);
  //   this.StateEditorService.setInteraction(this.interactionData);

  //   this.updatedDefaultOutcome = this.OutcomeObjectFactory.createNew(
  //     'Hola', 'new_id', 'This is a new feedback text');
  //   this.callbackSpy = jasmine.createSpy('callback');
  //   this.ResponsesService.updateDefaultOutcome(this.updatedDefaultOutcome, this.callbackSpy);

  //   expect(this.addInfoMessageSpy).toHaveBeenCalledWith(
  //     'The current solution does not lead to another card.');
  //   expect(this.callbackSpy).toHaveBeenCalledWith(this.updatedDefaultOutcome);
  //   expect(this.ResponsesService.getDefaultOutcome()).toEqual(
  //     this.updatedDefaultOutcome);
  // });

  // it('should update answer group', function() {
  //   this.ResponsesService.init(this.interactionData);
  //   this.StateEditorService.setInteraction(this.interactionData);

  //   this.updatedAnswerGroup = {
  //     rules: [{
  //       type: 'Contains',
  //       inputs: {
  //         x: 'correct',
  //       }
  //     }],
  //     taggedSkillMisconceptionId: '',
  //     feedback: 'This is a new feedback text',
  //     dest: 'State',
  //     refresherExplorationId: '',
  //     missingPrerequisiteSkillId: '',
  //     labelledAsCorrect: false,
  //     trainingData: 'This is training data text'
  //   };
  //   this.callbackSpy = jasmine.createSpy('callback');
  //   this.ResponsesService.updateAnswerGroup(0, this.updatedAnswerGroup, this.callbackSpy);

  //   // Reassign only updated properties.
  //   this.expectedAnswerGroup = this.interactionData.answerGroups;
  //   this.expectedAnswerGroup[0].rules = this.updatedAnswerGroup.rules;
  //   this.expectedAnswerGroup[0].taggedSkillMisconceptionId =
  //     this.updatedAnswerGroup.taggedSkillMisconceptionId;
  //   this.expectedAnswerGroup[0].outcome.feedback = this.updatedAnswerGroup.feedback;
  //   this.expectedAnswerGroup[0].outcome.dest = this.updatedAnswerGroup.dest;
  //   this.expectedAnswerGroup[0].outcome.refresherExplorationId =
  //     this.updatedAnswerGroup.refresherExplorationId;
  //   this.expectedAnswerGroup[0].outcome.missingPrerequisiteSkillId =
  //     this.updatedAnswerGroup.missingPrerequisiteSkillId;
  //   this.expectedAnswerGroup[0].outcome.labelledAsCorrect =
  //     this.updatedAnswerGroup.labelledAsCorrect;
  //   this.expectedAnswerGroup[0].trainingData = this.updatedAnswerGroup.trainingData;

  //   expect(this.callbackSpy).toHaveBeenCalledWith(this.expectedAnswerGroup);
  //   expect(this.ResponsesService.getAnswerGroup(0)).toEqual(this.expectedAnswerGroup[0]);
  // });

  // it('should update active answer group', function() {
  //   this.ResponsesService.init(this.interactionData);
  //   this.StateEditorService.setInteraction(this.interactionData);

  //   this.updatedAnswerGroup = {
  //     rules: [{
  //       type: 'Contains',
  //       inputs: {
  //         x: 'correct',
  //       }
  //     }],
  //     taggedSkillMisconceptionId: '',
  //     feedback: 'This is a new feedback text',
  //     dest: 'State',
  //     refresherExplorationId: '',
  //     missingPrerequisiteSkillId: '',
  //     labelledAsCorrect: false,
  //     trainingData: 'This is training data text'
  //   };
  //   this.callbackSpy = jasmine.createSpy('callback');
  //   this.ResponsesService.changeActiveAnswerGroupIndex(0);
  //   expect(this.ResponsesService.getActiveRuleIndex()).toBe(-1);

  //   this.ResponsesService.changeActiveRuleIndex(1);
  //   expect(this.ResponsesService.getActiveRuleIndex()).toBe(1);

  //   this.ResponsesService.updateActiveAnswerGroup(this.updatedAnswerGroup, this.callbackSpy);

  //   // Reassign only updated properties.
  //   this.expectedAnswerGroup = this.interactionData.answerGroups;
  //   this.expectedAnswerGroup[0].rules = this.updatedAnswerGroup.rules;
  //   this.expectedAnswerGroup[0].taggedSkillMisconceptionId =
  //     this.updatedAnswerGroup.taggedSkillMisconceptionId;
  //   this.expectedAnswerGroup[0].outcome.feedback = this.updatedAnswerGroup.feedback;
  //   this.expectedAnswerGroup[0].outcome.dest = this.updatedAnswerGroup.dest;
  //   this.expectedAnswerGroup[0].outcome.refresherExplorationId =
  //     this.updatedAnswerGroup.refresherExplorationId;
  //   this.expectedAnswerGroup[0].outcome.missingPrerequisiteSkillId =
  //     this.updatedAnswerGroup.missingPrerequisiteSkillId;
  //   this.expectedAnswerGroup[0].outcome.labelledAsCorrect =
  //     this.updatedAnswerGroup.labelledAsCorrect;
  //   this.expectedAnswerGroup[0].trainingData = this.updatedAnswerGroup.trainingData;

  //   expect(this.ResponsesService.getActiveAnswerGroupIndex()).toBe(0);
  //   expect(this.callbackSpy).toHaveBeenCalledWith(this.expectedAnswerGroup);
  //   expect(this.ResponsesService.getAnswerGroup(0)).toEqual(this.expectedAnswerGroup[0]);
  // });

  // it('should not update active answer group that does not exist', function() {
  //   this.logErrorSpy = spyOn(this.LoggerService, 'error').and.callThrough();
  //   this.ResponsesService.init(this.interactionData);
  //   this.StateEditorService.setInteraction(this.interactionData);

  //   this.updatedAnswerGroup = {
  //     rules: [{
  //       type: 'Contains',
  //       inputs: {
  //         x: 'correct',
  //       }
  //     }],
  //     taggedSkillMisconceptionId: '',
  //     feedback: 'This is a new feedback text',
  //     dest: 'State',
  //     refresherExplorationId: '',
  //     missingPrerequisiteSkillId: '',
  //     labelledAsCorrect: false,
  //     trainingData: 'This is training data text'
  //   };
  //   this.callbackSpy = jasmine.createSpy('callback');
  //   this.ResponsesService.changeActiveAnswerGroupIndex(1);
  //   expect(this.ResponsesService.getActiveRuleIndex()).toBe(-1);

  //   this.ResponsesService.changeActiveRuleIndex(1);
  //   expect(this.ResponsesService.getActiveRuleIndex()).toBe(1);

  //   this.ResponsesService.updateActiveAnswerGroup(this.updatedAnswerGroup, this.callbackSpy);

  //   expect(this.logErrorSpy).toHaveBeenCalledWith(
  //     'The index provided does not exist in _answerGroups array.');
  //   expect(this.ResponsesService.getActiveAnswerGroupIndex()).toBe(-1);
  //   expect(this.callbackSpy).not.toHaveBeenCalled();
  //   expect(this.ResponsesService.getAnswerGroups()).toEqual(
  //     this.interactionData.answerGroups);
  // });

  // it('should update confirmed unclassified answers', function() {
  //   this.ResponsesService.init(this.interactionData);
  //   this.StateEditorService.setInteraction(this.interactionData);
  //   this.confirmedUnclassifiedAnswers = [
  //     'A confirmed unclassified answer',
  //     'This is an answer'
  //   ];

  //   expect(this.ResponsesService.getConfirmedUnclassifiedAnswers()).toEqual([]);
  //   this.ResponsesService.updateConfirmedUnclassifiedAnswers(
  //     this.confirmedUnclassifiedAnswers);
  //   expect(this.ResponsesService.getConfirmedUnclassifiedAnswers()).toEqual(
  //     this.confirmedUnclassifiedAnswers);
  // });

  // it('should update answer choices when savedMemento is ItemSelectionInput' +
  //   ' and choices has its positions changed', function() {
  //   this.ResponsesService.init(this.interactionDataWithRules);
  //   this.StateEditorService.setInteraction(this.interactionDataWithRules);
  //   this.StateInteractionIdService.init('stateName', 'ItemSelectionInput');

  //   // Set _answerChoices variable
  //   this.ResponsesService.updateAnswerChoices([{
  //     val: 'a'
  //   }, {
  //     val: 'b'
  //   }, {
  //     val: 'c'
  //   }], function() {});
  //   this.ResponsesService.changeActiveAnswerGroupIndex(0);

  //   this.newAnswerChoices = [{
  //     val: 'c'
  //   }, {
  //     val: 'b'
  //   }, {
  //     val: 'a'
  //   }];
  //   this.callbackSpy = jasmine.createSpy('callback');
  //   this.ResponsesService.updateAnswerChoices(this.newAnswerChoices, this.callbackSpy);

  //   this.expectedRules = ['c'];
  //   this.expectedAnswerGroup = this.interactionDataWithRules.answerGroups;
  //   this.expectedAnswerGroup[0].rules[0].inputs.x = this.expectedRules;

  //   expect(this.callbackSpy).toHaveBeenCalledWith(this.expectedAnswerGroup);
  //   expect(this.ResponsesService.getAnswerGroup(0)).toEqual(
  //     this.expectedAnswerGroup[0]);
  //   expect(this.ResponsesService.getAnswerChoices()).toEqual(this.newAnswerChoices);
  // });

  // it('should update answer choices when savedMemento is ItemSelectionInput' +
  //   ' and choices has its values changed', function() {
  //   this.ResponsesService.init(this.interactionDataWithRules);
  //   this.StateEditorService.setInteraction(this.interactionDataWithRules);
  //   this.StateInteractionIdService.init('stateName', 'ItemSelectionInput');

  //   this.ResponsesService.updateAnswerChoices([{
  //     val: 'a'
  //   }, {
  //     val: 'b'
  //   }, {
  //     val: 'c'
  //   }], function() {});

  //   this.newAnswerChoices = [{
  //     val: 'd'
  //   }, {
  //     val: 'e'
  //   }, {
  //     val: 'f'
  //   }];
  //   this.callbackSpy = jasmine.createSpy('callback');
  //   this.ResponsesService.updateAnswerChoices(this.newAnswerChoices, this.callbackSpy);

  //   this.expectedAnswerGroup = this.interactionDataWithRules.answerGroups;
  //   this.expectedAnswerGroup[0].rules[0].inputs.x = ['f', 'd', 'e'];
  //   this.expectedAnswerGroup[0].rules[0].inputs.y = ['d', 'e', 'f'];

  //   expect(this.callbackSpy).toHaveBeenCalledWith(this.expectedAnswerGroup);
  //   expect(this.ResponsesService.getAnswerGroup(0)).toEqual(
  //     this.expectedAnswerGroup[0]);
  //   expect(this.ResponsesService.getAnswerChoices()).toEqual(this.newAnswerChoices);
  // });

  // it('should update answer choices when savedMemento is' +
  //   ' DragAndDropSortInput and rule type is' +
  //   ' HasElementXAtPositionY', function() {
  //   this.interactionDataWithRules.id = 'DragAndDropSortInput';
  //   this.interactionDataWithRules.answerGroups[0].rules[0].type =
  //     'HasElementXAtPositionY';
  //   this.interactionDataWithRules.answerGroups[0].rules[0].inputs.y = [];

  //   this.ResponsesService.init(this.interactionDataWithRules);
  //   this.StateEditorService.setInteraction(this.interactionDataWithRules);
  //   this.StateInteractionIdService.init('stateName', 'DragAndDropSortInput');

  //   this.ResponsesService.updateAnswerChoices([{
  //     val: 'a'
  //   }, {
  //     val: 'b'
  //   }, {
  //     val: 'c'
  //   }], function() {});

  //   this.newAnswerChoices = [{
  //     val: 'c'
  //   }, {
  //     val: 'b'
  //   }];
  //   this.callbackSpy = jasmine.createSpy('callback');
  //   this.ResponsesService.updateAnswerChoices(this.newAnswerChoices, this.callbackSpy);

  //   this.expectedAnswerGroup = this.interactionDataWithRules.answerGroups;
  //   this.expectedAnswerGroup[0].rules[0].inputs.x = '';
  //   this.expectedAnswerGroup[0].rules[0].inputs.y = 1;

  //   expect(this.callbackSpy).toHaveBeenCalledWith(this.expectedAnswerGroup);
  //   expect(this.ResponsesService.getAnswerChoices()).toEqual(this.newAnswerChoices);
  // });

  // it('should update answer choices when savedMemento is' +
  //   ' DragAndDropSortInput and rule type is' +
  //   ' HasElementXBeforeElementY', function() {
  //   this.interactionDataWithRules.id = 'DragAndDropSortInput';
  //   this.interactionDataWithRules.answerGroups[0].rules[0].type =
  //     'HasElementXBeforeElementY';

  //   this.ResponsesService.init(this.interactionDataWithRules);
  //   this.StateEditorService.setInteraction(this.interactionDataWithRules);

  //   this.StateInteractionIdService.init('stateName', 'DragAndDropSortInput');

  //   this.ResponsesService.updateAnswerChoices([{
  //     val: 'a'
  //   }, {
  //     val: 'b'
  //   }, {
  //     val: 'c'
  //   }], function() {});

  //   this.newAnswerChoices = [{
  //     val: 'd'
  //   }, {
  //     val: 'e'
  //   }, {
  //     val: 'f'
  //   }];
  //   this.callbackSpy = jasmine.createSpy('callback');
  //   this.ResponsesService.updateAnswerChoices(this.newAnswerChoices, this.callbackSpy);

  //   this.expectedAnswerGroup = this.interactionDataWithRules.answerGroups;
  //   this.expectedAnswerGroup[0].rules[0].inputs.x = '';
  //   this.expectedAnswerGroup[0].rules[0].inputs.y = '';

  //   expect(this.callbackSpy).toHaveBeenCalledWith(this.expectedAnswerGroup);
  //   expect(this.ResponsesService.getAnswerChoices()).toEqual(this.newAnswerChoices);
  // });

  // it('should update answer choices when savedMemento is' +
  //   ' DragAndDropSortInput and choices had changed', function() {
  //   this.interactionDataWithRules.id = 'DragAndDropSortInput';
  //   // Any other method from DragAndDropSortInputRulesService.
  //   this.interactionDataWithRules.answerGroups[0].rules[0].type =
  //     'IsEqualToOrderingWithOneItemAtIncorrectPosition';

  //   this.ResponsesService.init(this.interactionDataWithRules);
  //   this.StateEditorService.setInteraction(this.interactionDataWithRules);
  //   this.StateInteractionIdService.init('stateName', 'DragAndDropSortInput');

  //   this.ResponsesService.updateAnswerChoices([{
  //     val: 'a'
  //   }, {
  //     val: 'b'
  //   }, {
  //     val: 'c'
  //   }], function() {});

  //   this.newAnswerChoices = [{
  //     val: 'd'
  //   }, {
  //     val: 'e'
  //   }, {
  //     val: 'f'
  //   }];
  //   this.callbackSpy = jasmine.createSpy('callback');
  //   this.ResponsesService.updateAnswerChoices(this.newAnswerChoices, this.callbackSpy);

  //   this.expectedAnswerGroup = this.interactionDataWithRules.answerGroups;
  //   this.expectedAnswerGroup[0].rules[0].inputs.x = [];
  //   this.expectedAnswerGroup[0].rules[0].inputs.y = [];

  //   expect(this.callbackSpy).toHaveBeenCalledWith(this.expectedAnswerGroup);
  //   expect(this.ResponsesService.getAnswerChoices()).toEqual(this.newAnswerChoices);
  // });

  // it('should update answer choices when savedMemento is' +
  //   ' DragAndDropSortInput and choices has its positions changed', function() {
  //   this.ResponsesService.init(this.interactionDataWithRules);
  //   this.StateEditorService.setInteraction(this.interactionDataWithRules);
  //   this.StateInteractionIdService.init('stateName', 'DragAndDropSortInput');

  //   this.ResponsesService.updateAnswerChoices([{
  //     val: 'a'
  //   }, {
  //     val: 'b'
  //   }, {
  //     val: 'c'
  //   }], function() {});

  //   this.newAnswerChoices = [{
  //     val: 'c'
  //   }, {
  //     val: 'b'
  //   }, {
  //     val: 'a'
  //   }];
  //   this.callbackSpy = jasmine.createSpy('callback');
  //   this.ResponsesService.updateAnswerChoices(this.newAnswerChoices, this.callbackSpy);

  //   expect(this.callbackSpy).not.toHaveBeenCalled();
  //   expect(this.ResponsesService.getAnswerGroup(0)).toEqual(
  //     this.interactionDataWithRules.answerGroups[0]);
  //   expect(this.ResponsesService.getAnswerChoices()).toEqual(this.newAnswerChoices);
  // });

  // it('should delete an answer group', function() {
  //   this.ResponsesService.init(this.interactionData);
  //   this.StateEditorService.setInteraction(this.interactionData);

  //   this.callbackSpy = jasmine.createSpy('callback');
  //   this.ResponsesService.deleteAnswerGroup(0, this.callbackSpy);

  //   expect(this.callbackSpy).toHaveBeenCalledWith([]);
  //   expect(this.ResponsesService.getActiveAnswerGroupIndex()).toBe(-1);
  //   expect(this.ResponsesService.getAnswerGroups()).toEqual([]);
  // });

  // it('should not delete an answer group that does not exist', function() {
  //   this.ResponsesService.init(this.interactionData);
  //   this.StateEditorService.setInteraction(this.interactionData);

  //   this.callbackSpy = jasmine.createSpy('callback');
  //   this.ResponsesService.deleteAnswerGroup(1, this.callbackSpy);

  //   expect(this.callbackSpy).toHaveBeenCalledWith(this.interactionData.answerGroups);
  //   expect(this.ResponsesService.getActiveAnswerGroupIndex()).toBe(-1);
  //   expect(this.ResponsesService.getAnswerGroups()).toEqual(
  //     this.interactionData.answerGroups);
  // });

  // it('should change interaction when id does not exist in any answer group',
  //   function() {
  //     this.cacheSpy = spyOn(this.AnswerGroupsCacheService, 'set').and.callThrough();
  //     this.ResponsesService.init(this.interactionData);
  //     this.StateEditorService.setInteraction(this.interactionData);

  //     this.newInteractionId = 'Continue';
  //     this.callbackSpy = jasmine.createSpy('callback');
  //     this.ResponsesService.onInteractionIdChanged(this.newInteractionId, this.callbackSpy);

  //     expect(this.cacheSpy).toHaveBeenCalledWith(
  //       this.newInteractionId, []);
  //     expect(this.callbackSpy).toHaveBeenCalledWith(
  //       [], this.interactionData.defaultOutcome);
  //   });

  // it('should change interaction', function() {
  //   this.cacheSpy = spyOn(this.AnswerGroupsCacheService, 'set').and.callThrough();
  //   this.StateInteractionIdService.init('stateName', 'TextInput');
  //   this.ResponsesService.init(this.interactionData);
  //   this.StateEditorService.setInteraction(this.interactionData);

  //   this.newInteractionId = 'TextInput';
  //   this.callbackSpy = jasmine.createSpy('callback');
  //   this.ResponsesService.onInteractionIdChanged(this.newInteractionId, this.callbackSpy);

  //   expect(this.cacheSpy).toHaveBeenCalledWith(
  //     this.newInteractionId, this.interactionData.answerGroups);
  //   expect(this.callbackSpy).toHaveBeenCalledWith(
  //     this.interactionData.answerGroups, this.interactionData.defaultOutcome);
  // });

  // it('should change interaction id when default outcome is not set',
  //   function() {
  //     this.cacheSpy = spyOn(this.AnswerGroupsCacheService, 'set').and.callThrough();
  //     this.StateEditorService.setActiveStateName('State');

  //     this.newInteractionId = 'Continue';
  //     this.callbackSpy = jasmine.createSpy('callback');
  //     this.ResponsesService.onInteractionIdChanged(this.newInteractionId, this.callbackSpy);

  //     this.expectedDefaultOutcomeCreated = this.OutcomeObjectFactory.createNew(
  //       'State', 'default_outcome', '', []);
  //     expect(this.cacheSpy).toHaveBeenCalledWith(
  //       this.newInteractionId, []);
  //     expect(this.callbackSpy).toHaveBeenCalledWith(
  //       [], this.expectedDefaultOutcomeCreated);
  //   });

  // it('should change interaction id when interaction is terminal and it\'s' +
  //   ' not cached', function() {
  //   this.cacheSpy = spyOn(this.AnswerGroupsCacheService, 'set').and.callThrough();
  //   this.ResponsesService.init(this.interactionData);
  //   this.StateEditorService.setInteraction(this.interactionData);

  //   this.newInteractionId = 'EndExploration';
  //   this.callbackSpy = jasmine.createSpy('callback');
  //   this.ResponsesService.onInteractionIdChanged(this.newInteractionId, this.callbackSpy);

  //   expect(this.cacheSpy).toHaveBeenCalledWith(
  //     this.newInteractionId, []);
  //   expect(this.callbackSpy).toHaveBeenCalledWith(
  //     [], null);
  // });

  // it('should save new answer group and default outcome', function() {
  //   this.addInfoMessageSpy = spyOn(this.AlertsService, 'addInfoMessage')
  //     .and.callThrough();
  //   this.ResponsesService.init(this.interactionData);
  //   this.StateEditorService.setInteraction(this.interactionData);
  //   this.StateEditorService.setActiveStateName('Hola');
  //   this.StateInteractionIdService.init('stateName', 'TextInput');

  //   this.updatedAnswerGroups = [
  //     this.AnswerGroupObjectFactory.createNew(
  //       [], this.OutcomeObjectFactory.createNew('Hola', '1', 'Feedback text'),
  //       'Training data text', '0'
  //     )
  //   ];
  //   this.updatedDefaultOutcome = this.OutcomeObjectFactory.createNew(
  //     'State', 'new_id', 'This is a new feedback text');

  //   this.callbackSpy = jasmine.createSpy('callback');
  //   this.ResponsesService.save(
  //     this.updatedAnswerGroups, this.updatedDefaultOutcome, this.callbackSpy);

  //   expect(this.addInfoMessageSpy).toHaveBeenCalledTimes(2);
  //   expect(this.addInfoMessageSpy).toHaveBeenCalledWith(
  //     'The solution is now valid!');
  //   expect(this.ResponsesService.getDefaultOutcome()).toEqual(
  //     this.updatedDefaultOutcome);
  //   expect(this.ResponsesService.getAnswerGroups()).toEqual(this.updatedAnswerGroups);
  //   expect(this.ResponsesService.getAnswerGroup(0)).toEqual(this.updatedAnswerGroups[0]);
  //   expect(this.callbackSpy).toHaveBeenCalledWith(
  //     this.updatedAnswerGroups, this.updatedDefaultOutcome);
  // });

  // it('should save new answer group and default outcome twice', function() {
  //   this.addInfoMessageSpy = spyOn(this.AlertsService, 'addInfoMessage')
  //     .and.callThrough();
  //   this.ResponsesService.init(this.interactionData);
  //   this.StateEditorService.setInteraction(this.interactionData);
  //   this.StateEditorService.setActiveStateName('Hola');
  //   this.StateInteractionIdService.init('stateName', 'TextInput');

  //   this.updatedAnswerGroups = [
  //     this.AnswerGroupObjectFactory.createNew(
  //       [], this.OutcomeObjectFactory.createNew('Hola', '1', 'Feedback text'),
  //       'Training data text', '0'
  //     )
  //   ];
  //   this.updatedDefaultOutcome = this.OutcomeObjectFactory.createNew(
  //     'State', 'new_id', 'This is a new feedback text');

  //   // Save first time.
  //   this.ResponsesService.save(
  //     this.updatedAnswerGroups, this.updatedDefaultOutcome, function() {});

  //   this.updatedDefaultOutcome = this.OutcomeObjectFactory.createNew(
  //     'Hola', 'new_id', 'This is a new feedback text');

  //   // Save second time.
  //   this.callbackSpy = jasmine.createSpy('callback');
  //   this.ResponsesService.save(
  //     this.updatedAnswerGroups, this.updatedDefaultOutcome, this.callbackSpy);

  //   expect(this.addInfoMessageSpy).toHaveBeenCalledWith(
  //     'The current solution is no longer valid.');
  //   expect(this.ResponsesService.getDefaultOutcome()).toEqual(
  //     this.updatedDefaultOutcome);
  //   expect(this.ResponsesService.getAnswerGroups()).toEqual(this.updatedAnswerGroups);
  //   expect(this.ResponsesService.getAnswerGroup(0)).toEqual(this.updatedAnswerGroups[0]);
  //   expect(this.callbackSpy).toHaveBeenCalledWith(
  //     this.updatedAnswerGroups, this.updatedDefaultOutcome);
  // });
  afterAll(function() {
    delete require.cache[module.id];
    delete angular.mock.module;
  });
});
