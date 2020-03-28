# coding: utf-8
#
# Copyright 2014 The Oppia Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Tests for draft upgrade services."""

from __future__ import absolute_import  # pylint: disable=import-only-modules
from __future__ import unicode_literals  # pylint: disable=import-only-modules

from core.domain import draft_upgrade_services
from core.domain import exp_domain
from core.domain import exp_fetchers
from core.domain import exp_services
from core.platform import models
from core.tests import test_utils
import feconf
import python_utils
import utils

(exp_models,) = models.Registry.import_models([models.NAMES.exploration])


class DraftUpgradeUnitTests(test_utils.GenericTestBase):
    """Test the draft upgrade services module."""
    EXP_ID = 'exp_id'
    USER_ID = 'user_id'
    OTHER_CHANGE_LIST = [exp_domain.ExplorationChange({
        'cmd': exp_domain.CMD_EDIT_EXPLORATION_PROPERTY,
        'property_name': 'title',
        'new_value': 'New title'
    })]
    EXP_MIGRATION_CHANGE_LIST = [exp_domain.ExplorationChange({
        'cmd': exp_domain.CMD_MIGRATE_STATES_SCHEMA_TO_LATEST_VERSION,
        'from_version': '0',
        'to_version': '1'
    })]
    DRAFT_CHANGELIST = [exp_domain.ExplorationChange({
        'cmd': 'edit_exploration_property',
        'property_name': 'title',
        'old_value': None,
        'new_value': 'Updated title'})]

    def setUp(self):
        super(DraftUpgradeUnitTests, self).setUp()
        self.save_new_valid_exploration(self.EXP_ID, self.USER_ID)

    def test_try_upgrade_with_no_version_difference(self):
        self.assertIsNone(
            draft_upgrade_services.try_upgrading_draft_to_exp_version(
                self.DRAFT_CHANGELIST, 1, 1, self.EXP_ID))

    def test_try_upgrade_raises_exception_if_versions_are_invalid(self):
        with self.assertRaisesRegexp(
            utils.InvalidInputException,
            'Current draft version is greater than the exploration version.'):
            draft_upgrade_services.try_upgrading_draft_to_exp_version(
                self.DRAFT_CHANGELIST, 2, 1, self.EXP_ID)

        exp_services.update_exploration(
            self.USER_ID, self.EXP_ID, self.OTHER_CHANGE_LIST,
            'Changed exploration title.')
        exploration = exp_fetchers.get_exploration_by_id(self.EXP_ID)
        self.assertEqual(exploration.version, 2)
        self.assertIsNone(
            draft_upgrade_services.try_upgrading_draft_to_exp_version(
                self.DRAFT_CHANGELIST, 1, exploration.version, self.EXP_ID))

    def test_try_upgrade_failure_due_to_unsupported_commit_type(self):
        exp_services.update_exploration(
            self.USER_ID, self.EXP_ID, self.OTHER_CHANGE_LIST,
            'Changed exploration title.')
        exploration = exp_fetchers.get_exploration_by_id(self.EXP_ID)
        self.assertEqual(exploration.version, 2)
        self.assertIsNone(
            draft_upgrade_services.try_upgrading_draft_to_exp_version(
                self.DRAFT_CHANGELIST, 1, exploration.version, self.EXP_ID))

    def test_try_upgrade_failure_due_to_unimplemented_upgrade_methods(self):
        exp_services.update_exploration(
            self.USER_ID, self.EXP_ID, self.EXP_MIGRATION_CHANGE_LIST,
            'Ran Exploration Migration job.')
        exploration = exp_fetchers.get_exploration_by_id(self.EXP_ID)
        self.assertEqual(exploration.version, 2)
        self.assertIsNone(
            draft_upgrade_services.try_upgrading_draft_to_exp_version(
                self.DRAFT_CHANGELIST, 1, exploration.version, self.EXP_ID))

    def test_try_upgrade_success(self):
        exp_services.update_exploration(
            self.USER_ID, self.EXP_ID, self.EXP_MIGRATION_CHANGE_LIST,
            'Ran Exploration Migration job.')
        exploration = exp_fetchers.get_exploration_by_id(self.EXP_ID)
        draft_upgrade_services.DraftUpgradeUtil._convert_states_v0_dict_to_v1_dict = (  # pylint: disable=protected-access,line-too-long
            classmethod(lambda cls, changelist: changelist))
        self.assertEqual(exploration.version, 2)
        self.assertEqual(
            draft_upgrade_services.try_upgrading_draft_to_exp_version(
                self.DRAFT_CHANGELIST, 1, exploration.version, self.EXP_ID),
            self.DRAFT_CHANGELIST)

    def test_try_upgrade_from_v32_to_v33(self):
        exp_id = 'exp1'
        self.save_new_exp_with_states_schema_v0(
            exp_id, self.USER_ID, 'Old Title')
        exploration_model = exp_models.ExplorationModel.get(
            exp_id, strict=True, version=None)
        for i in python_utils.RANGE(31):
            exploration_model.commit(
                self.USER_ID, 'Changed title %s.' % i, [])
        exploration_model.commit(
            self.USER_ID, 'Migrate from v32 to v33', [{
                'cmd': exp_domain.CMD_MIGRATE_STATES_SCHEMA_TO_LATEST_VERSION,
                'from_version': 32,
                'to_version': 33
            }])
        self.assertEqual(
            draft_upgrade_services.try_upgrading_draft_to_exp_version(
                self.DRAFT_CHANGELIST, 32, 33, exp_id),
            self.DRAFT_CHANGELIST)


