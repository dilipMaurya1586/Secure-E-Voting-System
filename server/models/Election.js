const mongoose = require('mongoose');

const ElectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// ✅ FIXED: Status always calculate based on dates
ElectionSchema.pre('save', function(next) {
  const now = new Date();
  
  if (now < this.startDate) {
    this.status = 'upcoming';
  } else if (now > this.endDate) {
    this.status = 'completed';
  } else {
    this.status = 'ongoing';
  }
  
  next();
});

// ✅ Update ke time bhi calculate ho
ElectionSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  const doc = await this.model.findOne(this.getQuery());
  
  if (doc) {
    const now = new Date();
    const startDate = update.startDate ? new Date(update.startDate) : doc.startDate;
    const endDate = update.endDate ? new Date(update.endDate) : doc.endDate;
    
    if (now < startDate) {
      update.status = 'upcoming';
    } else if (now > endDate) {
      update.status = 'completed';
    } else {
      update.status = 'ongoing';
    }
  }
  
  next();
});

module.exports = mongoose.model('Election', ElectionSchema);



// const mongoose = require('mongoose');

// const ElectionSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   startDate: { type: Date, required: true },
//   endDate: { type: Date, required: true },
//   status: {
//     type: String,
//     enum: ['upcoming', 'ongoing', 'completed'],
//     default: 'upcoming'
//   },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// // 🔥 FIXED CODE - Status auto-calculate only if not manually set
// ElectionSchema.pre('save', function(next) {
//   const now = new Date();
  
//   // ✅ Sirf tab auto-calculate karo jab status manually set na kiya ho
//   if (!this.isModified('status')) {
//     if (now < this.startDate) {
//       this.status = 'upcoming';
//     } else if (now > this.endDate) {
//       this.status = 'completed';
//     } else {
//       this.status = 'ongoing';
//     }
//   }
  
//   next();
// });

// // 🔥 UPDATE ke time bhi status calculate ho iske liye
// ElectionSchema.pre('findOneAndUpdate', function(next) {
//   const update = this.getUpdate();
//   const now = new Date();
  
//   // ✅ Sirf tab auto-calculate karo jab status manually set na kiya ho
//   if (!update.status) {
//     // Agar startDate ya endDate update ho rahi hai
//     if (update.startDate || update.endDate) {
//       // Get the document being updated
//       this.model.findOne(this.getQuery()).then(doc => {
//         const startDate = update.startDate || doc.startDate;
//         const endDate = update.endDate || doc.endDate;
        
//         if (now < startDate) {
//           update.status = 'upcoming';
//         } else if (now > endDate) {
//           update.status = 'completed';
//         } else {
//           update.status = 'ongoing';
//         }
//         next();
//       }).catch(err => next(err));
//     } else {
//       next();
//     }
//   } else {
//     // ✅ Agar status manually set kiya hai to kuch mat karo
//     next();
//   }
// });

// module.exports = mongoose.model('Election', ElectionSchema);








// const mongoose = require('mongoose');

// const ElectionSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   startDate: { type: Date, required: true },
//   endDate: { type: Date, required: true },
//   status: {
//     type: String,
//     enum: ['upcoming', 'ongoing', 'completed'],
//     default: 'upcoming'
//   },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// // 🔥 YEH NAYA CODE ADD KARO - Status auto-calculate hoga
// ElectionSchema.pre('save', function(next) {
//   const now = new Date();
  
//   // Agar startDate future mein hai
//   if (now < this.startDate) {
//     this.status = 'upcoming';
//   }
//   // Agar endDate past mein hai
//   else if (now > this.endDate) {
//     this.status = 'completed';
//   }
//   // Agar current date start aur end ke beech mein hai
//   else {
//     this.status = 'ongoing';
//   }
  
//   next();
// });

// // 🔥 UPDATE ke time bhi status calculate ho iske liye
// ElectionSchema.pre('findOneAndUpdate', function(next) {
//   const update = this.getUpdate();
//   const now = new Date();
  
//   // Agar startDate ya endDate update ho rahi hai
//   if (update.startDate || update.endDate) {
//     const startDate = update.startDate || this._conditions.startDate;
//     const endDate = update.endDate || this._conditions.endDate;
    
//     if (now < startDate) {
//       update.status = 'upcoming';
//     } else if (now > endDate) {
//       update.status = 'completed';
//     } else {
//       update.status = 'ongoing';
//     }
//   }
  
//   next();
// });

// module.exports = mongoose.model('Election', ElectionSchema);

