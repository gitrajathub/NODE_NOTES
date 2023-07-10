const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({

  taskname: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdBy:{
    type:Schema.Types.ObjectId, 
    ref:'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const taskModel = mongoose.model('Task', taskSchema);

module.exports = taskModel;
