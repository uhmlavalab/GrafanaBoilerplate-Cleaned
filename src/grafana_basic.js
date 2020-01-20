/*
 * (C) 2019 Mahesh Khanal, Laboratory for Advanced Visualization and Applications, University of Hawaii at Manoa.
 */

/*
Copyright 2018 The Trustees of Indiana University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { MetricsPanelCtrl } from 'app/plugins/sdk';
import _ from 'lodash';
import './css/grafanabasic_styles.css!';
//import d3 from './js/grafanabasic_d3.v3';

////// place global variables here ////
const panelDefaults = {};

export class GrafanaBasic extends MetricsPanelCtrl {
	constructor($scope, $injector) {
		super($scope, $injector);

		_.defaults(this.panel, panelDefaults);
		this.grafanabasic_holder_id = 'grafanabasic_' + this.panel.id;
		this.containerDivId = 'container_' + this.grafanabasic_holder_id;

		this.events.on('data-received', this.onDataReceived.bind(this));
		this.events.on('data-error', this.onDataError.bind(this));
		this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
		this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
		this.events.on('init-panel-actions', this.onInitPanelActions.bind(this));
	}

	onDataReceived(dataList) {
		this.process_data(dataList);
		this.render();
	}

	process_data(dataList) {}

	onDataError(err) {}

	onInitEditMode() {
		this.addEditorTab('Options', 'public/plugins/grafana-basic/editor.html', 2);
		this.addEditorTab('Display', 'public/plugins/grafana-basic/display_editor.html', 3);

		this.render();
	}

	onInitPanelActions(actions) {
		this.render();
	}

	link(scope, elem, attrs, ctrl) {
		var self = this;
		ctrl.events.on('render', self.setup.bind(self));
		ctrl.events.on('refresh', self.setup.bind(self));

		this.render();
	}

	setup() {
		var container = document.getElementById(this.containerDivId);
		if (container) {
			container.innerHTML = '<h1> Hello World</h1>';
		}
	}
}

GrafanaBasic.templateUrl = 'module.html';
