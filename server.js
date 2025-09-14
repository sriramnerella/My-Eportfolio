const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const multer = require('multer');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = process.env.PORT || 5000;

// Admin credentials
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('portfolio123', 10);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

// Mongoose Schema for Contact Messages
const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  message: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

// Email configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Verify email transporter connection
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter.verify((error, success) => {
    if (error) {
      console.error('Email transporter verification failed:', error);
    } else {
      console.log('Email transporter verified and ready to send emails');
    }
  });
} else {
  console.log('Email credentials not configured - email notifications will be skipped');
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'resume') {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed for resume'));
      }
    } else if (file.fieldname === 'projectImage') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    } else {
      cb(null, true);
    }
  }
});

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'portfolio-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Portfolio data object (remains the same)
const portfolioData = {
  personal: {
    name: "NERELLA VENKATA SRI RAM",
    title: "Student | Web DEvelopment | AI & Data Science Enthusiast",
    intro: "Aspiring Full Stack Developer | AI & Data Science Enthusiast | Passionate about Building Innovative Solutions",
    statement: "I am a dedicated and passionate computer science student studying at Indian Institute of Information Technology , Sricity. with a strong foundation in programming, web development. I thrive on solving complex problems and continuously learning new technologies to enhance my skills. My goal is to leverage my technical expertise to create impactful solutions that drive innovation and improve user experiences.",
  },
  education: [
    {
      degree: "Bachelor of Technology in Computer Science and Engineering",
      institution: "Indian Institute of Information Technology , Sricity",
      year: "2023-present",
      description: "Relevant Coursework: Data Structures, Algorithms,  Web Development "
    },
    {
      degree : "Intermediate Education",
      institution: "Sri Chaitanya Junior College, Vijayawada",
      year: "2021-2023",
      description: "Relevant Coursework: Mathematics, Physics, Chemistry and scored 984 out of 1000 in board exams"
    },
    {
      degree : "School Education",
      institution:"Montessori English Medium High School, Guntur",
      year :"2010-2021",
      description: "Completed schooling with a focus on Science and Mathematics, achieving a 10 CGPA in board exams"

    }
  ],
  skills: [
    "Java", "Python" , "C",
    "JavaScript", "Node.js", "React", "Express", "MongoDB", "SQL", 
    "HTML/CSS", "Git", "Anaconda"  , "AWS", "RESTful APIs", 
  ],
  
  projects: [
    {
      title: "Nutri Connect",
      description: "Full-stack web app connecting dieticians and clients with chat, blogs, and appointments along with admin dashboards for management and analytics. Dedicated dashboards for dieticians and clients to manage profiles, appointments, and track progress.",
      techStack: ["React","Node.js", "Express", "EJS", "MongoDB", "Socket.io"],
      link: "https://github.com/saketh169/FFSD-NUTRI-CONNECT"
    },

    {
      title:"Technical Blog Website using React",
      description :"A blog website built with react focuses on mainly react and  used Appwrite CMS for content management and Tailwind CSS for styling. Features include dynamic routing, responsive design, and SEO optimization.",
      techStack : ["React", "Appwrite CMS", "Tailwind CSS"],
      link: "https://github.com/venkatasriram/technical-blog"

    },



    {
      title: "AI Search & CSP Solver",
      description: "AI project implementing search algorithms and constraint satisfaction problem solvers",
      techStack: ["JAVA", "AI Algorithms"],
      link: "https://github.com/sriramnerella"
    },

    {
      title: "RAG Based Teaching Assistant",
      description :" Building an Retrieval-Augmented Generation (RAG) based Teaching Assistant that helps to answer students queries related to video lectures by retrieving relevant information from lecture notes and generating accurate responses using advanced NLP techniques.",
      techStack : ["Python", "Whispser API"],
      link: "https://github.com/sriramnerella"


    }

  ],
  achievements: [
    
    {
      title: "Academic Excellence Award",
      description: "Maintained GPA above 9+ CGPA in the  consecutive semesters",
      year: "2023-present"
    },

    {
      title:"Participated in Web3 Summer School of Hackathon 2025",
      description:"Partcipated in Web3 Summer School of Hackathon 2025 and worshop based on web3 and blockchain technology",
      year:"2025"
   },

   {
    title : "Qualified to the final round of Code Clash Arena 2025 ",
    description :"Secured a position in the final round of Code Clash Arena 2025, a competitive coding event.",
    year :"2025"
   }





   
  ],
  workSamples: [
    {
      title: "Portfolio Website",
      type: "GitHub",
      link: "https://github.com/sriramnerella/My-e-portfolio"
    },
    {
      title: "Technical Blog",
      type: "Blog",
      link: "https://github.com/sriramnerella"
    },
    {
      title: "RAG Based Teaching Assistant",
      type: "GitHub",
      link: "https://github.com/sriramnerella"
    }
  ],
  contact: {
    email: "sriramnerella435@gmail.com",
    github: "https://github.com/sriramnerella",
    linkedin: "https://www.linkedin.com/in/venkata-sri-ram-nerella-67428628b",
    phone: "+91 9121231831"
  }
};

