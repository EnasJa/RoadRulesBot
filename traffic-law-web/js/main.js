// קוד להפעלת כפתור צ'אט בוט
document.querySelector('.chatbot-btn').addEventListener('click', () => {
    alert('ברוך הבא לצ\'אט בוט! בקרוב נוסיף פונקציות נוספות 😊');
});

// אפקט אנימציה לקטגוריות
const categories = document.querySelectorAll('.category');
categories.forEach((category) => {
    category.addEventListener('mouseenter', () => {
        category.style.transform = 'translateY(-10px)';
        category.style.boxShadow = '0px 10px 20px rgba(0, 0, 0, 0.3)';
    });

    category.addEventListener('mouseleave', () => {
        category.style.transform = 'translateY(0)';
        category.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.1)';
    });
});

// פונקציה לתצוגת השעה והתאריך (במידה ותוסיף לדף)
function displayTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('he-IL', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    const dateString = now.toLocaleDateString('he-IL');
    document.querySelector('.time-display').innerHTML = `${dateString} | ${timeString}`;
}

// הפעלת השעון בזמן אמת (אם יש צורך)
setInterval(displayTime, 1000);
