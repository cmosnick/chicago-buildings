import arcpy
import os
import json

# Get features form geojson file
g_json_file = '.\community_areas.json'
features = []
fields = []
with open(g_json_file) as file:
	g_json = json.load(file)
	features = [ arcpy.AsShape(geom['geometry']) for geom in g_json['features'] ]


# Create new shapefile / feature class
curr_dir = os.path.dirname(__file__)
data_path = os.path.join(curr_dir, 'community_areas')
shp_file_name = 'communityareas.shp'
# if not os.path.exists(os.path.join(data_path, shp_file_name)):
# 	fc = arcpy.CreateFeatureclass_management(data_path, shp_file_name, 'POLYGON')
# else:
# 	fc = os.path.join(data_path, shp_file_name)

# # Get fields
# fields = [field for field in g_json['features'][0]['properties'] if ("OBJECTID" not in field and "PERIMETER" not in field) ]
# fields.append("SHAPE@")

# # Add features to featureclass, save
# features_added = 0
# with arcpy.da.InsertCursor(fc, fields) as cursor:
# 	for row in features:
# 		# print arcpy.Describe(row)
		# cursor.insertRow(row)
# 		features_added += 1
# 		if 10%features_added == 0:
# 			print "{0} features added".format(features_added)

arcpy.JSONToFeatures_conversion(g_json_file, os.path.join(data_path, shp_file_name))