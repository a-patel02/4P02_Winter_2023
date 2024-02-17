// notification.ts

export function showNotification(title: string, options?: NotificationOptions) {
  if (!("Notification" in window)) {
    console.error("This browser does not support desktop notification");
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(title, options);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        new Notification(title, options);
      }
    });
  }
}
