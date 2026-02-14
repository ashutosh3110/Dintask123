importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

const firebaseConfig = {
    apiKey: "AIzaSyBli5aJTsxm7wd_EaIq3ih_eqmD1hoCPQY",
    authDomain: "dintask-9c3da.firebaseapp.com",
    projectId: "dintask-9c3da",
    storageBucket: "dintask-9c3da.firebasestorage.app",
    messagingSenderId: "1038003684212",
    appId: "1:1038003684212:web:754f873c210c8a49882221",
    measurementId: "G-NMQBGDP8G7"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message ", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image || "/favicon.ico",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
