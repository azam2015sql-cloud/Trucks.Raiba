
const Unit = require('../models/unit.model');
const { io } = require('../app');
const NotificationService = require('../services/notification.service');

exports.getAllUnits = async (req, res) => {
  try {
    const units = await Unit.find().sort({ current_area: 1 });
    res.json(units);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.moveUnit = async (req, res) => {
  const { unitId, toArea, userId, notes } = req.body;
  
  try {
    const unit = await Unit.findOne({ unit_id: unitId });
    if (!unit) return res.status(404).json({ message: 'الوحدة غير موجودة' });

    const fromArea = unit.current_area;
    unit.current_area = toArea;
    unit.current_status = getStatusFromArea(toArea);
    unit.last_updated_by = userId;

    await unit.save();

    // تسجيل الحركة
    const movement = new Movement({
      unit_id: unitId,
      from_area: fromArea,
      to_area: toArea,
      user_id: userId,
      notes
    });
    await movement.save();

    // إرسال إشعار
    const notification = await NotificationService.createMovementNotification(
      unitId, fromArea, toArea, userId
    );
    io.emit('new_movement', { unit, movement, notification });

    res.json({ unit, movement });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

function getStatusFromArea(area) {
  const areaToStatus = {
    waiting_area: 'waiting',
    spare_request: 'needs_spare',
    exit_area: 'out_of_workshop'
  };
  return areaToStatus[area] || 'in_maintenance';
}
