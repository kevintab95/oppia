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
 * @fileoverview Service to handle the attribution experience.
 */

import { Injectable } from '@angular/core';
import { downgradeInjectable } from '@angular/upgrade/static';
import { ContextService } from 'services/context.service';

import { ExplorationSummaryBackendApiService } from 'domain/summary/exploration-summary-backend-api.service';

@Injectable({
  providedIn: 'root'
})
export class AttributionService {
  attributionModalIsShown: boolean = false;
  authors: string[] = [];
  explorationTitle: string = '';
  constructor(
    private contextService: ContextService,
    private explorationSummaryBackendApiService: (
      ExplorationSummaryBackendApiService)
  ) {}

  private _init(successCallback, errorCallback): void {
    this.explorationSummaryBackendApiService
      .loadPublicAndPrivateExplorationSummaries(
        [this.contextService.getExplorationId()]).then(responseObject => {
        var summaries = responseObject.summaries;
        var contributorSummary = (
          summaries.length ?
          summaries[0].human_readable_contributors_summary : {});
        this.authors = (
          Object.keys(contributorSummary).sort(
            function(contributorUsername1, contributorUsername2) {
              var commitsOfContributor1 = contributorSummary[
                contributorUsername1].num_commits;
              var commitsOfContributor2 = contributorSummary[
                contributorUsername2].num_commits;
              return commitsOfContributor2 - commitsOfContributor1;
            })
        );
        this.explorationTitle = summaries.length ? summaries[0].title : '';
        successCallback();
      }, () => {
        errorCallback();
      });
  }

  isGenerateAttributionAllowed(): boolean {
    return this.contextService.isInExplorationPlayerPage();
  }

  showAttributionModal(): void {
    if (this.authors.length && this.explorationTitle) {
      this.attributionModalIsShown = true;
      return;
    }
    this._init(
      () => this.attributionModalIsShown = true,
      () => this.attributionModalIsShown = false);
  }

  hideAttributionModal(): void {
    this.attributionModalIsShown = false;
  }

  isAttributionModalShown(): boolean {
    return this.attributionModalIsShown;
  }

  getAuthors(): string[] {
    return this.authors;
  }

  getExplorationTitle(): string {
    return this.explorationTitle;
  }
}

angular.module('oppia').factory(
  'AttributionService', downgradeInjectable(AttributionService));
