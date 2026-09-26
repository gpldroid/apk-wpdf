# World PDF Android

هذا الفرع يضيف نسخة Android لتطبيق World PDF مع الحفاظ على محرك PDF الموجود في الموقع.

- `android/` مشروع Android أصلي.
- ملفات الموقع الأصلية تبقى كما هي.
- Gradle ينسخ واجهة World PDF إلى WebView أثناء البناء.
- معالجة PDF تبقى محلية داخل WebView.
- اختيار الملفات والكاميرا عبر WebView.
- AdMob وUMP مدمجان مبدئياً باستخدام معرّفات Google الاختبارية.

## البناء من الهاتف

GitHub → Actions → **Build World PDF Android** → **Run workflow** على فرع `android-app`.

بعد نجاح البناء ستجد APK ضمن Artifact باسم `world-pdf-android`.

## قبل النشر

المعرّفات الموجودة حالياً اختبارية من Google. قبل الإصدار العام يجب استبدالها بمعرّفات AdMob الخاصة بتطبيقك وإكمال إعداد رسائل الخصوصية في AdMob.

لا توجد مفاتيح سرية أو مفاتيح API داخل المستودع.
