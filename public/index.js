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

let isStopped = false;

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
      isStopped = !isStopped;
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
  //   .attr("transform", (d) => {
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
  //   .attr("x", (d) => {
  //     return secondLabelRadius * Math.sin(secondScale(d) * radians)
  //   })
  //   .attr("y", (d) => {
  //     return (
  //       -secondLabelRadius * Math.cos(secondScale(d) * radians) +
  //       secondLabelYOffset
  //     )
  //   })
  //   .text((d) => {
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
    .attr("transform", (d) => {
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
    .attr("x", (d) => {
      return hourLabelRadius * Math.sin(hourScale(d) * radians)
    })
    .attr("y", (d) => {
      return (
        -hourLabelRadius * Math.cos(hourScale(d) * radians) + hourLabelYOffset
      )
    })
    .text((d) => {
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
    .attr("class", (d) => {
      return d.type + "-hand"
    })
    .attr("x1", 0)
    .attr("y1", (d) => {
      return d.balance ? d.balance : 0
    })
    .attr("x2", 0)
    .attr("y2", (d) => {
      return d.length
    })
    .attr("transform", (d) => {
      return "rotate(" + d.scale(d.value) + ")"
    })
}

function moveHands() {
  d3.select("#clock-hands")
    .selectAll("line")
    .data(handData)
    .transition()
    .attr("transform", (d) => {
      const rotate = d.scale(d.value)

      return `rotate(${rotate})`
    })
}

function updateData() {
  const allHandsAt12 = handData[0].value === 0 && handData[1].value === 0 && handData[2].value === 0;

  // bail condition
  if (isStopped && allHandsAt12) return;

  const t = new Date()
  // see if it's isStopped
  // if it is, see if it's before 6pm
  // if it is, move it to 6pm
  // if it's not at 12, move it to 12
  const hours = t.getHours();
  const minutes = t.getMinutes();
  const seconds = t.getSeconds();

  const isAfter6 = (hours > 4 && hours < 11) || hours > 17;
  const isAfter30m = minutes > 29;
  const isAfter30s = seconds > 29;
  
  if (isStopped) {
    const moveHoursTo12 = isAfter6 || handData[0].value === 6;
    const moveMinutesTo12 = isAfter30m || handData[1].value === 31;
    const moveSecondsTo12 = isAfter30s || handData[2].value === 31;
    
    handData[0].value = moveHoursTo12 ? 0 : 6;
    handData[1].value = moveMinutesTo12 ? 0 : 31;
    handData[2].value = moveSecondsTo12 ? 0 : 31;
  }
  else if (!isStopped && allHandsAt12) {
    const moveHoursTo6 = isAfter6 || handData[0].value === 6;
    const moveMinutesTo30 = isAfter30m || handData[1].value === 31;
    const moveSecondsTo30 = isAfter30s || handData[2].value === 31;

    handData[0].value = moveHoursTo6 ? 6 : (t.getHours() % 12) + minutes / 60
    handData[1].value = moveMinutesTo30 ? 30 : minutes;
    handData[2].value = moveSecondsTo30 ? 30 : seconds;
  }
  else {
    handData[0].value = (t.getHours() % 12) + minutes / 60
    handData[1].value = minutes;
    handData[2].value = seconds;
  }
}

drawClock()

setInterval(() => {
    updateData()
    moveHands()
}, 500)

d3.select(self.frameElement).style("height", height + "px")
