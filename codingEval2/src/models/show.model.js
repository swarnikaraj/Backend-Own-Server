const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
    time: { type: String, required: true },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "movie",
        required: true
    },
    seats: { type: Number, required: true },
    screen_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "screen",
        required: true
    },

}, {
    versionKey: false,
    timestamps: true,
});

module.exports = mongoose.model("show", showSchema);