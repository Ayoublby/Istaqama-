// مواقيت الصلاة لطرابلس، ليبيا
const PrayerTimes = {
    // إحداثيات طرابلس، ليبيا
    coordinates: {
        latitude: 32.8872,
        longitude: 13.1913,
        city: 'طرابلس',
        country: 'ليبيا'
    },
    
    // تحميل مواقيت الصلاة
    loadPrayerTimes: async () => {
        try {
            const today = new Date();
            const dateString = today.toISOString().split('T')[0];
            
            // استخدام API Aladhan لجلب مواقيت الصلاة
            const response = await fetch(
                `http://api.aladhan.com/v1/timings/${dateString}?latitude=${PrayerTimes.coordinates.latitude}&longitude=${PrayerTimes.coordinates.longitude}&method=2`
            );
            
            if (!response.ok) {
                throw new Error('فشل في جلب مواقيت الصلاة');
            }
            
            const data = await response.json();
            const timings = data.data.timings;
            
            // تحديث مواقيت الصلاة في الواجهة
            PrayerTimes.updatePrayerTimesDisplay(timings);
            
        } catch (error) {
            console.error('خطأ في تحميل مواقيت الصلاة:', error);
            // استخدام مواقيت افتراضية في حالة الخطأ
            PrayerTimes.useDefaultTimes();
        }
    },
    
    // تحديث عرض مواقيت الصلاة
    updatePrayerTimesDisplay: (timings) => {
        const prayers = [
            { name: 'الفجر', time: timings.Fajr, id: 'fajrTime' },
            { name: 'الظهر', time: timings.Dhuhr, id: 'dhuhrTime' },
            { name: 'العصر', time: timings.Asr, id: 'asrTime' },
            { name: 'المغرب', time: timings.Maghrib, id: 'maghribTime' },
            { name: 'العشاء', time: timings.Isha, id: 'ishaTime' }
        ];
        
        prayers.forEach(prayer => {
            const element = document.getElementById(prayer.id);
            if (element) {
                // تحويل الوقت من 24 ساعة إلى 12 ساعة
                const time = PrayerTimes.formatTime(prayer.time);
                element.textContent = time;
            }
        });
        
        // تحديد الصلاة الحالية
        PrayerTimes.highlightCurrentPrayer(timings);
    },
    
    // تنسيق الوقت
    formatTime: (time24) => {
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours);
        const minute = minutes;
        
        if (hour === 0) {
            return `12:${minute}`;
        } else if (hour <= 12) {
            return `${hour}:${minute}`;
        } else {
            return `${hour - 12}:${minute}`;
        }
    },
    
    // تمييز الصلاة الحالية
    highlightCurrentPrayer: (timings) => {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const prayers = [
            { name: 'fajr', time: timings.Fajr },
            { name: 'dhuhr', time: timings.Dhuhr },
            { name: 'asr', time: timings.Asr },
            { name: 'maghrib', time: timings.Maghrib },
            { name: 'isha', time: timings.Isha }
        ];
        
        // إزالة التمييز السابق
        document.querySelectorAll('.prayer-time').forEach(el => {
            el.classList.remove('current-prayer');
        });
        
        // العثور على الصلاة الحالية أو القادمة
        for (let i = 0; i < prayers.length; i++) {
            const [hours, minutes] = prayers[i].time.split(':');
            const prayerTime = parseInt(hours) * 60 + parseInt(minutes);
            
            if (currentTime < prayerTime) {
                const prayerElement = document.getElementById(prayers[i].name + 'Time');
                if (prayerElement) {
                    prayerElement.classList.add('current-prayer');
                }
                break;
            }
        }
    },
    
    // استخدام مواقيت افتراضية
    useDefaultTimes: () => {
        const defaultTimes = {
            Fajr: '05:23',
            Dhuhr: '12:55',
            Asr: '16:31',
            Maghrib: '19:20',
            Isha: '20:27'
        };
        
        PrayerTimes.updatePrayerTimesDisplay(defaultTimes);
    }
};

// تحميل مواقيت الصلاة عند تحميل الصفحة
function loadPrayerTimes() {
    PrayerTimes.loadPrayerTimes();
}

// تحديث مواقيت الصلاة كل دقيقة
setInterval(() => {
    PrayerTimes.loadPrayerTimes();
}, 60000);

