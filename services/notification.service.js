
const Notification = require('../models/notification.model');
const config = require('../config/config');
const { io } = require('../app');

class NotificationService {
    /**
     * إنشاء إشعار حركة جديدة
     * @param {String} unitId - رقم الوحدة
     * @param {String} fromArea - المنطقة السابقة
     * @param {String} toArea - المنطقة الجديدة
     * @param {String} userId - المستخدم المسؤول
     * @returns {Promise<Object>} - كائن الإشعار
     */
    static async createMovementNotification(unitId, fromArea, toArea, userId) {
        const message = this.generateMovementMessage(unitId, fromArea, toArea);
        const soundFile = this.getSoundFileForArea(toArea);
        
        const notification = new Notification({
            user_id: userId,
            message,
            notification_type: 'movement',
            sound_file: soundFile,
            related_entity: 'unit',
            related_id: unitId
        });

        await notification.save();
        this.triggerRealTimeNotification(notification);
        return notification;
    }

    /**
     * توليد رسالة الحركة
     * @private
     */
    static generateMovementMessage(unitId, fromArea, toArea) {
        const areaNames = {
            'waiting_area': 'منطقة الانتظار',
            'spare_request': 'طلب اسبير',
            'exit_area': 'خروج من الورشة'
        };
        
        return `تم نقل الوحدة ${unitId} من ${areaNames[fromArea] || fromArea} إلى ${areaNames[toArea] || toArea}`;
    }

    /**
     * الحصول على ملف الصوت المناسب للمنطقة
     * @private
     */
    static getSoundFileForArea(area) {
        const soundMapping = {
            'spare_request': 'spare-request.mp3',
            'exit_area': 'maintenance-complete.mp3',
            'waiting_area': 'unit-arrived.mp3'
        };
        
        return soundMapping[area] || config.notificationSounds.default;
    }

    /**
     * تشغيل الإشعار في الوقت الحقيقي
     * @private
     */
    static triggerRealTimeNotification(notification) {
        // إرسال الإشعار عبر Socket.io
        io.emit('new_notification', {
            type: notification.notification_type,
            message: notification.message,
            sound: notification.sound_file,
            timestamp: new Date()
        });

        // تسجيل في سجل النظام
        console.log(`[Notification] ${notification.message}`);
    }

    /**
     * إرسال إشعار مخصص
     * @param {String} userId - ID المستخدم المستهدف
     * @param {String} message - محتوى الرسالة
     * @param {String} type - نوع الإشعار
     */
    static async sendCustomNotification(userId, message, type = 'system') {
        const notification = new Notification({
            user_id: userId,
            message,
            notification_type: type,
            sound_file: config.notificationSounds.default
        });

        await notification.save();
        this.triggerRealTimeNotification(notification);
        return notification;
    }
}

module.exports = NotificationService;
