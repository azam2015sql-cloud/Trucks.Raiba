
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const Unit = require('../models/unit.model');
const config = require('../config/config');

mongoose.connect(config.database.uri, config.database.options)
  .then(() => {
    const workbook = xlsx.readFile(process.argv[2]);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const units = xlsx.utils.sheet_to_json(sheet);
    
    Unit.insertMany(units)
      .then(() => {
        console.log(`تم استيراد ${units.length} وحدة بنجاح`);
        process.exit(0);
      })
      .catch(err => {
        console.error('حدث خطأ أثناء الاستيراد:', err);
        process.exit(1);
      });
  });
