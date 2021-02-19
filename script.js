// Appel de la fonction : c'est ici qu'il faut changer les paramètres
// create('./src/127chemin.txt', './src/bier127.tsp')

function readFile(e) {
    var file = e.target.files[0];
    if (file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = evt => resolve(evt.target.result);
            reader.onerror = evt => resolve(false);
        })

    }
}

let _chemin = null
let _coords = null

document.getElementById("chemin_input").addEventListener("change", async (e) => {
    _chemin = await readFile(e);
    console.log(_chemin);
    if(_chemin != null && _coords != null) create(_chemin, _coords);
}, false);

document.getElementById("coords_input").addEventListener("change", async (e) => {
    _coords = await readFile(e);
    console.log(_coords);
    if(_chemin != null && _coords != null) create(_chemin, _coords);
}, false);

function reinit() {
    document.getElementById("coords_input").value = "";
    document.getElementById("chemin_input").value = "";
}
reinit();

async function create(__chemin, __coords) {
    let chemin = __chemin.split(/[;,]+/)

    const coords =  __coords.split(/[\r\n]+/).filter(e => e.length > 0).map(x => {
            elts = x.split(' ')
            return [parseFloat(elts[0]), parseFloat(elts[1])]
        });

    // let chemin = await (async () => {
    //     const response = await fetch(__chemin);
    //     text = await response.text()
    //     return text.split(/[;,]+/)
    // })();

    // const coords = await (async () => {
    //     const response = await fetch(__coords);
    //     text = await response.text()
    //     return text.split(/[\r\n]+/).filter(e => e.length > 0).map(x => {
    //         elts = x.split(' ')
    //         return [parseFloat(elts[0]), parseFloat(elts[1])]
    //     });
    // })();

    xMax = Math.max.apply(Math, coords.map(e => { return e[0]; }))
    yMax = Math.max.apply(Math, coords.map(e => { return e[1]; }))
    xMin = Math.min.apply(Math, coords.map(e => { return e[0]; }))
    yMin = Math.min.apply(Math, coords.map(e => { return e[1]; }))
    xLong = Math.abs(xMax - xMin)
    yLong = Math.abs(yMax - yMin)

    xFinal = window.innerWidth
    console.log(document.getElementById('input_div').clientHeight)
    yFinal = window.innerHeight - document.getElementById('input_div').clientHeight
    if (xLong > yLong) yFinal = yLong * (xFinal / xLong)
    else xFinal = xLong * (yFinal / yLong)

    lines = []
    chemin.push(chemin[0])
    for (let i = 1; i < chemin.length; i++) {
        // console.log(chemin[i], chemin[i-1])
        lines.push([{
            "x": coords[chemin[i - 1]][0],
            "y": coords[chemin[i - 1]][1],
        }, {
            "x": coords[chemin[i]][0],
            "y": coords[chemin[i]][1],
        }])
    }

    var margin = { top: 20, right: 20, bottom: 20, left: 20 },
        width = xFinal - 100,
        height = yFinal - 100;

    var x = d3.scale.linear()
        .range([0, width])
        .domain([xMin, xMax]);

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([yMin, yMax]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .x(function (d) { return x(d.x); })
        .y(function (d) { return y(d.y); });

    var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // svg.append("g")
    //     .attr("class", "xAxis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis);

    // svg.append("g")
    //     .attr("class", "yAxis")
    //     .call(yAxis);

    for (var i = 0; i < lines.length; i++) {
        svg.append("path")
            .attr("class", "plot")
            .datum(lines[i])
            .attr("d", line)
    }

    for (var i = 0; i < lines.length; i++) {
        svg.append("circle")
            .attr("class", "circle")
            .attr("cx", x(lines[i][1].x))
            .attr("cy", y(lines[i][1].y))
            .attr("r", 2);
    }
}