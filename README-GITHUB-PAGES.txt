PerfumeZ — نسخة GitHub Pages المصححة

طريقة الرفع الصحيحة:
1) افتح الريبو perfumeZ في GitHub.
2) احذف الملفات القديمة أو استبدلها.
3) ارفع الملفات الموجودة داخل هذا الـ ZIP مباشرة في جذر الريبو.
   مهم: لا ترفعها داخل مجلد إضافي.
4) بعد الرفع يجب أن تظهر الملفات بهذا المستوى:
   index.html
   market-list.html
   manifest.json
   service-worker.js
   css/
   js/
   icon-192.png
   icon-512.png
   .nojekyll
   reset-cache.html
5) من Settings > Pages تأكد أن النشر من branch: main و folder: /root.
6) افتح أول مرة:
   https://el3omdaz.github.io/perfumeZ/reset-cache.html
   بعدها سيتم تحويلك للتطبيق.

سبب المشكلة السابقة:
GitHub Pages كان يقرأ ملفاً بصيغة PNG مكان صفحة index.html أو كان هناك كاش قديم من Service Worker.
هذه النسخة مرتبة للنشر من جذر الريبو، ومعها reset-cache.html وإصدار جديد للكاش.