// Routes
app.get('/', (req, res) => {
  res.render('index', { data: portfolioData, page: 'home', success: req.query.success });
});

app.get('/about', (req, res) => {
  res.render('about', { data: portfolioData, page: 'about' });
});

app.get('/projects', (req, res) => {
  res.render('projects', { data: portfolioData, page: 'projects' });
});

app.get('/achievements', (req, res) => {
  res.render('achievements', { data: portfolioData, page: 'achievements' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { data: portfolioData, page: 'contact', success: req.query.success });
});

// Validation function (remains the same)
function validateContactInput(name, email, message) {
  const errors = [];
  if (!name || name.trim().length === 0) errors.push('Name is required');
  else if (name.trim().length < 2 || name.trim().length > 100) errors.push('Name must be between 2 and 100 characters');
  if (!email || email.trim().length === 0) errors.push('Email is required');
  else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email.trim())) errors.push('Please enter a valid email address');
  if (!message || message.trim().length === 0) errors.push('Message is required');
  else if (message.trim().length < 10) errors.push('Message must be at least 10 characters long');
  return errors;
}

// Contact form submission (rewritten for MongoDB)
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  const validationErrors = validateContactInput(name, email, message);
  if (validationErrors.length > 0) {
    console.log('Validation errors:', validationErrors);
    return res.redirect('/contact?error=validation_failed');
  }
  
  try {
    const newMessage = new ContactMessage({ name, email, message });
    const savedMessage = await newMessage.save();
    
    console.log('New contact form submission saved to MongoDB:');
    console.log(savedMessage);
    
    // Email notification (logic remains the same)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: 'sriramnerella435@gmail.com', // Portfolio owner's email
          subject: `New Contact Form Submission from ${savedMessage.name}`,
          html: `<p>Name: ${savedMessage.name}</p><p>Email: ${savedMessage.email}</p><p>Message: ${savedMessage.message}</p>`
        });
        console.log('Email notification sent successfully');
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
      }
    }
    
    res.redirect('/contact?success=true');
    
  } catch (error) {
    console.error('Error saving message to database:', error);
    res.redirect('/contact?error=database_error');
  }
});

// Resume download route (remains the same)
app.get('/download-resume', (req, res) => {
  const resumePath = path.join(__dirname, 'public/assets/resume.pdf');
  if (fs.existsSync(resumePath)) {
    res.download(resumePath, 'sriram_resume.pdf');
  } else {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.txt"');
    res.send('Resume placeholder - PDF file would be available here in production.');
  }
});

// Admin routes (rewritten for MongoDB)
function requireAuth(req, res, next) {
  if (req.session.isAdmin) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}

app.get('/admin/login', (req, res) => {
  res.render('admin/login', { error: req.query.error, page: 'admin' });
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && await bcrypt.compare(password, ADMIN_PASSWORD_HASH)) {
    req.session.isAdmin = true;
    res.redirect('/admin/dashboard');
  } else {
    res.redirect('/admin/login?error=invalid_credentials');
  }
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.get('/admin/dashboard', requireAuth, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.render('admin/dashboard', { messages, page: 'admin', data: portfolioData, error: null });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.render('admin/dashboard', { messages: [], error: 'Failed to load messages', page: 'admin', data: portfolioData });
  }
});

app.post('/admin/delete-message/:id', requireAuth, async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard?success=message_deleted');
  } catch (error) {
    console.error('Error deleting message:', error);
    res.redirect('/admin/dashboard?error=delete_failed');
  }
});

// File upload route for resume (remains the same)
app.post('/admin/upload-resume', requireAuth, upload.single('resume'), (req, res) => {
  if (!req.file) {
    return res.redirect('/admin/dashboard?error=no_file');
  }
  const newResumePath = path.join(__dirname, 'public/assets/resume.pdf');
  fs.renameSync(req.file.path, newResumePath);
  res.redirect('/admin/dashboard?success=resume_updated');
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('index', { data: portfolioData, page: 'home', success: null, error: 'Page not found' });
});

// Start Server
async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Portfolio server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

startServer();