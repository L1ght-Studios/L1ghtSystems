var colours = {
    "black": "\x1b[38;5;0m",
    "red": "\x1b[38;5;1m",
    "green": "\x1b[38;5;2m",
    "yellow": "\x1b[38;5;220m",
    "darkBlue": "\x1b[38;5;4m",
    "coolYellow": "\x1b[38;5;221m",
    "pink": "\x1b[38;5;219m",
    "blue": "\x1b[38;5;111m",
    "gray": "\x1b[38;5;245m",
    "darkGray": "\x1b[38;5;239m",
    "pinkish": "\x1b[38;5;9m",
    "reset": "\x1b[0m"
}


/**
 * Displays a detailed log to your console
 */
module.exports = {
    /**
     * Makes a log to the console in blue
     * @param {String} category The categoy of the log
     * @param {String} log the log to display to the console
     */
    info: function(category, log) {
        let print = colours.green + "$system: " + colours.coolYellow + "[" + category + "] " + colours.blue + log
        console.log(print + colours.reset)
    },

    /**
     * Makes a styled log to the console
     * @param {String} category The categoy of the log
     * @param {String} log the log to display to the console
     */
    print: function(category, log) {
        let print = colours.green + "$system: " + colours.coolYellow + "[" + category + "] " + colours.reset + log
        console.log(print + colours.reset)
    },

    /**
     * Makes a log to the console in yellow
     * @param {String} category The categoy of the log
     * @param {String} log the log to display to the console
     */
    warn: function(category, log) {
        let print = colours.green + "$system: " + colours.coolYellow + "[" + category + "] " + colours.yellow + log
        console.log(print + colours.reset)
    },

    /**
     * Makes a log to the console in red
     * @param {String} category The categoy of the log
     * @param {String} log the log to display to the console
     */
    error: function(category, log) {
        let print = colours.green + "$system: " + colours.coolYellow + "[" + category + "] " + colours.red + log
        console.log(print + colours.reset)
    }
}