const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const timeSlotSchema = new mongoose.Schema({
  time: { 
    type: String,
    required: true
  },
  capacity:{
     type: Number,
    default: 10
  }
});

const experienceSchema = new mongoose.Schema({
  name: {
     type: String, 
     required: true 
    },
  slug: { 
    type: String, 
    required: false 
  },
  image: { 
    type: String,
    required: true 
  },
  description: {
     type: String, 
     required: true 
    },
  about: { 
    type: String 
  },
  pricePerPerson: {
     type: Number, 
     required: true
   },
  category: { 
    type: String
    },
  location: { 
    type: String 
    },
  times: { 
    type: [timeSlotSchema], 
    default: [] 
    },
  isActive: { 
    type: Boolean, 
    default: true 
    },
  owner: { 
    type: ObjectId, 
    ref: 'User' 
     }
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
