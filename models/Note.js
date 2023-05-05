const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    title: {
        type: String,
        require: true
    },
    text: {
        type: String,
        equire: true
    },
    completed: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}
)

noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticker',
    id: 'ticketNums',
    start_seq: 500
})

module.exports = mongoose.model('Note', noteSchema);