# California Air Quality Index Visualization

This project uses CesiumJS, Google Maps, to visualize fires and AQI data in the state of California. The open-source project [SoCalAirQuality](https://github.com/ian-r-rose/SoCalAirQuality) is also highlighted. SoCalAirQuality provides a simple way for people to track the air quality index of a given region on Twitter.

### Running this application

First, clone this repository. Next run:
```
npm install
npm start
```

and navigate to `localhost:8080`.

### Screenshots

![image](https://user-images.githubusercontent.com/39531367/133108520-1a90e288-e285-48e8-8d73-ed7e09ada6b5.png)

![image](https://user-images.githubusercontent.com/39531367/132901053-711ae4e8-3814-4018-80dd-b9b0535174b6.png)

![image](https://user-images.githubusercontent.com/39531367/133159194-103c6a04-6c52-419f-b649-1f5725bc3272.png)

### Available scripts

* `npm start` - Runs a webpack build with `webpack.config.js` and starts a development server
* `npm run build` - Runs a webpack build with `webpack.config.js` 

### Import named modules from Cesium

```
import { Color } from 'cesium';
var c = Color.fromRandom();
```

### Import Cesium static asset files

```
import "cesium/Build/Cesium/Widgets/widgets.css";
```

### Contributions

Pull requests are appreciated. Please use the same Contributor License Agreement (CLA)
