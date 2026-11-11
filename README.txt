BYRSA TEAM — موقع ثابت قابل للفهرسة
====================================
الرفع على GitHub:
1) انسخ كل محتويات هذا المجلد (ما عدا build.mjs و source/ إن شئت) إلى جذر مستودع byrsateam.github.io
2) Commit + Push، وانتظر دقيقة أو دقيقتين حتى ينشر GitHub Pages.
3) افحص: https://byrsateam.github.io/sitemap.xml  و  https://byrsateam.github.io/robots.txt

الروابط: الإنجليزية تبقى على نفس الروابط القديمة (/budgetzen.html و /)، واللغات الأخرى في /fr/ /ar/ /es/ ... إلخ.

تعديل المحتوى لاحقاً: عدّل ملفي source/*.src.html (النصوص وقائمة التطبيقات) ثم نفّذ:  node build.mjs
لتفعيل Search Console: ضع رمز التحقق في GSC داخل build.mjs ثم أعد البناء.
عند إضافة تطبيق جديد: أضف أيقونته (يفضّل webp بحجم 256px وسجّلها في SMALL داخل build.mjs).
