require([
	"esri/map",
	"esri/layers/FeatureLayer",
	"esri/renderers/SimpleRenderer",
	"esri/symbols/SimpleFillSymbol",
	"esri/symbols/SimpleLineSymbol",
	"esri/symbols/TextSymbol",
	"esri/Color",
	"esri/layers/LabelClass",
	"esri/InfoTemplate",
	"esri/dijit/Legend",

	"dojo/on",
	"dojo/dom-construct",
	"dojo/domReady!"],
function(
	Map,
	FeatureLayer,
	SimpleRenderer,
	SimpleFillSymbol,
	SimpleLineSymbol,
	TextSymbol,
	Color,
	LabelClass,
	InfoTemplate,
	Legend,
	
	on,
	domConstruct
) {
	
	var map = new Map("map", {
		zoom: 8,
		showLabels: true
	});
	
	// Add custom basemap to map
	var basemap = new esri.layers.ArcGISTiledMapServiceLayer("https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer")
	map.addLayer(basemap);

	// Add layers to the map, get layers back
	var buildings, communityAreas = addLayers(map);

	function addLayers(map){
		var buildings = new FeatureLayer("https://services1.arcgis.com/g2TonOxuRkIqSOFx/arcgis/rest/services/Chicago_Buildings/FeatureServer/0", {
			outFields: ["*"],
			id: "buildings"
		});
		// Set renderer for buildings
		var renderer = new SimpleRenderer(new SimpleFillSymbol().setOutline(new SimpleLineSymbol().setWidth(0.1).setColor(new Color([255, 255, 255]))));
		renderer.setColorInfo({
			field: "Area_Sq_Ft",
			minDataValue: 1,
			maxDataValue: 4371813,
			colors: [
				new Color([255, 0, 0]),
				new Color([255, 255, 0])
			]
		});
		buildings.setRenderer(renderer);
		map.addLayer(buildings);
		on(buildings, "load", function(e){
			map.setExtent(buildings.fullExtent);
		});
		createPopupTemplate(buildings);


		var communityAreas = new FeatureLayer("http://services1.arcgis.com/rxMuAi9NyHDn2zKX/arcgis/rest/services/Chicago_Community_Areas/FeatureServer/0");
		communityAreas.renderer = new SimpleRenderer({
			symbol: new SimpleFillSymbol(
				SimpleFillSymbol.STYLE_NULL,
				new SimpleLineSymbol(
					SimpleLineSymbol.STYLE_SOLID,
					new Color([255, 255, 255]),
					1
				),
				new Color([0, 0, 0])
			)
		});
		communityAreas.showLabels = true;
		communityAreas.setLabelingInfo([new LabelClass({
			labelExpressionInfo: {expression: "Proper($feature.COMMUNITY)"},
			symbol: new TextSymbol({
				color: new Color([255, 255, 255])
			})
		})]);
		map.addLayer(communityAreas);

		var legend = new Legend({
			map: map,
			layerInfos: [{
				title: "Building size (square feet)",
				layer: buildings
			}]
		}, "legend");
		legend.startup();
		return (buildings, communityAreas);
	}

	function createPopupTemplate(buildings){
		var template = new InfoTemplate("${F_ADD1} ${PRE_DIR1} ${ST_NAME1} ${ST_TYPE1}", 
			"Building status: ${BLDG_STATU}<br>\
			Name: ${BLDG_NAME1}<br>\
			Alternate Name: ${BLDG_NAME2}<br>\
			Comments: ${COMMENTS}<br>\
			Stories: ${STORIES}<br>\
			Number of Units: ${NO_OF_UNIT}<br>\
			Year built: ${YEAR_BUILT}<br>\
			Square feet: ${Area_Sq_Ft}<br>\
			Condition: ${BLDG_CONDI}<br>\
			Condition recorded: ${CONDITION_}\
		");
		buildings.setInfoTemplate(template);
	}
});