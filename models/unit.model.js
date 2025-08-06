
const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  unit_id: { type: String, required: true, unique: true },
  unit_type: { 
    type: String, 
    required: true,
    enum: ['crago', 'tipper', 'silo', 'tanker']
  },
  current_status: {
    type: String,
    required: true,
    enum: ['waiting', 'in_maintenance', 'out_of_workshop', 'needs_spare'],
    default: 'waiting'
  },
  current_area: {
    type: String,
    required: true,
    enum: ['waiting_area', 'crago', 'tipper', 'silo', 'tanker', 
           'rehabilitation', 'accident', 'overhaul', 'spare_request', 'exit_area']
  },
  entry_date: { type: Date, default: Date.now },
  last_update: { type: Date, default: Date.now },
  last_updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// تحديث حالة الوحدة عند الحفظ
unitSchema.pre('save', function(next) {
  this.last_update = Date.now();
  next();
});

module.exports = mongoose.model('Unit', unitSchema);
