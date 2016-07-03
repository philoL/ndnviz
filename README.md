# NDN-VIZ: An Interactive Visualization Tool for Analyzing NDN Traffic Logs


**NDN-VIZ** is an interactive visualization tool for analyzing NDN traffic logs (currently only support ndndump). NDN-VIZ uses <a href="https://d3js.org">D3</a> to build visualization. D3 is a JavaScript library that provides powerful visualization components and a data-driven approach to DOM manipulation.

## Resources
* [Demo](https://www.cs.arizona.edu/people/philoliang/ndnviz/)

## Installing

After `git clone` the repositoory, you need 4 more steps to visualize your NDN traffic logs.

**Step 1**: Prepare your topology configuration file ([example](https://github.com/philoL/ndnviz/blob/master/data/6nodes.conf)), put it in the `/data` directory and run `/data/parse_topology.py` to convert the configuration file into a json file that NDN-VIZ can recognize.

**Step 2**: Put your NDN traffic logs in under the directory `/data/<your-directory-name>`, and run `/data/parse_ndndump.py` to convert your traffic logs into a json file that NDN-VIZ can recognize.

**Step 3**: Put the Json file names generated in step 1 & 2 into `/js/custom.js`

```html
line 40 : d3.json("data/<your-topology-json>", function(error, graph) {
```

```html
line 234 : d3.json("data/<your-ndndump-json>", function(error, json) {
```

**Step 4**: Run a simple http server, e.g., run `python3 -m http.server`, visit `127.0.0.1:8000` in a browser and start to use NDN-VIZ.


License
-------
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
A copy of the GNU Lesser General Public License is in the file COPYING.