class DraftUpgradeUtilUnitTests(test_utils.GenericTestBase):
    """Test the DraftUpgradeUtil module."""

    def test_convert_to_latest_schema_version_implemented(self):
        state_schema_version = feconf.CURRENT_STATE_SCHEMA_VERSION
        conversion_fn_name = '_convert_states_v%s_dict_to_v%s_dict' % (
            state_schema_version - 1, state_schema_version)
        self.assertTrue(
            hasattr(
                draft_upgrade_services.DraftUpgradeUtil, conversion_fn_name),
            msg='Current schema version is %d but DraftUpgradeUtil.%s is '
            'unimplemented.' % (state_schema_version, conversion_fn_name))

    # pylint: disable=anomalous-backslash-in-string
    def test_convert_states_v32_dict_to_v33_dict(self):
        html_content = (
            '<oppia-noninteractive-collapsible content-with-value="&amp;'
            'quot;&amp;lt;oppia-noninteractive-image alt-with-value=\&amp;'
            'quot;&amp;amp;amp;quot;&amp;amp;amp;quot;\&amp;quot; '
            'caption-with-value=\&amp;quot;&amp;amp;amp;quot;&amp;amp;amp;'
            'quot;\&amp;quot; filepath-with-value=\&amp;quot;&amp;amp;amp;'
            'quot;abc2.png&amp;amp;amp;quot;\&amp;quot;&amp;gt;&amp;lt;'
            '/oppia-noninteractive-image&amp;gt;&amp;lt;p&amp;gt;You '
            'have opened the collapsible block.&amp;lt;/p&amp;gt;&amp;'
            'quot;" heading-with-value="&amp;quot;Sample Header&amp;quot;'
            '"></oppia-noninteractive-collapsible>')
        expected_output = (
            u'<oppia-noninteractive-collapsible content-with-value="&amp;'
            'quot;&amp;lt;oppia-noninteractive-image alt-with-value=\&amp;'
            'quot;&amp;amp;amp;quot;&amp;amp;amp;quot;\&amp;quot; '
            'caption-with-value=\&amp;quot;&amp;amp;amp;quot;&amp;amp;amp;'
            'quot;\&amp;quot; filepath-with-value=\&amp;quot;&amp;amp;amp;'
            'quot;abc2_height_120_width_120.png&amp;amp;amp;quot;\&amp;quot;'
            '&amp;gt;&amp;lt;/oppia-noninteractive-image&amp;gt;&amp;lt;'
            'p&amp;gt;You have opened the collapsible block.&amp;lt;/p'
            '&amp;gt;&amp;quot;" heading-with-value="&amp;quot;Sample '
            'Header&amp;quot;"></oppia-noninteractive-collapsible>')
        draft_change_list = [
            exp_domain.ExplorationChange({
                'cmd': exp_domain.CMD_EDIT_STATE_PROPERTY,
                'state_name': 'Intro',
                'property_name': exp_domain.STATE_PROPERTY_CONTENT,
                'new_value': {
                    'html': html_content,
                    'content_id': 'content_id'
                }
            }),
            exp_domain.ExplorationChange({
                'cmd': exp_domain.CMD_EDIT_STATE_PROPERTY,
                'state_name': 'Intro',
                'property_name': (
                    exp_domain.STATE_PROPERTY_INTERACTION_ANSWER_GROUPS),
                'new_value': [{
                    'rule_specs': [],
                    'outcome': {
                        'feedback': {
                            'html': html_content,
                            'content_id': 'cid'
                        }
                    },
                    'training_data': [],
                    'tagged_skill_misconception_id': None
                }]
            }),
            exp_domain.ExplorationChange({
                'cmd': exp_domain.CMD_EDIT_STATE_PROPERTY,
                'state_name': 'Intro',
                'property_name': exp_domain.STATE_PROPERTY_INTERACTION_HINTS,
                'new_value': [{
                    'hint_content': {
                        'html': html_content,
                        'content_id': 'content_id'
                    }
                }]
            }),
            exp_domain.ExplorationChange({
                'cmd': exp_domain.CMD_EDIT_STATE_PROPERTY,
                'state_name': 'Intro',
                'property_name': (
                    exp_domain.STATE_PROPERTY_INTERACTION_SOLUTION),
                'new_value': {
                    'answer_is_exclusive': True,
                    'correct_answer': '',
                    'explanation': {
                        'content_id': 'cid',
                        'html': html_content
                    }
                }
            })]
        converted_change_list = (
            draft_upgrade_services.DraftUpgradeUtil._convert_states_v32_dict_to_v33_dict(  # pylint: disable=protected-access,line-too-long
                'exp_id', draft_change_list))
        self.assertEqual(
            converted_change_list[0].to_dict()[u'new_value'][u'html'],
            expected_output)
        self.assertEqual(
            converted_change_list[1].to_dict()[u'new_value'][0][u'outcome'][u'feedback'][u'html'], # pylint: disable=line-too-long
            expected_output)
        self.assertEqual(
            converted_change_list[2].to_dict()[u'new_value'][0][u'hint_content'][u'html'], # pylint: disable=line-too-long
            expected_output)
        self.assertEqual(
            converted_change_list[3].to_dict()[u'new_value'][u'explanation'][u'html'], # pylint: disable=line-too-long
            expected_output)

    def test_convert_states_v31_dict_to_v32_dict(self):
        draft_change_list = [
            exp_domain.ExplorationChange({
                'cmd': exp_domain.CMD_EDIT_STATE_PROPERTY,
                'state_name': 'Intro',
                'property_name': 'content',
                'new_value': 'new value'
            })]
        self.assertEqual(
            draft_upgrade_services.DraftUpgradeUtil._convert_states_v31_dict_to_v32_dict(  # pylint: disable=protected-access,line-too-long
                draft_change_list)[0].to_dict(),
            draft_change_list[0].to_dict())

    def test_convert_states_v30_dict_to_v31_dict(self):
        draft_change_list = [
            exp_domain.ExplorationChange({
                'cmd': exp_domain.CMD_EDIT_STATE_PROPERTY,
                'state_name': 'Intro',
                'property_name': 'recorded_voiceovers',
                'new_value': {
                    'voiceovers_mapping': {
                        'content': {
                            'en': {
                                'file_size_name': 100,
                                'filename': 'atest.mp3',
                                'needs_update': False
                            }
                        }
                    }
                }
            })]
        self.assertEqual(
            draft_upgrade_services.DraftUpgradeUtil # pylint: disable=protected-access
            ._convert_states_v30_dict_to_v31_dict(
                draft_change_list)[0].to_dict(),
            exp_domain.ExplorationChange({
                'cmd': exp_domain.CMD_EDIT_STATE_PROPERTY,
                'state_name': 'Intro',
                'property_name': 'recorded_voiceovers',
                'new_value': {
                    'voiceovers_mapping': {
                        'content': {
                            'en': {
                                'file_size_name': 100,
                                'filename': 'atest.mp3',
                                'needs_update': False,
                                'duration_secs': 0.0
                            }
                        }
                    }
                }
            }).to_dict())

    def test_convert_states_v29_dict_to_v30_dict(self):
        draft_change_list = [
            exp_domain.ExplorationChange({
                'cmd': exp_domain.CMD_EDIT_STATE_PROPERTY,
                'property_name': 'answer_groups',
                'state_name': 'State 1',
                'new_value': {
                    'rule_specs': [{
                        'rule_type': 'Equals',
                        'inputs': {'x': [
                            '<p>This is value1 for ItemSelection</p>'
                        ]}
                    }, {
                        'rule_type': 'Equals',
                        'inputs': {'x': [
                            '<p>This is value2 for ItemSelection</p>'
                        ]}
                    }],
                    'outcome': {
                        'dest': 'Introduction',
                        'feedback': {
                            'content_id': 'feedback',
                            'html': '<p>Outcome for state1</p>'
                        },
                        'param_changes': [],
                        'labelled_as_correct': False,
                        'refresher_exploration_id': None,
                        'missing_prerequisite_skill_id': None
                    },
                    'training_data': [],
                    'tagged_misconception_id': None
                }
            })]
        self.assertEqual(
            draft_upgrade_services.DraftUpgradeUtil._convert_states_v29_dict_to_v30_dict(  # pylint: disable=protected-access,line-too-long
                draft_change_list)[0].to_dict(),
            exp_domain.ExplorationChange({
                'cmd': exp_domain.CMD_EDIT_STATE_PROPERTY,
                'property_name': 'answer_groups',
                'state_name': 'State 1',
                'new_value': {
                    'rule_specs': [{
                        'rule_type': 'Equals',
                        'inputs': {'x': [
                            '<p>This is value1 for ItemSelection</p>'
                        ]}
                    }, {
                        'rule_type': 'Equals',
                        'inputs': {'x': [
                            '<p>This is value2 for ItemSelection</p>'
                        ]}
                    }],
                    'outcome': {
                        'dest': 'Introduction',
                        'feedback': {
                            'content_id': 'feedback',
                            'html': '<p>Outcome for state1</p>'
                        },
                        'param_changes': [],
                        'labelled_as_correct': False,
                        'refresher_exploration_id': None,
                        'missing_prerequisite_skill_id': None
                    },
                    'training_data': [],
                    'tagged_skill_misconception_id': None
                }
            }).to_dict())

    def test_convert_states_v28_dict_to_v29_dict(self):
        draft_change_list = [
            exp_domain.ExplorationChange({
                'cmd': exp_domain.CMD_EDIT_STATE_PROPERTY,
                'state_name': 'Intro',
                'property_name': 'content',
                'new_value': 'new value'
            })]
        self.assertEqual(
            draft_upgrade_services.DraftUpgradeUtil._convert_states_v28_dict_to_v29_dict(  # pylint: disable=protected-access,line-too-long
                draft_change_list)[0].to_dict(),
            draft_change_list[0].to_dict())

    def test_convert_states_v27_dict_to_v28_dict(self):
        draft_change_list = [
            exp_domain.ExplorationChange({
                'cmd': exp_domain.CMD_EDIT_STATE_PROPERTY,
                'property_name': 'content_ids_to_audio_translations',
                'state_name': 'State B',
                'new_value': 'new value',
            })]
        self.assertEqual(
            draft_upgrade_services.DraftUpgradeUtil._convert_states_v27_dict_to_v28_dict(  # pylint: disable=protected-access,line-too-long
                draft_change_list)[0].to_dict(),
            exp_domain.ExplorationChange({
                'cmd': exp_domain.CMD_EDIT_STATE_PROPERTY,
                'property_name': 'recorded_voiceovers',
                'state_name': 'State B',
                'new_value': {'voiceovers_mapping': 'new value'}
            }).to_dict())
