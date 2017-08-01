require([
	"esri/map",
	"esri/layers/FeatureLayer",
	"esri/renderers/SimpleRenderer",
	"esri/symbols/SimpleFillSymbol",
	"esri/symbols/SimpleLineSymbol",
	"esri/symbols/TextSymbol",
	"esri/Color",
	"esri/layers/LabelClass",
	"dojo/on",
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
	on
) {
	
	var map = new Map("map", {
		zoom: 8,
		basemap: "gray",
		showLabels: true
	});
	
	// Add layers to the map, get layers back
	var buildings, communityAreas = addLayers(map);

	function addLayers(map){
		var buildings = new FeatureLayer("https://services1.arcgis.com/g2TonOxuRkIqSOFx/arcgis/rest/services/Chicago_Buildings/FeatureServer/0");
		map.addLayer(buildings);
		on(buildings, "load", function(e){
			map.setExtent(buildings.fullExtent);
		});
		var communityAreas = new FeatureLayer("http://services1.arcgis.com/rxMuAi9NyHDn2zKX/arcgis/rest/services/Chicago_Community_Areas/FeatureServer/0");
		// var communityAreas = new FeatureLayer("https://services1.arcgis.com/g2TonOxuRkIqSOFx/arcgis/rest/services/ChicagoCommunityAreas/FeatureServer/0");
		communityAreas.renderer = new SimpleRenderer({
			symbol: new SimpleFillSymbol(
				SimpleFillSymbol.STYLE_NULL,
				new SimpleLineSymbol(
					SimpleLineSymbol.STYLE_SOLID,
					new Color([0, 0, 0]),
					1
				),
				new Color([0, 0, 0])
			)
		});
		communityAreas.showLabels = true;
		communityAreas.setLabelingInfo([new LabelClass({
			labelExpressionInfo: {expression: "Proper($feature.COMMUNITY)"},
			symbol: new TextSymbol()
		})]);
		map.addLayer(communityAreas);
		return (buildings, communityAreas);
	}
});