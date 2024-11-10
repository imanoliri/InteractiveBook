// Example word count data
const wordCount = {
    "dragon": 74,
    "knight": 68,
    "dark": 57,
    "valley": 53,
    "rider": 45,
    "god": 39,
    "battle": 23,
    "human": 18,
    "forest": 18,
    "day": 16,
    "magic": 14,
    "army": 14,
    "elves": 13,
    "three": 13,
    "river": 13,
    "friend": 13,
    "felt": 13,
    "fierce": 12,
    "life": 12,
    "chapter": 11,
    "time": 11,
    "grew": 11,
    "cities": 10,
    "home": 10,
    "new": 10,
    "young": 10,
    "other": 9,
    "mountain": 9,
    "filled": 9,
    "power": 9,
    "shared": 8,
    "training": 8,
    "finally": 8,
    "knew": 8,
    "attack": 7,
    "take": 7,
    "first": 7,
    "arrived": 7,
    "knowledge": 7,
    "long": 7,
    "made": 7,
    "sky": 7,
    "become": 7,
    "ranks": 7,
    "i": 6,
    "peace": 6,
    "ancient": 6,
    "simple": 6,
    "deep": 6,
    "came": 6,
    "ready": 6,
    "sense": 6,
    "undead": 6,
    "word": 5,
    "part": 5,
    "lived": 5,
    "different": 5,
    "tree": 5,
    "world": 5,
    "form": 5
};

// Transform data into an array of objects
const words = Object.keys(wordCount).map(word => ({
    text: word,
    size: wordCount[word]
}));

// Tooltip element
const tooltip = d3.select("#tooltip");

// Create the word cloud layout
const layout = d3.layout.cloud()
    .size([window.innerWidth, window.innerHeight])
    .words(words)
    .padding(5)
    .rotate(() => ~~(Math.random() * 2) * 90)
    .font("Impact")
    .fontSize(d => d.size * 2)
    .on("end", draw);

layout.start();

// Draw the word cloud
function draw(words) {
    const svg = d3.select("#word-cloud")
        .append("svg")
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight)
        .append("g")
        .attr("transform", `translate(${window.innerWidth / 2},${window.innerHeight / 2})`);

    // Bind data and create text elements
    const textElements = svg.selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-family", "Impact")
        .style("fill", () => `hsl(${Math.random() * 360}, 70%, 60%)`) // More vibrant colors
        .style("cursor", "pointer")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
            return `translate(${d.x},${d.y})rotate(${d.rotate})`;
        })
        .style("font-size", function(d) {
            return `${d.size}px`;
        })
        .text(function(d) {
            return d.text;
        });

    // Add event listeners with traditional function expressions
    textElements
        .on("mouseover", function() {
            d3.select(this)
                .style("stroke", "black")  // Apply border
                .style("stroke-width", "1px");
            
            tooltip.style("opacity", 1).html(`${this.__data__.size}`); // Show the tooltip with the word count
        })

        .on("mousemove", function() {
            const textElement = d3.select(this);
            const fontSize = parseFloat(textElement.style("font-size"));
            
            // Position the tooltip relative to the cursor with an offset based on the element size
            tooltip.style("left", `${window.event.pageX + fontSize / 2}px`)
                .style("top", `${window.event.pageY + fontSize / 2}px`);
        
        })

        .on("mouseout", function() {
            d3.select(this)
                .style("stroke", "none"); // Remove the border
        });
}

// Debounce resize event to optimize performance
let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        d3.select("svg").remove();
        layout.size([window.innerWidth, window.innerHeight]).start();
    }, 300); // 300 milliseconds debounce time
});
