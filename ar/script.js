import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAG4EKrB3iLEV2hsB8b08ShpSO6PXDnGjg",
  authDomain: "zio3-8ffdd.firebaseapp.com",
  databaseURL: "https://zio3-8ffdd-default-rtdb.firebaseio.com",
  projectId: "zio3-8ffdd",
  storageBucket: "zio3-8ffdd.firebasestorage.app",
  messagingSenderId: "560939348415",
  appId: "1:560939348415:web:c854e9e214e498ad2d310a",
  measurementId: "G-CVN2B2D0RD"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

document.getElementById('current-year').textContent = new Date().getFullYear();

// شريط التمرير
const slider = document.getElementById('slider');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('sliderDots');

let currentIndex = 0;
const totalSlides = slides.length;
let slideInterval;

slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    dot.dataset.index = i;
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function updateDots() {
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    slider.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;
    updateDots();
}

function nextSlide() { goToSlide(currentIndex + 1); }
function prevSlide() { goToSlide(currentIndex - 1); }

function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5000);
}
function stopAutoSlide() { clearInterval(slideInterval); }

prevBtn.addEventListener('click', () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
});

nextBtn.addEventListener('click', () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
});

slider.addEventListener('mouseenter', stopAutoSlide);
slider.addEventListener('mouseleave', startAutoSlide);

let touchStartX = 0;
slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoSlide();
}, { passive: true });

slider.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50) nextSlide();
    else if (touchEndX > touchStartX + 50) prevSlide();
    startAutoSlide();
}, { passive: true });

startAutoSlide();

// القائمة الجانبية
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

document.querySelectorAll('.sidebar-links a').forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// Firebase
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('المستخدم مسجل الدخول:', user.email);
        get(ref(database, `users/${user.uid}`)).then((snapshot) => {
            if (snapshot.exists()) console.log('بيانات المستخدم:', snapshot.val());
        });
    } else {
        console.log('المستخدم غير مسجل الدخول');
    }
});

logEvent(analytics, 'page_view', {
    page_title: 'الرئيسية',
    page_location: '/ar/index/'
});