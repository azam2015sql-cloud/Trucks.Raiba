const Notification = require('../models/notification.model');
const soundMap = require('../config/notificationSounds');

class NotificationService {
  static async createMovementNotification(unitId, fromArea, toArea, userId) {
    const message = `تم نقل الوحدة ${unitId} من ${fromArea} إلى ${toArea}`;
    const notification = new Notification({
      user_id: userId,
      message,
      notification_type: 'movement',
      sound_file: soundMap[toArea] || 'default.mp3'
    });

    await notification.save();
    return notification;
  }

  static async playNotificationSound(soundFile) {
    // يمكن تنفيذ التشغيل الصوتي هنا أو من الواجهة الأمامية
    console.log(`تشغيل الصوت: ${soundFile}`);
  }
}

module.exports = NotificationService;
