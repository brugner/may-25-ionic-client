# May25 Ionic Client 
This repository contains the Ionic code that generates the Android App.

# Deploy to Android
1. ionic build --prod
2. ionic cap copy --prod
3. ionic cap sync --prod
4. npm run resources
5. ionic cap open android (check that firebaseMessagingVersion is set to '20.1.0' in android\variables.gradle)
6. Build -> Generate Signed Bundle / API...
7. Select APK
8. Complete the Key store settings, password 123456
9. Select release and V2, click Finish
10. Open the folder ..\may25-ionic\android\app\release
11. Share the apk

# Jetifier
If there's an error related to the camera plugin when opening the Android Studio project, you need to run npx jetify