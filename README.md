This app can be run from a web browser using the following link: https://srothst1.github.io/
This app can also be run as follows:

This app comes with a simple server ([`server.js`](./server.js)), but can be served through any means.

To use the packaged server:

* Install [node.js](http://nodejs.org/)
* From the `cesium-workshop` root directory, run
```
npm install
npm start
```

Browse to `http://localhost:8080/`

>Have python installed?  If so, from the `cesium-workshop` root directory run
>```
>python -m SimpleHTTPServer 8080
>```
>(Starting with Python 3, use `python -m http.server 8080`).
>
>Browse to `http://localhost:8080/`

What's here?
------------

* [index.html](index.html) - A simple HTML page. Run a local web server, and browse to index.html to run your app, which will show our sample application.
* [Source](Source/) - Contains [App.js](Source/App.js) which is referenced from index.html.  This is where the app's code goes.
* [server.js](server.js) - A simple node.js server for serving your Cesium app.  See the **Local server** section.
* [package.json](package.json) - Dependencies for the node.js server.
* [LICENSE](LICENSE.md) - A license file already referencing Cesium as a third-party.  This starter app is licensed with [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html) (free for commercial and non-commercial use).  You can, of course, license your code however you want.
* [.gitignore](.gitignore) - A small list of files not to include in the git repo.  Add to this as needed.

Cesium resources
----------------

* [Reference Documentation](https://cesium.com/docs/cesiumjs-ref-doc/) : A complete guide to the Cesium API containing many code snippets.
* [Sandcastle](https://sandcastle.cesium.com/) : A live-coding environment with a large gallery of code examples.
* [Tutorials](https://cesium.com/docs/) : Detailed introductions to areas of Cesium development.
* [Cesium Forum](https://groups.google.com/forum/?hl=en#!forum/cesium-dev) : A resource for asking and answering Cesium-related questions.
