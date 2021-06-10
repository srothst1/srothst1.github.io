(function () {
    "use strict";

    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMTE4OTBkZi03Zjk4LTRjYmQtODk0MC1hNmQ0NTZiMTNjN2YiLCJpZCI6NTc3MzMsImlhdCI6MTYyMjU2NzkwNn0.XzpKx-KrkoFvL7JMHn4qfLtb3bq39mQlKRsTvRcWxCs';
    
    // Create the Cesium Viewer
    var viewer = new Cesium.Viewer('cesiumContainer', {
        scene3DOnly: true,
        selectionIndicator: false,
        baseLayerPicker: false
    });

    // Loading Natural Images and Terrain:
    // Remove standard layer
    viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
    // Add Sentinel-2 imagery
    viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3954 }));
    // Load world terrain
    viewer.terrainProvider = Cesium.createWorldTerrain({
        requestWaterMask : true, // required for water effects
        requestVertexNormals : true // required for terrain lighting
    });
    // Enable depth testing so things behind the terrain disappear.
    viewer.scene.globe.depthTestAgainstTerrain = true;

    // Initialize Scene:
    // add lighting based on sky (sun/moon)
    viewer.scene.globe.enableLighting = true;
    // update initial position to SF
    var initialPosition = new Cesium.Cartesian3.fromDegrees(-122.40424, 37.76675, 1500);
    var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(7.1077496389876024807, -31.987223091598949054, 0.025883251314954971306);
    var homeCameraView = {
        destination : initialPosition,
        orientation : {
            heading : initialOrientation.heading,
            pitch : initialOrientation.pitch,
            roll : initialOrientation.roll
        }
    };
    // Set the starting view
    viewer.scene.camera.setView(homeCameraView);
    // Add some camera flight animation options
    homeCameraView.duration = 2.0;
    homeCameraView.maximumHeight = 2000;
    homeCameraView.pitchAdjustHeight = 2000;
    homeCameraView.endTransform = Cesium.Matrix4.IDENTITY;
    viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
        e.cancel = true;
        viewer.scene.camera.flyTo(homeCameraView);
    });

    // Add a clock and a timeline:
    // update animation/time settings
    viewer.clock.shouldAnimate = true;
    viewer.clock.startTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
    viewer.clock.stopTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:20:00Z");
    viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
    viewer.clock.multiplier = 2;
    viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime);
    var kmlOptions = {
        camera : viewer.scene.camera,
        canvas : viewer.scene.canvas,
        clampToGround : true
    };

    //////////////////////////////////////////////////////////////////////////
    // Loading points of interest and parks in each city
    // TODO: add more POI for cities
    //////////////////////////////////////////////////////////////////////////

    //New York City
    // Load geocache points of interest from a KML file (dots on map)
    // Data from : http://catalog.opendata.city/dataset/pediacities-nyc-neighborhoods/resource/91778048-3c58-449c-a3f9-365ed203e914
    var geocachePromise = Cesium.KmlDataSource.load('./Source/SampleData/sampleGeocacheLocations.kml', kmlOptions);
    // Add geocache billboard entities to scene and style them
    geocachePromise.then(function(dataSource) {
        // Add the new data as entities to the viewer
        viewer.dataSources.add(dataSource);

        // Get the array of entities
        var geocacheEntities = dataSource.entities.values;

        for (var i = 0; i < geocacheEntities.length; i++) {
            var entity = geocacheEntities[i];
            if (Cesium.defined(entity.billboard)) {
                // Adjust the vertical origin so pins sit on terrain
                entity.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
                // Disable the labels to reduce clutter
                entity.label = undefined;
                // Add distance display condition
                entity.billboard.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(10.0, 20000.0);
                // Compute latitude and longitude in degrees
                var cartographicPosition = Cesium.Cartographic.fromCartesian(entity.position.getValue(Cesium.JulianDate.now()));
                var latitude = Cesium.Math.toDegrees(cartographicPosition.latitude);
                var longitude = Cesium.Math.toDegrees(cartographicPosition.longitude);
                //console.log(latitude, longitude);
                // Modify description
                var description = '<table class="cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>' +
                    '<tr><th>' + "Longitude" + '</th><td>' + longitude.toFixed(5) + '</td></tr>' +
                    '<tr><th>' + "Latitude" + '</th><td>' + latitude.toFixed(5) + '</td></tr>' +
                    '</tbody></table>';
                entity.description = description;
            }
        }
    });
    var geojsonOptions = {
        clampToGround : true
    };

    //San Francisco
    // Load geocache points of interest from a KML file (parks on map)
    // Data from : https://catalog.data.gov/sq/dataset/park-lands-recreation-and-parks-department/resource/dbfe39b9-fe1e-4a74-ab2d-2d1a2fe73083
    var geocachePromise = Cesium.KmlDataSource.load('./Source/SampleData/ParkLandsRecreationandParksDepartment.kml', kmlOptions);
    // Add geocache billboard entities to scene and style them
    geocachePromise.then(function(dataSource) {
        // Add the new data as entities to the viewer
        viewer.dataSources.add(dataSource);

        // Get the array of entities
        var geocacheEntities = dataSource.entities.values;

        for (var i = 0; i < geocacheEntities.length; i++) {
            var entity = geocacheEntities[i];
            if (Cesium.defined(entity.billboard)) {
                // Adjust the vertical origin so pins sit on terrain
                entity.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
                // Disable the labels to reduce clutter
                //entity.label = undefined;
                // Add distance display condition
                entity.billboard.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(10.0, 20000.0);
                // Compute latitude and longitude in degrees
                var cartographicPosition = Cesium.Cartographic.fromCartesian(entity.position.getValue(Cesium.JulianDate.now()));
                var latitude = Cesium.Math.toDegrees(cartographicPosition.latitude);
                var longitude = Cesium.Math.toDegrees(cartographicPosition.longitude);
                // Modify description
                var description = '<table class="cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>' +
                    '<tr><th>' + "Longitude" + '</th><td>' + longitude.toFixed(5) + '</td></tr>' +
                    '<tr><th>' + "Latitude" + '</th><td>' + latitude.toFixed(5) + '</td></tr>' +
                    '</tbody></table>';
                entity.description = description;
            }
        }
    });
    var geojsonOptions = {
        clampToGround : true
    };

    //////////////////////////////////////////////////////////////////////////
    // Load districts in each city
    // TODO: add more cities
    //////////////////////////////////////////////////////////////////////////

    //New York
    // Load neighborhood boundaries from a GeoJson file (regions)
    var neighborhoodsPromise = Cesium.GeoJsonDataSource.load('./Source/SampleData/SanFrancisco.Neighborhoods.json', geojsonOptions);
    // Save an new entity collection of neighborhood data
    var neighborhoods;
    neighborhoodsPromise.then(function(dataSource) {
        // Add the new data as entities to the viewer
        viewer.dataSources.add(dataSource);
        neighborhoods = dataSource.entities;

        // Get the array of entities
        var neighborhoodEntities = dataSource.entities.values;
        for (var i = 0; i < neighborhoodEntities.length; i++) {
            var entity = neighborhoodEntities[i];

            if (Cesium.defined(entity.polygon)) {
                // Use kml neighborhood value as entity name
                entity.name = entity.properties.neighborhood;
                // Set the polygon material to a random, translucent color
                entity.polygon.material = Cesium.Color.fromRandom({
                    red : 0.1,
                    maximumGreen : 0.5,
                    minimumBlue : 0.5,
                    alpha : 0.6
                });
                // Tells the polygon to color the terrain. ClassificationType.CESIUM_3D_TILE will color the 3D tileset, and ClassificationType.BOTH will color both the 3d tiles and terrain (BOTH is the default)
                entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN;
                // Generate Polygon center
                var polyPositions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
                var polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
                polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
                entity.position = polyCenter;
                // Generate labels
                entity.label = {
                    text : entity.name,
                    showBackground : true,
                    scale : 0.6,
                    horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                    distanceDisplayCondition : new Cesium.DistanceDisplayCondition(10.0, 8000.0),
                    disableDepthTestDistance : 100.0
                };
            }
        }
    });

    //San Francisco
    // Load neighborhood boundaries from a GeoJson file (districts)
    // Data from : https://data.cityofnewyork.us/City-Government/Neighborhood-Tabulation-Areas/cpf4-rkhq
    var neighborhoodsPromise = Cesium.GeoJsonDataSource.load('./Source/SampleData/sampleNeighborhoods.geojson', geojsonOptions);
    // Save an new entity collection of neighborhood data
    var neighborhoods;
    neighborhoodsPromise.then(function(dataSource) {
        // Add the new data as entities to the viewer
        viewer.dataSources.add(dataSource);
        neighborhoods = dataSource.entities;

        // Get the array of entities
        var neighborhoodEntities = dataSource.entities.values;
        for (var i = 0; i < neighborhoodEntities.length; i++) {
            var entity = neighborhoodEntities[i];

            if (Cesium.defined(entity.polygon)) {
                // Use kml neighborhood value as entity name
                entity.name = entity.properties.neighborhood;
                // Set the polygon material to a random, translucent color
                entity.polygon.material = Cesium.Color.fromRandom({
                    red : 0.1,
                    maximumGreen : 0.5,
                    minimumBlue : 0.5,
                    alpha : 0.6
                });
                // Tells the polygon to color the terrain. ClassificationType.CESIUM_3D_TILE will color the 3D tileset, and ClassificationType.BOTH will color both the 3d tiles and terrain (BOTH is the default)
                entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN;
                // Generate Polygon center
                var polyPositions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
                var polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
                polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
                entity.position = polyCenter;
                // Generate labels
                entity.label = {
                    text : entity.name,
                    showBackground : true,
                    scale : 0.6,
                    horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                    distanceDisplayCondition : new Cesium.DistanceDisplayCondition(10.0, 10000.0),
                    disableDepthTestDistance : 100.0
                };
            }
        }
    });

    //Los Angeles
    // Load neighborhood boundaries from a GeoJson file (districts)
    // Data from : http://gis.ucla.edu/geodata/dataset/93d71e41-6196-4ecb-9ddd-15f1a4a7630c/resource/6cde4e9e-307c-477d-9089-cae9484c8bc1/download/la-county-neighborhoods-v6.geojson
    var neighborhoodsPromise = Cesium.GeoJsonDataSource.load('./Source/SampleData/losangelesn.geojson', geojsonOptions);
    // Save an new entity collection of neighborhood data
    var neighborhoods;
    neighborhoodsPromise.then(function(dataSource) {
        // Add the new data as entities to the viewer
        viewer.dataSources.add(dataSource);
        neighborhoods = dataSource.entities;

        // Get the array of entities
        var neighborhoodEntities = dataSource.entities.values;
        for (var i = 0; i < neighborhoodEntities.length; i++) {
            var entity = neighborhoodEntities[i];

            if (Cesium.defined(entity.polygon)) {
                // Use kml neighborhood value as entity name
                entity.name = entity.properties.neighborhood;
                // Set the polygon material to a random, translucent color
                entity.polygon.material = Cesium.Color.fromRandom({
                    red : 0.1,
                    maximumGreen : 0.5,
                    minimumBlue : 0.5,
                    alpha : 0.6
                });
                // Tells the polygon to color the terrain. ClassificationType.CESIUM_3D_TILE will color the 3D tileset, and ClassificationType.BOTH will color both the 3d tiles and terrain (BOTH is the default)
                entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN;
                // Generate Polygon center
                var polyPositions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
                var polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
                polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
                entity.position = polyCenter;
                // Generate labels
                entity.label = {
                    text : entity.name,
                    showBackground : true,
                    scale : 0.6,
                    horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                    distanceDisplayCondition : new Cesium.DistanceDisplayCondition(10.0, 10000.0),
                    disableDepthTestDistance : 100.0
                };
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Inlude Drone Functionality
    //TODO: make drone follow San Andreas Fault line through SF
    //////////////////////////////////////////////////////////////////////////

    // Load a drone flight path from a CZML file
    var dronePromise = Cesium.CzmlDataSource.load('./Source/SampleData/sampleFlight.czml');
    //var dronePromise = Cesium.CzmlDataSource.load('./Source/SampleData/sampleFlight2.czml');

    // Save a new drone model entity
    var drone;
    dronePromise.then(function(dataSource) {
        viewer.dataSources.add(dataSource);
        // Get the entity using the id defined in the CZML data
        drone = dataSource.entities.getById('Aircraft/Aircraft1');
        // Attach a 3D model
        drone.model = {
            uri : './Source/SampleData/Models/CesiumDrone.gltf',
            minimumPixelSize : 128,
            maximumScale : 1000,
            silhouetteColor : Cesium.Color.WHITE,
            silhouetteSize : 2
        };
        // Add computed orientation based on sampled positions
        drone.orientation = new Cesium.VelocityOrientationProperty(drone.position);

        // Smooth path interpolation
        drone.position.setInterpolationOptions({
            interpolationAlgorithm : Cesium.HermitePolynomialApproximation,
            interpolationDegree : 2
        });
        drone.viewFrom = new Cesium.Cartesian3(-30, 0, 0);
    });

    //////////////////////////////////////////////////////////////////////////
    // Load and Style 3D Tileset
    //TODO: update earthquake radius gradient
    //TODO: add feature picking -> select a building and give a risk assesment
    //////////////////////////////////////////////////////////////////////////

    // Load buildings for all locations
    var city = viewer.scene.primitives.add( Cesium.createOsmBuildings());

    //NEW: define a standard style
    var normalStyle = new Cesium.Cesium3DTileStyle({
        show : true
    });

    //NEW: Define a white, transparent building style
    var transparentStyle = new Cesium.Cesium3DTileStyle({
        color : "color('white', 0.3)",
        show : true
    });

    //TODO: Buildings that are residential, appartment, tall, etc.
    var currentHighRisk = new Cesium.Cesium3DTileStyle({
        show: "${feature['building']} === 'residential' || ${feature['building']} === 'apartments' || ${feature['cesium#estimatedHeight']} >= 100"
    });

    //NEW: sanFrancisco1906Earthquake
    var sanFrancisco1906Earthquake = new Cesium.Cesium3DTileStyle({
      defines: {
        distanceFromComplex:
        "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(-122.44182,37.80474))"
      },
      color: {
        conditions: [
          ["${distanceFromComplex} > 0.1", "color('#006400')"],
          ["${distanceFromComplex} > 0.06", "color('#90ee90')"],
          ["${distanceFromComplex} > 0.03", "color('#f5af71')"],
          ["${distanceFromComplex} > 0.001", "color('#f58971')"],
          ["${distanceFromComplex} > 0.005", "color('#d65c5c')"],
          ["true", "color('#ff0000')"],
        ]
      }
    });

    //NEW: sanFrancisco1906Earthquake
    var sanFrancisco1906EarthquakeHighRisk = new Cesium.Cesium3DTileStyle({
      defines: {
        distanceFromComplex:
        "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(-122.44182,37.80474))"
      },
      color: {
        conditions: [
          ["${distanceFromComplex} > 0.1", "color('#006400')"],
          ["${distanceFromComplex} > 0.06", "color('#90ee90')"],
          ["${distanceFromComplex} > 0.03", "color('#f5af71')"],
          ["${distanceFromComplex} > 0.001", "color('#f58971')"],
          ["${distanceFromComplex} > 0.005", "color('#d65c5c')"],
          ["true", "color('#ff0000')"],
        ],
      },
      show: "${feature['building']} === 'residential' || ${feature['building']} === 'apartments' || ${feature['building']} === 'commercial'"
    });

    //NEW: sanFrancisco1989Earthquake
    var sanFrancisco1989Earthquake = new Cesium.Cesium3DTileStyle({
      defines: {
        distanceFromComplex:
        "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(-122.39465,37.75796))"
      },
      color: {
        conditions: [
          ["${distanceFromComplex} > 0.1", "color('#006400')"],
          ["${distanceFromComplex} > 0.06", "color('#90ee90')"],
          ["${distanceFromComplex} > 0.03", "color('#f5af71')"],
          ["${distanceFromComplex} > 0.001", "color('#f58971')"],
          ["${distanceFromComplex} > 0.005", "color('#d65c5c')"],
          ["true", "color('#ff0000')"],
        ]
      }
    });

    //NEW: sanFrancisco1989Earthquake
    var sanFrancisco1989EarthquakeHighRisk = new Cesium.Cesium3DTileStyle({
      defines: {
        distanceFromComplex:
        "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(-122.39465,37.75796))"
      },
      color: {
        conditions: [
          ["${distanceFromComplex} > 0.1", "color('#006400')"],
          ["${distanceFromComplex} > 0.06", "color('#90ee90')"],
          ["${distanceFromComplex} > 0.03", "color('#f5af71')"],
          ["${distanceFromComplex} > 0.001", "color('#f58971')"],
          ["${distanceFromComplex} > 0.005", "color('#d65c5c')"],
          ["true", "color('#ff0000')"],
        ],
      },
      show: "${feature['building']} === 'residential' || ${feature['building']} === 'apartments' || ${feature['building']} === 'commercial'"
    });

    //NEW: sanFrancisco1957Earthquake
    var sanFrancisco1957Earthquake = new Cesium.Cesium3DTileStyle({
      defines: {
        distanceFromComplex:
        "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(-122.47235,37.71336))"
      },
      color: {
        conditions: [
          ["${distanceFromComplex} > 0.1", "color('#006400')"],
          ["${distanceFromComplex} > 0.06", "color('#90ee90')"],
          ["${distanceFromComplex} > 0.03", "color('#f5af71')"],
          ["${distanceFromComplex} > 0.001", "color('#f58971')"],
          ["${distanceFromComplex} > 0.005", "color('#d65c5c')"],
          ["true", "color('#ff0000')"],
        ]
      }
    });

    //NEW: sanFrancisco1957Earthquake
    var sanFrancisco1957EarthquakeHighRisk = new Cesium.Cesium3DTileStyle({
      defines: {
        distanceFromComplex:
        "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(-122.47235,37.71336))"
      },
      color: {
        conditions: [
          ["${distanceFromComplex} > 0.1", "color('#006400')"],
          ["${distanceFromComplex} > 0.06", "color('#90ee90')"],
          ["${distanceFromComplex} > 0.03", "color('#f5af71')"],
          ["${distanceFromComplex} > 0.001", "color('#f58971')"],
          ["${distanceFromComplex} > 0.005", "color('#d65c5c')"],
          ["true", "color('#ff0000')"],
        ],
      },
      show: "${feature['building']} === 'residential' || ${feature['building']} === 'apartments' || ${feature['building']} === 'commercial'"
    });

    //NEW: longBeach1933Earthquake
    var longBeach1933Earthquake = new Cesium.Cesium3DTileStyle({
      defines: {
        distanceFromComplex:
        "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(-118.18665,33.80829))"
      },
      color: {
        conditions: [
          ["${distanceFromComplex} > 0.1", "color('#006400')"],
          ["${distanceFromComplex} > 0.06", "color('#90ee90')"],
          ["${distanceFromComplex} > 0.03", "color('#f5af71')"],
          ["${distanceFromComplex} > 0.001", "color('#f58971')"],
          ["${distanceFromComplex} > 0.005", "color('#d65c5c')"],
          ["true", "color('#ff0000')"],
        ],
      }
    });

    //NEW: longBeach1933Earthquake
    var longBeach1933EarthquakeHighRisk = new Cesium.Cesium3DTileStyle({
      defines: {
        distanceFromComplex:
        "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(-118.18665,33.80829))"
      },
      color: {
        conditions: [
          ["${distanceFromComplex} > 0.1", "color('#006400')"],
          ["${distanceFromComplex} > 0.06", "color('#90ee90')"],
          ["${distanceFromComplex} > 0.03", "color('#f5af71')"],
          ["${distanceFromComplex} > 0.001", "color('#f58971')"],
          ["${distanceFromComplex} > 0.005", "color('#d65c5c')"],
          ["true", "color('#ff0000')"],
        ],
      },
        show: "${feature['building']} === 'residential' || ${feature['building']} === 'apartments' || ${feature['building']} === 'commercial'"
    });

    //NEW: sanFernando1971Earthquake
    var sanFernando1971Earthquake = new Cesium.Cesium3DTileStyle({
      defines: {
        distanceFromComplex:
        "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(-118.47878,34.18161))"
      },
      color: {
        conditions: [
          ["${distanceFromComplex} > 0.1", "color('#006400')"],
          ["${distanceFromComplex} > 0.06", "color('#90ee90')"],
          ["${distanceFromComplex} > 0.03", "color('#f5af71')"],
          ["${distanceFromComplex} > 0.001", "color('#f58971')"],
          ["${distanceFromComplex} > 0.005", "color('#d65c5c')"],
          ["true", "color('#ff0000')"],
        ],
      }
    });

    //NEW: sanFernando1971Earthquake
    var sanFernando1971EarthquakeHighRisk = new Cesium.Cesium3DTileStyle({
      defines: {
        distanceFromComplex:
        "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(-118.47878,34.18161))"
      },
      color: {
        conditions: [
          ["${distanceFromComplex} > 0.1", "color('#006400')"],
          ["${distanceFromComplex} > 0.06", "color('#90ee90')"],
          ["${distanceFromComplex} > 0.03", "color('#f5af71')"],
          ["${distanceFromComplex} > 0.001", "color('#f58971')"],
          ["${distanceFromComplex} > 0.005", "color('#d65c5c')"],
          ["true", "color('#ff0000')"],
        ],
      },
        show: "${feature['building']} === 'residential' || ${feature['building']} === 'apartments' || ${feature['building']} === 'commercial'"
    });

    //NEW: newYorkCity2001Earthquake
    var newYorkCity2001Earthquake = new Cesium.Cesium3DTileStyle({
      defines: {
        distanceFromComplex:
        "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(-73.95761,40.82189))"
      },
      color: {
        conditions: [
          ["${distanceFromComplex} > 0.1", "color('#006400')"],
          ["${distanceFromComplex} > 0.06", "color('#90ee90')"],
          ["${distanceFromComplex} > 0.03", "color('#f5af71')"],
          ["${distanceFromComplex} > 0.001", "color('#f58971')"],
          ["${distanceFromComplex} > 0.005", "color('#d65c5c')"],
          ["true", "color('#ff0000')"],
        ],
      }
    });

    //NEW: newYorkCity2001Earthquake
    var newYorkCity2001EarthquakeHighRisk = new Cesium.Cesium3DTileStyle({
      defines: {
        distanceFromComplex:
        "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(-73.95761,40.82189))"
      },
      color: {
        conditions: [
          ["${distanceFromComplex} > 0.1", "color('#006400')"],
          ["${distanceFromComplex} > 0.06", "color('#90ee90')"],
          ["${distanceFromComplex} > 0.03", "color('#f5af71')"],
          ["${distanceFromComplex} > 0.001", "color('#f58971')"],
          ["${distanceFromComplex} > 0.005", "color('#d65c5c')"],
          ["true", "color('#ff0000')"],
        ],
      },
        show: "${feature['building']} === 'residential' || ${feature['building']} === 'apartments' || ${feature['building']} === 'commercial'"
    });

    //NEW: newYorkCity022001Earthquake
    var newYorkCity022001Earthquake = new Cesium.Cesium3DTileStyle({
      defines: {
        distanceFromComplex:
        "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(-73.93684,40.75384))"
      },
      color: {
        conditions: [
          ["${distanceFromComplex} > 0.1", "color('#006400')"],
          ["${distanceFromComplex} > 0.06", "color('#90ee90')"],
          ["${distanceFromComplex} > 0.03", "color('#f5af71')"],
          ["${distanceFromComplex} > 0.001", "color('#f58971')"],
          ["${distanceFromComplex} > 0.005", "color('#d65c5c')"],
          ["true", "color('#ff0000')"],
        ],
      }
    });

    //NEW: newYorkCity022001Earthquake
    var newYorkCity022001EarthquakeHighRisk = new Cesium.Cesium3DTileStyle({
      defines: {
        distanceFromComplex:
        "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(-73.93684,40.75384))"
      },
      color: {
        conditions: [
          ["${distanceFromComplex} > 0.1", "color('#006400')"],
          ["${distanceFromComplex} > 0.06", "color('#90ee90')"],
          ["${distanceFromComplex} > 0.03", "color('#f5af71')"],
          ["${distanceFromComplex} > 0.001", "color('#f58971')"],
          ["${distanceFromComplex} > 0.005", "color('#d65c5c')"],
          ["true", "color('#ff0000')"],
        ],
      },
        show: "${feature['building']} === 'residential' || ${feature['building']} === 'apartments' || ${feature['building']} === 'commercial'"
    });

    //NEW: charleston1886Earthquake
    var charleston1886Earthquake = new Cesium.Cesium3DTileStyle({
      defines: {
        distanceFromComplex:
        "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(-79.9427,32.77765))"
      },
      color: {
        conditions: [
          ["${distanceFromComplex} > 0.1", "color('#006400')"],
          ["${distanceFromComplex} > 0.06", "color('#90ee90')"],
          ["${distanceFromComplex} > 0.03", "color('#f5af71')"],
          ["${distanceFromComplex} > 0.001", "color('#f58971')"],
          ["${distanceFromComplex} > 0.005", "color('#d65c5c')"],
          ["true", "color('#ff0000')"],
        ],
      }
    });

    //NEW: charleston1886Earthquake
    var charleston1886EarthquakeHighRisk = new Cesium.Cesium3DTileStyle({
      defines: {
        distanceFromComplex:
        "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(-79.9427,32.77765))"
      },
      color: {
        conditions: [
          ["${distanceFromComplex} > 0.1", "color('#006400')"],
          ["${distanceFromComplex} > 0.06", "color('#90ee90')"],
          ["${distanceFromComplex} > 0.03", "color('#f5af71')"],
          ["${distanceFromComplex} > 0.001", "color('#f58971')"],
          ["${distanceFromComplex} > 0.005", "color('#d65c5c')"],
          ["true", "color('#ff0000')"],
        ],
      },
        show: "${feature['building']} === 'residential' || ${feature['building']} === 'apartments' || ${feature['building']} === 'commercial'"
    });

    //Logic for updating 3D tiles
    var tileStyle = document.getElementById('tileStyle');
    function set3DTileStyle() {
        var selectedStyle = tileStyle.options[tileStyle.selectedIndex].value;
        if (selectedStyle === 'none') {
            city.style = normalStyle;
        } else if (selectedStyle === 'NPV') {
            console.log("NPV")
            city.style = transparentStyle;
        } else if (selectedStyle === 'ACHRS') {
            console.log("ACHRS")
            city.style = currentHighRisk;
        } else if (selectedStyle === 'SFEQ') {
            console.log("SFEQ")
            city.style = sanFrancisco1906Earthquake;
        } else if (selectedStyle === 'SFEQHR') {
            console.log("SFEQHR")
            city.style = sanFrancisco1906EarthquakeHighRisk;
        } else if (selectedStyle === 'SFEQ2') {
            console.log("SFEQ2")
            city.style = sanFrancisco1989Earthquake;
        } else if (selectedStyle === 'SFEQ2HR') {
            console.log("SFEQ2HR")
            city.style = sanFrancisco1989EarthquakeHighRisk;
        } else if (selectedStyle === 'SFEQ3') {
            console.log("SFEQ3")
            city.style = sanFrancisco1957Earthquake;
        } else if (selectedStyle === 'SFEQ3HR') {
            console.log("SFEQ3HR")
            city.style = sanFrancisco1957EarthquakeHighRisk;
        } else if (selectedStyle === 'LBEQ') {
            console.log("LBEQ")
            city.style = longBeach1933Earthquake;
        } else if (selectedStyle === 'LBEQHR') {
            console.log("LBQHR")
            city.style = longBeach1933EarthquakeHighRisk;
        } else if (selectedStyle === 'SFLAEQ') {
            console.log("SFLAEQ")
            city.style = sanFernando1971Earthquake;
        } else if (selectedStyle === 'SFLAEQHR') {
            console.log("SFLAEQHR")
            city.style = sanFernando1971EarthquakeHighRisk;
        } else if (selectedStyle === 'NYEQ') {
            console.log("NYEQ")
            city.style = newYorkCity2001Earthquake;
        } else if (selectedStyle === 'NYEQHR') {
            console.log("NYEQHR")
            city.style = newYorkCity2001EarthquakeHighRisk;
        } else if (selectedStyle === 'NYEQ2') {
            console.log("NYEQ2")
            city.style = newYorkCity022001Earthquake;
        } else if (selectedStyle === 'NYEQ2HR') {
            console.log("NYEQ2HR")
            city.style = newYorkCity022001EarthquakeHighRisk;
        } else if (selectedStyle === 'CEQ') {
            console.log("CEQ")
            city.style = charleston1886Earthquake;
        } else if (selectedStyle === 'CEQHR') {
            console.log("CEQHR")
            city.style = charleston1886EarthquakeHighRisk;
        }
    }
    tileStyle.addEventListener('change', set3DTileStyle);

    //////////////////////////////////////////////////////////////////////////
    // Default: Custom mouse interaction for highlighting and selecting
    //////////////////////////////////////////////////////////////////////////

    // If the mouse is over a point of interest, change the entity billboard scale and color
    var previousPickedEntity;
    var handler = viewer.screenSpaceEventHandler;
    handler.setInputAction(function (movement) {
        var pickedPrimitive = viewer.scene.pick(movement.endPosition);
        var pickedEntity = Cesium.defined(pickedPrimitive) ? pickedPrimitive.id : undefined;
        // Unhighlight the previously picked entity
        if (Cesium.defined(previousPickedEntity)) {
            previousPickedEntity.billboard.scale = 1.0;
            previousPickedEntity.billboard.color = Cesium.Color.WHITE;
        }
        // Highlight the currently picked entity
        if (Cesium.defined(pickedEntity) && Cesium.defined(pickedEntity.billboard)) {
            pickedEntity.billboard.scale = 2.0;
            pickedEntity.billboard.color = Cesium.Color.ORANGERED;
            previousPickedEntity = pickedEntity;
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    //////////////////////////////////////////////////////////////////////////
    // Default: Setup Camera Modes
    //////////////////////////////////////////////////////////////////////////

    var freeModeElement = document.getElementById('freeMode');
    var droneModeElement = document.getElementById('droneMode');

    // Create a follow camera by tracking the drone entity
    function setViewMode() {
        if (droneModeElement.checked) {
            viewer.trackedEntity = drone;
        } else {
            viewer.trackedEntity = undefined;
            viewer.scene.camera.flyTo(homeCameraView);
        }
    }

    freeModeElement.addEventListener('change', setViewMode);
    droneModeElement.addEventListener('change', setViewMode);

    viewer.trackedEntityChanged.addEventListener(function() {
        if (viewer.trackedEntity === drone) {
            freeModeElement.checked = false;
            droneModeElement.checked = true;
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Default: Setup Display Options
    //////////////////////////////////////////////////////////////////////////

    var shadowsElement = document.getElementById('shadows');

    shadowsElement.addEventListener('change', function (e) {
        viewer.shadows = e.target.checked;
    });

    var loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'block';
    city.readyPromise.then(function () {
        loadingIndicator.style.display = 'none';
    });

}());
