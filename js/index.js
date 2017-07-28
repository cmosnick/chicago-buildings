require([
	"esri/map",
	"esri/layers/FeatureLayer",
	"esri/renderers/SimpleRenderer",
	"esri/symbols/SimpleFillSymbol",
	"esri/symbols/SimpleLineSymbol",
	"esri/Color",
	"dojo/on",
	"dojo/domReady!"],
function(
	Map,
	FeatureLayer,
	SimpleRenderer,
	SimpleFillSymbol,
	SimpleLineSymbol,
	Color,
	on
) {
	
	var map = new Map("map", {
		center: [-118, 34.5],
		zoom: 8,
		basemap: "topo"
	});
	
	var buildings = new FeatureLayer("https://services1.arcgis.com/g2TonOxuRkIqSOFx/arcgis/rest/services/Chicago_Buildings/FeatureServer/0");
	map.addLayer(buildings);
	on(buildings, "load", function(e){
		map.setExtent(buildings.fullExtent);
	});
	var communityAreas = new FeatureLayer("http://services1.arcgis.com/rxMuAi9NyHDn2zKX/arcgis/rest/services/Chicago_Community_Areas/FeatureServer/0");
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
	map.addLayer(communityAreas);
});