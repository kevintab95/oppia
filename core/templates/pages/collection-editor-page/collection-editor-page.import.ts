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
 * @fileoverview Directives required in collection editor.
 */

// The module needs to be loaded directly after jquery since it defines the
// main module the elements are attached to.

require('pages/collection-editor-page/collection-editor-page.module.ts');
require('App.ts');
require('base-components/oppia-root.directive.ts');

require('base-components/base-content.directive.ts');
require('pages/collection-editor-page/collection-editor-page.directive.ts');
require(
  'pages/collection-editor-page/navbar/' +
  'collection-editor-navbar-breadcrumb.directive.ts');
require(
  'pages/collection-editor-page/navbar/' +
  'collection-editor-navbar.directive.ts');
// Bootstrap the application.
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CollectionEditorPageModule } from './collection-editor-page.module';
platformBrowserDynamic().bootstrapModule(CollectionEditorPageModule);
