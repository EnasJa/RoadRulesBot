const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// שרת קבצים סטטיים מתוך התיקייה הנוכחית
app.use(express.static(path.join(__dirname)));

// דף הבית
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// דף רישוי
app.get('/license', (req, res) => {
    res.sendFile(path.join(__dirname, 'license.html'));
});

// דף מהירות
app.get('/speed', (req, res) => {
    res.sendFile(path.join(__dirname, 'speed.html'));
});

// דף חניה
app.get('/parking', (req, res) => {
    res.sendFile(path.join(__dirname, 'parking.html'));
});

// הפעלת השרת
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
