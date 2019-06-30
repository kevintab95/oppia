# coding: utf-8
#
# Copyright 2016 The Oppia Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, softwar
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Tests for classifier domain objects."""

import datetime
import re

from core.domain import classifier_domain
from core.tests import test_utils
import feconf
import utils


class ClassifierTrainingJobDomainTests(test_utils.GenericTestBase):
    """Test the ClassifierTrainingJob domain."""

    def setUp(self):
        super(ClassifierTrainingJobDomainTests, self).setUp()

        self.training_data = [
            {
                'answer_group_index': 1,
                'answers': ['a1', 'a2']
            },
            {
                'answer_group_index': 2,
                'answers': ['a2', 'a3']
            }
        ]

        self.training_job_dict = {
            'job_id': 'exp_id1.SOME_RANDOM_STRING',
            'exp_id': 'exp_id1',
            'exp_version': 1,
            'next_scheduled_check_time':
                datetime.datetime.strptime(
                    '2017-08-11 12:42:31', '%Y-%m-%d %H:%M:%S'),
            'state_name': 'some state',
            'algorithm_id': 'TextClassifier',
            'interaction_id': 'TextInput',
            'training_data': self.training_data,
            'status': 'NEW',
            'classifier_data': None,
            'data_schema_version': 1
        }

    def _get_training_job_from_dict(self, training_job_dict):
        """Returns the ClassifierTrainingJob object after receiving the content
        from the training_job_dict.
        """
        training_job = classifier_domain.ClassifierTrainingJob(
            training_job_dict['job_id'],
            training_job_dict['algorithm_id'],
            training_job_dict['interaction_id'],
            training_job_dict['exp_id'],
            training_job_dict['exp_version'],
            training_job_dict['next_scheduled_check_time'],
            training_job_dict['state_name'],
            training_job_dict['status'],
            training_job_dict['training_data'],
            training_job_dict['classifier_data'],
            training_job_dict['data_schema_version'])

        return training_job

    def test_to_dict(self):
        expected_training_job_dict = {
            'job_id': 'exp_id1.SOME_RANDOM_STRING',
            'algorithm_id': 'TextClassifier',
            'interaction_id': 'TextInput',
            'exp_id': 'exp_id1',
            'exp_version': 1,
            'next_scheduled_check_time':
                datetime.datetime.strptime(
                    '2017-08-11 12:42:31', '%Y-%m-%d %H:%M:%S'),
            'state_name': 'a state name',
            'status': 'NEW',
            'training_data': [
                {
                    'answer_group_index': 1,
                    'answers': ['a1', 'a2']
                },
                {
                    'answer_group_index': 2,
                    'answers': ['a2', 'a3']
                }
            ],
            'classifier_data': {},
            'data_schema_version': 1
        }
        observed_training_job = self._get_training_job_from_dict(
            expected_training_job_dict)
        self.assertDictEqual(
            expected_training_job_dict,
            observed_training_job.to_dict())

    def test_validation_exp_id(self):
        self.training_job_dict['exp_id'] = 1
        training_job = self._get_training_job_from_dict(self.training_job_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError, 'Expected exp_id to be a string'):
            training_job.validate()

    def test_validation_state_name(self):
        self.training_job_dict['state_name'] = 0
        training_job = self._get_training_job_from_dict(self.training_job_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError, 'Expected state to be a string'):
            training_job.validate()

    def test_validation_status(self):
        self.training_job_dict['status'] = 'invalid_status'
        training_job = self._get_training_job_from_dict(self.training_job_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError,
            re.escape('Expected status to be in %s'
                      % (feconf.ALLOWED_TRAINING_JOB_STATUSES))):
            training_job.validate()

    def test_validation_interaction_id_type(self):
        self.training_job_dict['interaction_id'] = 0
        training_job = self._get_training_job_from_dict(self.training_job_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError, 'Expected interaction_id to be a string'):
            training_job.validate()

    def test_validation_interaction_id(self):
        self.training_job_dict['interaction_id'] = 'invalid_interaction_id'
        training_job = self._get_training_job_from_dict(self.training_job_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError, 'Invalid interaction id'):
            training_job.validate()

    def test_validation_algorithm_id(self):
        self.training_job_dict['algorithm_id'] = 0
        training_job = self._get_training_job_from_dict(self.training_job_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError, 'Expected algorithm_id to be a string'):
            training_job.validate()

    def test_validation_data_schema_version(self):
        self.training_job_dict['data_schema_version'] = 'invalid_schema_version'
        training_job = self._get_training_job_from_dict(self.training_job_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError, 'Expected data_schema_version to be an int'):
            training_job.validate()

    def test_validation_classifier_data(self):
        self.training_job_dict['classifier_data'] = 'invalid_classifier_data'
        training_job = self._get_training_job_from_dict(self.training_job_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError,
            'Expected classifier_data to be a dict|None'):
            training_job.validate()

    def test_validation_training_data_without_answer_group_index(self):
        self.training_job_dict['training_data'] = [
            {
                'answers': ['a1', 'a2']
            }
        ]
        training_job = self._get_training_job_from_dict(self.training_job_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError,
            'Expected answer_group_index to be a key in training_data'
            'list item'):
            training_job.validate()

    def test_validation_training_data_without_answers(self):
        self.training_job_dict['training_data'] = [
            {
                'answer_group_index': 1
            }
        ]
        training_job = self._get_training_job_from_dict(self.training_job_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError,
            'Expected answers to be a key in training_data list item'):
            training_job.validate()

    def test_validation_training_data_with_invalid_answer_group_index_type(
            self):
        self.training_job_dict['training_data'] = [
            {
                'answer_group_index': 'invalid_answer_group_index',
                'answers': ['a1', 'a2']
            }
        ]
        training_job = self._get_training_job_from_dict(self.training_job_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError, 'Expected answer_group_index to be an int'):
            training_job.validate()

    def test_validation_training_data_with_invalid_answers_type(self):
        self.training_job_dict['training_data'] = [
            {
                'answer_group_index': 1,
                'answers': 'invalid_answers'
            }
        ]
        training_job = self._get_training_job_from_dict(self.training_job_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError, 'Expected answers to be a list'):
            training_job.validate()

    def test_validation(self):
        """Tests to verify validate method of ClassifierTrainingJob domain."""

        # Verify no errors are raised for correct data.
        training_job = self._get_training_job_from_dict(self.training_job_dict)
        training_job.validate()

        # Verify validation error is raised when int is provided for job id
        # instead of string.
        self.training_job_dict['job_id'] = 1
        training_job = self._get_training_job_from_dict(self.training_job_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError, 'Expected id to be a string'):
            training_job.validate()

        # Verify validation error is raised when string is provided for
        # exp_version instead of int.
        self.training_job_dict['job_id'] = 'exp_id1.SOME_RANDOM_STRING'
        self.training_job_dict['exp_version'] = 'abc'
        training_job = self._get_training_job_from_dict(self.training_job_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError, 'Expected exp_version to be an int'):
            training_job.validate()

        # Verify validation error is raised when string is provided for
        # next_scheduled_check_time instead of datetime.
        self.training_job_dict['exp_version'] = 1
        self.training_job_dict['next_scheduled_check_time'] = 'abc'
        training_job = self._get_training_job_from_dict(self.training_job_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError,
            'Expected next_scheduled_check_time to be datetime'):
            training_job.validate()

        # Verify validation error is raised when invalid state_name is provided.
        self.training_job_dict['next_scheduled_check_time'] = (
            datetime.datetime.strptime(
                '2017-08-11 12:42:31', '%Y-%m-%d %H:%M:%S'))
        self.training_job_dict['state_name'] = 'A string #'
        training_job = self._get_training_job_from_dict(self.training_job_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError, 'Invalid character # in the state name'):
            training_job.validate()

        # Verify validation error is raised when invalid algorithm_id is
        # provided.
        self.training_job_dict['state_name'] = 'a state name'
        self.training_job_dict['algorithm_id'] = 'abc'
        training_job = self._get_training_job_from_dict(self.training_job_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError, 'Invalid algorithm id'):
            training_job.validate()

        # Verify validation error is raised when dict is provided for list.
        self.training_job_dict['algorithm_id'] = 'TextClassifier'
        self.training_job_dict['training_data'] = {}
        training_job = self._get_training_job_from_dict(self.training_job_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError, 'Expected training_data to be a list'):
            training_job.validate()


class TrainingJobExplorationMappingDomainTests(test_utils.GenericTestBase):
    """Tests for the TrainingJobExplorationMapping domain."""

    def _get_mapping_from_dict(self, mapping_dict):
        """Returns the TrainingJobExplorationMapping object after receiving the
        content from the mapping_dict.
        """
        mapping = classifier_domain.TrainingJobExplorationMapping(
            mapping_dict['exp_id'],
            mapping_dict['exp_version'],
            mapping_dict['state_name'],
            mapping_dict['job_id'])

        return mapping

    def test_to_dict(self):
        expected_mapping_dict = {
            'exp_id': 'exp_id1',
            'exp_version': 2,
            'state_name': u'網站有中',
            'job_id': 'job_id1'
        }
        observed_mapping = self._get_mapping_from_dict(
            expected_mapping_dict)
        self.assertDictEqual(
            expected_mapping_dict,
            observed_mapping.to_dict())

    def test_validation(self):
        """Tests to verify validate method of TrainingJobExplorationMapping
        domain.
        """

        # Verify no errors are raised for correct data.
        mapping_dict = {
            'exp_id': 'exp_id1',
            'exp_version': 2,
            'state_name': u'網站有中',
            'job_id': 'job_id1'
        }
        mapping = self._get_mapping_from_dict(mapping_dict)
        mapping.validate()

        # Verify validation error is raised when int is provided for exp_id
        # instead of string.
        mapping_dict['exp_id'] = 1
        mapping = self._get_mapping_from_dict(mapping_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError, 'Expected exp_id to be a string'):
            mapping.validate()

        # Verify validation error is raised when string is provided for
        # exp_version instead of int.
        mapping_dict['exp_id'] = 'exp_id1'
        mapping_dict['exp_version'] = '1'
        mapping = self._get_mapping_from_dict(mapping_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError, 'Expected exp_version to be an int'):
            mapping.validate()

        # Verify validation error is raised when int is provided for job id
        # instead of string.
        mapping_dict['exp_version'] = 2
        mapping_dict['job_id'] = 0
        mapping = self._get_mapping_from_dict(mapping_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError, 'Expected job_id to be a string'):
            mapping.validate()

        # Verify validation error is raised when int is provided for state name
        # instead of string.
        mapping_dict['job_id'] = 'job_id1'
        mapping_dict['state_name'] = 0
        mapping = self._get_mapping_from_dict(mapping_dict)
        with self.assertRaisesRegexp(
            utils.ValidationError, 'Expected state_name to be a string'):
            mapping.validate()
