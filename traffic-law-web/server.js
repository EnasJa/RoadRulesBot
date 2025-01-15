const { OpenAI } = require('openai');
require('dotenv').config();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const tesseract = require('tesseract.js');
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

// הגדרת חיבור ל-OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// מידע עקרוני
const baseKnowledge = `
    הבוט הזה מתוכנן לספק תשובות לשאלות הקשורות לדיני תעבורה במדינת ישראל. 
    המידע מבוסס על חוקי תעבורה, כללי נהיגה בטוחה, דרישות רישוי ובדיקות תקינות רכב. 
    כמו כן, ניתן לנתח מסמכים הקשורים לעבירות תעבורה, דו"חות משטרה, ותמונות מזירות תאונות במידת האפשר.
`;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// טיפול בהעלאת קובץ (PDF או תמונה)
// טיפול בהעלאת קובץ (PDF או תמונה)
const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (['.pdf', '.jpg', '.jpeg', '.png'].includes(ext)) {
            return cb(null, true);
        }
        cb(new Error('קובץ לא נתמך! רק PDF, JPG, PNG מותרים.'));
    }
});

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'לא נמצא קובץ להעלאה.' });
        }

        const filePath = path.join(__dirname, 'uploads', req.file.filename);
        const ext = path.extname(req.file.originalname).toLowerCase();

        if (ext === '.pdf') {
            // ניתוח PDF
            const data = await pdfParse(fs.readFileSync(filePath));
            fs.unlink(filePath, err => {
                if (err) console.error('שגיאה במחיקת הקובץ:', err);
            });
            return res.json({ answer: `תוכן ה-PDF: ${data.text}` });
        } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
            // ניתוח תמונה עם Tesseract.js
            tesseract.recognize(filePath, 'heb', {
                logger: info => console.log(info) // אופציונלי: להציג לוגים בתהליך
            })
                .then(({ data: { text } }) => {
                    fs.unlink(filePath, err => {
                        if (err) console.error('שגיאה במחיקת הקובץ:', err);
                    });
                    return res.json({ answer: `תוכן הטקסט מהתמונה: ${text}` });
                })
                .catch(error => {
                    console.error('שגיאה בניתוח התמונה:', error);
                    fs.unlink(filePath, err => {
                        if (err) console.error('שגיאה במחיקת הקובץ:', err);
                    });
                    return res.status(500).json({ error: 'שגיאה בניתוח התמונה.' });
                });
        } else {
            fs.unlink(filePath, err => {
                if (err) console.error('שגיאה במחיקת הקובץ:', err);
            });
            return res.status(400).json({ error: 'סוג קובץ לא נתמך.' });
        }
    } catch (error) {
        console.error('שגיאה כללית:', error);
        return res.status(500).json({ error: 'שגיאה כללית.' });
    }
});



const conversations = {}; // לשמור את ההיסטוריה לכל לקוח

app.post('/chatbot', async (req, res) => {
    try {
        const { prompt, sessionId } = req.body; // נדרש מזהה ייחודי לכל שיחה
        if (!sessionId) {
            return res.status(400).json({ error: 'מזהה השיחה חסר.' });
        }

        // אתחול השיחה אם אין עדיין היסטוריה ללקוח זה
        if (!conversations[sessionId]) {
            conversations[sessionId] = [
                { role: 'system', content: baseKnowledge }, // הגדרת המידע הבסיסי
            ];
        }

        // הוספת הודעת המשתמש להיסטוריית השיחה
        conversations[sessionId].push({ role: 'user', content: prompt });

        // שליחת השיחה ל-OpenAI
    const openAiResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: conversations[sessionId], 
        max_tokens: 500,
        temperature: 0.7,
    });
    const answer = openAiResponse.choices[0].message.content;
    res.json({ response: answer });
} catch (error) {
    console.error('שגיאה בבקשה ל-OpenAI:', error.message);
    res.status(500).json({ response: 'שגיאה בבקשה לשרת.' });
}
});

// אופציונלי: ניקוי היסטוריית שיחה ישנה לאחר זמן מסוים
setInterval(() => {
    const now = Date.now();
    for (const sessionId in conversations) {
        if (conversations[sessionId].lastActivity < now - 60 * 60 * 1000) { // שעה אחת
            delete conversations[sessionId];
        }
    }
}, 60 * 60 * 1000); // להריץ ניקוי כל שעה



// נתיב לדף הראשי
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// הפעלת השרת
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
