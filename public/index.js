window.d3 = d3

const radians = 0.0174532925
const clockRadius = 200
const margin = 50
const width = (clockRadius + margin) * 2
const height = (clockRadius + margin) * 2
const hourHandLength = (2 * clockRadius) / 3
const minuteHandLength = clockRadius
const secondHandLength = clockRadius - 12
const secondHandBalance = 30
const secondTickStart = clockRadius
const secondTickLength = -10
const hourTickStart = clockRadius
const hourTickLength = -18
const secondLabelRadius = clockRadius + 16
const secondLabelYOffset = 5
const hourLabelRadius = clockRadius - 40
const hourLabelYOffset = 7

const hourScale = d3.scaleLinear().range([0, 330]).domain([0, 11])

const minuteScale = d3.scaleLinear().range([0, 354]).domain([0, 59])

const secondScale = minuteScale

let stopped = false;

const handData = [
  {
    type: "hour",
    value: 0,
    length: -hourHandLength,
    scale: hourScale,
  },
  {
    type: "minute",
    value: 0,
    length: -minuteHandLength,
    scale: minuteScale,
  },
  {
    type: "second",
    value: 0,
    length: -secondHandLength,
    scale: secondScale,
    balance: secondHandBalance,
  },
]

function drawClock() {
  //create all the clock elements
  updateData() //draw them in the correct starting position
  
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  const face = svg
    .append("g")
    .attr("id", "clock-face")
    .attr(
      "transform",
      "translate(" + (clockRadius + margin) + "," + (clockRadius + margin) + ")"
    )

  face
    .append("circle")
    .attr("id", "button")
    .attr("cx", 220)
    .attr("cy", -200)
    .attr("fill", "black")
    .attr("height", "50px")
    .attr("r", 20)
    .on("click", () => {
      stopped = !stopped;
    })

  //add marks for seconds
  // face
  //   .selectAll(".second-tick")
  //   .data(d3.range(0, 60))
  //   .enter()
  //   .append("line")
  //   .attr("class", "second-tick")
  //   .attr("x1", 0)
  //   .attr("x2", 0)
  //   .attr("y1", secondTickStart)
  //   .attr("y2", secondTickStart + secondTickLength)
  //   .attr("transform", function (d) {
  //     return "rotate(" + secondScale(d) + ")"
  //   })

  // //and labels
  // face
  //   .selectAll(".second-label")
  //   .data(d3.range(5, 61, 5))
  //   .enter()
  //   .append("text")
  //   .attr("class", "second-label")
  //   .attr("text-anchor", "middle")
  //   .attr("x", function (d) {
  //     return secondLabelRadius * Math.sin(secondScale(d) * radians)
  //   })
  //   .attr("y", function (d) {
  //     return (
  //       -secondLabelRadius * Math.cos(secondScale(d) * radians) +
  //       secondLabelYOffset
  //     )
  //   })
  //   .text(function (d) {
  //     return d
  //   })

  //... and hours
  face
    .selectAll(".hour-tick")
    .data(d3.range(0, 12))
    .enter()
    .append("line")
    .attr("class", "hour-tick")
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", hourTickStart)
    .attr("y2", hourTickStart + hourTickLength)
    .attr("transform", function (d) {
      const hourRotate = hourScale(d);
      return `rotate(${hourRotate})`
    })

  face
    .selectAll(".hour-label")
    .data(d3.range(3, 13, 3))
    .enter()
    .append("text")
    .attr("class", "hour-label")
    .attr("text-anchor", "middle")
    .attr("x", function (d) {
      return hourLabelRadius * Math.sin(hourScale(d) * radians)
    })
    .attr("y", function (d) {
      return (
        -hourLabelRadius * Math.cos(hourScale(d) * radians) + hourLabelYOffset
      )
    })
    .text(function (d) {
      return d
    })

  const hands = face.append("g").attr("id", "clock-hands")

  face
    .append("g")
    .attr("id", "face-overlay")
    .append("circle")
    .attr("class", "hands-cover")
    .attr("x", 0)
    .attr("y", 0)
    .attr("r", clockRadius / 20)

  hands
    .selectAll("line")
    .data(handData)
    .enter()
    .append("line")
    .attr("class", function (d) {
      return d.type + "-hand"
    })
    .attr("x1", 0)
    .attr("y1", function (d) {
      return d.balance ? d.balance : 0
    })
    .attr("x2", 0)
    .attr("y2", function (d) {
      return d.length
    })
    .attr("transform", function (d) {
      return "rotate(" + d.scale(d.value) + ")"
    })
}

function moveHands() {
  d3.select("#clock-hands")
    .selectAll("line")
    .data(handData)
    .transition()
    .attr("transform", function (d) {
      const value = d.value;
      console.log('value', value)
      
      const position = d.scale(d.value);
      console.log('position', position)
      const rotate = stopped ? 0 : d.scale(d.value)
      return `rotate(${rotate})`
    })
}

function updateData() {
  const t = new Date()
  handData[0].value = (t.getHours() % 12) + t.getMinutes() / 60
  handData[1].value = t.getMinutes()
  handData[2].value = t.getSeconds()
}

drawClock()

setInterval(function () {
    updateData()
    moveHands()
}, 1000)

d3.select(self.frameElement).style("height", height + "px")
