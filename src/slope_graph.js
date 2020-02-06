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
import ParseData from './js/slopegraph_parser';
import './css/slopegraph_styles.css!';
import SvgHandler from './js/slopegraph_svghandler';
//import d3 from './js/slopegraph_d3.v3';

////// place global variables here ////
const panelDefaults = {
	num_pairs: 10,
	header1: "Source Organization",
	header2: "Destination Organization"
};

export class SlopeGraph extends MetricsPanelCtrl {
	constructor($scope, $injector) {
		super($scope, $injector);

		_.defaults(this.panel, panelDefaults);
		this.slopegraph_holder_id = 'slopegraph_' + this.panel.id;
		this.containerDivId = 'container_' + this.slopegraph_holder_id;

		this.events.on('data-received', this.onDataReceived.bind(this));
		this.events.on('data-error', this.onDataError.bind(this));
		this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
		this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
		this.events.on('init-panel-actions', this.onInitPanelActions.bind(this));

		this.events.on('render', this.setup.bind(this));
		this.events.on('refresh', this.setup.bind(this));
	}

	onDataReceived(dataList) {
		this.process_data(dataList);
		this.render();
	}

	process_data(dataList) {
		console.log("this.num_pairs: " + this.panel.num_pairs)
		this.parsedData = ParseData(dataList, this.panel.num_pairs);
	}

	onDataError(err) { }

	onInitEditMode() {
		this.addEditorTab('Options', 'public/plugins/slope-graph/editor.html', 2);
		this.addEditorTab('Display', 'public/plugins/slope-graph/display_editor.html', 3);

		this.render();
	}

	onInitPanelActions(actions) {
		this.render();
	}

	link(scope, elem, attrs, ctrl) {
		var self = this;
		//ctrl.events.on('render', self.setup.bind(self));
		//ctrl.events.on('refresh', self.setup.bind(self));

	

		var offh = document.getElementById(this.slopegraph_holder_id).offsetHeight;

		if (offh == 0) {
			return setTimeout(function () { this.render(); }, 250);
		}

		this.render();
	}

	setup() {
		var container = document.getElementById(this.containerDivId);





		if (container) {
			container.innerHTML = "<div id='chart-area'></div>";
			//container.innerHTML = '<h1> Hello World</h1>';
			let svgHandler = new SvgHandler("chart-area");


			svgHandler.renderGraph(this.parsedData, this, this.panel.header1, this.panel.header2);

		}
	}
}

SlopeGraph.templateUrl = 'module.html';
