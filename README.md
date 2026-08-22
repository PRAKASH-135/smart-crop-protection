An AI-powered smart agriculture system designed to protect crop fields by detecting animals and people in real time, identifying whether a detected person is the registered owner or a stranger, checking whether the detection is inside/outside the protected crop zone, and triggering alerts when a harmful intrusion is detected.

## Project Overview

Traditional crop protection methods such as manual monitoring, physical fencing, and basic motion alarms can be expensive, unreliable, and unable to distinguish between harmless activity and genuine threats.

This project combines:

- Computer vision and AI-based object detection
- Real-time camera monitoring
- Virtual crop-zone/boundary monitoring
- Owner face recognition
- Crop-specific threat rules
- Detection tracking
- Siren/flashlight alert logic
- Email notifications
- Detection logs and analytics
- Authentication and protected dashboard access

The system is divided into three major layers:

```text
Camera
   ↓
React Frontend
   ↓
Node.js / Express Backend
   ↓
Python FastAPI AI Service
   ↓
YOLOv8 + Owner Face Recognition
   ↓
Backend Decision Engine
   ↓
MongoDB + Alerts
   ↓
React Dashboard
Main Features
1. AI Object Detection

The AI service uses a custom-trained YOLOv8s model to detect objects relevant to crop protection.

The detection response contains information such as:

Object/class label
Confidence score
Bounding-box coordinates
Track ID
Image dimensions
2. Owner Recognition

The system can enroll an authorized owner using face samples captured through the frontend camera.

The owner-recognition pipeline uses:

OpenCV Haar Cascade for face detection
LBPH for face recognition
A locally stored owner recognition model

When a person is detected:

Matching registered owner → OWNER
No matching owner → STRANGER
3. Crop Boundary Monitoring

The frontend provides a virtual crop-zone/boundary.

The backend uses this information to determine whether a detection is relevant to the protected field.

This allows the system to distinguish between:

Activity outside the protected crop area
Activity inside the protected crop area
4. Crop-Specific Rules

Different crops can have different harmful-object rules.

The backend checks the detected object against the configured crop rules before deciding whether it represents a threat.

5. Real-Time Camera Monitoring

The dashboard provides a live camera interface.

The camera workflow is:

Browser Camera
      ↓
Capture Frame
      ↓
Send Frame to Backend
      ↓
AI Detection
      ↓
Return Detection Result
      ↓
Draw Bounding Boxes
      ↓
Update Dashboard
6. Bounding-Box Visualization

Detected objects are displayed directly over the camera image.

The frontend uses the returned:

x
y
width
height
image width
image height

to scale the bounding box to the displayed camera dimensions.

7. Threat Detection

The backend combines:

Object class
Owner/stranger classification
Crop rules
Crop boundary
Confidence
Tracking information
Threat duration settings

to determine the current threat state.

Threat levels can include:

No active threat
Warning
High
8. Siren and Flashlight

When the configured threat condition is satisfied, the system can activate the siren logic.

The advanced setup also represents a flashlight integrated with the siren unit for stronger visual deterrence.

9. Email Alerts

The backend can send email alerts using Nodemailer when configured threat conditions occur.

10. Detection Logs

Detection events are stored and displayed through the Detection Logs page.

The logs can contain information such as:

Object
Crop
Confidence
Threat level
Harmful status
Status
Siren state
Track ID
Timestamp

Person detections are displayed as:

OWNER
STRANGER

instead of the generic person label.

11. Analytics

The dashboard includes an analytics section for reviewing detection activity and system statistics.

12. Authentication

The frontend includes:

Login
Registration
Protected dashboard access
Owner face enrollment during registration
13. System Setup Page

A dedicated Setup route is available in the sidebar.

It presents three protection configurations:

Basic Setup

Essential protection using:

2 cameras
Boundary monitoring
Instant alerts
Medium Setup

Smart warning system using:

2 cameras
1 siren inside the field
Boundary monitoring
Instant alerts
Advanced Setup

Complete protection system using:

2 cameras
1 siren inside the field
1 flashlight inside the siren
Boundary monitoring
Instant alerts

The setup page contains visual diagrams explaining the equipment and workflow.

Technology Stack
Frontend
Technology	Purpose
React	User interface
Vite	Frontend development/build tool
Tailwind CSS	Utility-based styling
React Router	Page routing
React Webcam	Browser camera access
Axios	HTTP communication
Recharts	Analytics charts
@phosphor-icons/react	UI icons
Backend
Technology	Purpose
Node.js	JavaScript runtime
Express.js	REST API server
MongoDB	Database
Mongoose	MongoDB ODM
Multer	Image upload handling
Axios	AI-service communication
Nodemailer	Email alerts
JWT	Authentication
dotenv	Environment configuration
AI Service
Technology	Purpose
Python	AI service implementation
FastAPI	AI REST API
Uvicorn	FastAPI server
Ultralytics	YOLO framework
YOLOv8s	Object detection
OpenCV	Image processing and face processing
Haar Cascade	Face detection
LBPH	Owner face recognition
PyTorch	Deep-learning framework
Training / Dataset Tools
Google Colab
NVIDIA T4 GPU
FiftyOne
Open Images V7
makesense.ai
Google Drive
COCO/pretrained YOLO resources
Project Structure
smart-crop-protection/
│
├── ai-service/
│   ├── main.py
│   ├── train_face.py
│   ├── owner_model.yml
│   ├── owner_data/
│   ├── yolov8s_custom.pt
│   ├── requirements.txt
│   └── ...
│
├── backend/
│   ├── server.js
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── public/
│   │   └── setup/
│   │       ├── basic-setup.png
│   │       ├── medium-setup.png
│   │       └── advanced-setup.png
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── CameraFeed.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Topbar.jsx
│   │   │   └── ...
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Setup.jsx
│   │   │   └── ...
│   │   │
│   │   ├── App.jsx
│   │   └── App.css
│   │
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md

Exact supporting files may vary as the project continues to evolve.

Frontend Architecture

The frontend is organized into reusable React components and page-level components.

Main Pages
Dashboard
Detection Logs
Analytics
Crop Rules
Setup
Settings
Login
Register
Main Components
CameraFeed.jsx

Responsible for:

Camera access
Capturing frames
Sending frames for detection
Displaying AI results
Drawing bounding boxes
Showing crop-zone information
Showing detection labels and confidence
Updating monitoring/siren state
Sidebar.jsx

Provides navigation to:

Dashboard
Detection Logs
Analytics
Crop Rules
Setup
Settings
Topbar.jsx

Provides dashboard-level navigation/status information.

Register.jsx

Handles:

Owner details
Email/password registration
System location
Face capture
Owner enrollment request
Setup.jsx

Displays the Basic, Medium, and Advanced protection setup diagrams.

AI Detection Pipeline
Camera Frame
     │
     ▼
Node.js Backend
     │
     ▼
FastAPI AI Service
     │
     ├── YOLOv8s Detection
     │
     ├── Object Tracking
     │
     └── Person → Face Detection → LBPH Recognition
     │
     ▼
Detection Response
     │
     ▼
Backend Rule Engine
     │
     ├── Crop Rule Check
     ├── Boundary Check
     ├── Owner / Stranger Check
     ├── Confidence Check
     └── Threat Duration Check
     │
     ▼
Threat Decision
     │
     ├── Database Log
     ├── Siren
     ├── Email Alert
     └── Dashboard Update
Owner Face Enrollment

The owner registration workflow is:

Register Page
     ↓
Open Browser Camera
     ↓
Capture Multiple Face Samples
     ↓
Send Samples to /enroll-owner
     ↓
FastAPI Validates Faces
     ↓
Save Valid Samples
     ↓
Train / Update Owner Model
     ↓
Save owner_model.yml

The face images used for enrollment are local application data and should not be committed to a public repository.

API Communication

The system uses HTTP APIs between its components.

Frontend → Backend

Used for:

Authentication
Detection requests
Logs
Analytics
Crop rules
Settings
Dashboard data
Frontend → AI Service

Used during owner face enrollment through:

POST /enroll-owner
Backend → AI Service

Used to send captured frames for AI inference and receive detection results.

Installation and Setup
Prerequisites

Install the following before running the project:

Node.js
npm
Python 3.x
MongoDB / MongoDB Atlas
Git

For AI acceleration, a compatible NVIDIA GPU can be used, but CPU execution is also possible depending on the model and environment.

1. Clone the Repository
git clone https://github.com/PRAKASH-135/smart-crop-protection.git
cd smart-crop-protection
2. Backend Setup

Open a terminal:

cd backend
npm install

Configure the backend environment variables in .env.

Typical configuration includes:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password

Use the actual variables expected by the current backend code.

Start the backend:

node server.js

For development, if nodemon is configured:

npm run dev
3. AI Service Setup

Open another terminal:

cd ai-service
python -m venv .venv

Activate the virtual environment:

.\.venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

Start the AI service:

uvicorn main:app --reload --port 8000

The AI service runs at:

http://127.0.0.1:8000
4. Frontend Setup

Open another terminal:

cd frontend
npm install

Start the development server:

npm run dev

Vite normally makes the frontend available at:

http://localhost:5173
Running All Three Services

The project requires the main services to be running together:

Terminal 1 — AI Service
cd ai-service
.\.venv\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
Terminal 2 — Backend
cd backend
npm run dev

or:

node server.js
Terminal 3 — Frontend
cd frontend
npm run dev

Then open the frontend URL shown by Vite.

Owner Enrollment
Open the registration page.
Enter owner details.
Allow browser camera access.
Position the face inside the camera area.
Start the face scan.
The frontend captures multiple samples.
Samples are sent to the AI service.
Valid face samples are processed.
The owner recognition model is updated.
Complete registration.

The AI service should show logs similar to:

Owner enrollment started.
Received face images.
Valid face sample: ...
Owner model successfully updated.
GitHub Repository

Repository:

https://github.com/PRAKASH-135/smart-crop-protection

Main development branch used during the frontend redesign:

frontend-ui-redesign

The project can be merged into the main branch after the pull request passes the repository's merge checks.

Security Notes

Do not commit sensitive information to GitHub.

Never commit:

.env files containing secrets
MongoDB credentials
Email passwords/app passwords
JWT secrets
Private API keys
Personal owner face images
Other private credentials

The owner face dataset and generated recognition model should be treated as sensitive application data.

Before pushing changes, check:

git status

and review:

git diff
Future Improvements

Possible future improvements include:

Multiple registered owners
Role-based access control
Mobile application
Cloud deployment
Remote IoT siren control
SMS/push notifications
Improved face-recognition robustness
More camera streams
Automatic crop-zone calibration
Hardware integration with Raspberry Pi/ESP32/Arduino
Solar-powered field deployment
Centralized cloud monitoring
Improved night-time detection
Historical detection reports
Advanced AI-based threat prediction
Important Abbreviations
Abbreviation	Full Form
AI	Artificial Intelligence
API	Application Programming Interface
ASGI	Asynchronous Server Gateway Interface
CORS	Cross-Origin Resource Sharing
COCO	Common Objects in Context
CRUD	Create, Read, Update, Delete
CSS	Cascading Style Sheets
DB	Database
DOM	Document Object Model
GPU	Graphics Processing Unit
HTTP	Hypertext Transfer Protocol
ID	Identifier
JSON	JavaScript Object Notation
JWT	JSON Web Token
LBPH	Local Binary Patterns Histograms
npm	Node Package Manager
REST	Representational State Transfer
SMTP	Simple Mail Transfer Protocol
UI	User Interface
URL	Uniform Resource Locator
UX	User Experience
YOLO	You Only Look Once
Project Status

The current project includes the core:

AI detection pipeline
Owner face enrollment and recognition
React monitoring dashboard
Camera-based detection
Virtual crop-zone monitoring
Crop-specific threat rules
OWNER / STRANGER classification
Detection logging
Analytics
Authentication
Email alerts
Siren control logic
Basic / Medium / Advanced setup documentation page

The project is structured as a full-stack AI application with separate frontend, backend, and AI-service layers.

Author

Prakash Tengunti

B.Tech – Computer Science and Engineering

GitHub:
https://github.com/PRAKASH-135

LinkedIn:
https://www.linkedin.com/in/prakash-tengunti-628b3b3a7/

License

Add the appropriate project license here if the repository is intended to be distributed publicly.
"""

Use pypandoc as required for Markdown generation.

pypandoc.convert_text(readme, "md", format="md", outputfile="/mnt/data/README.md", extra_args=["--standalone"])

print("Created: /mnt/data/README.md")

STDOUT/STDERR
Created: /mnt/data/README.md


Done. I created a complete GitHub-ready README.md for your AI Crop Protection project covering:

Project overview
Features
Frontend / Backend / AI Service
Architecture and data flow
Owner face enrollment
Camera and bounding-box workflow
Crop-zone monitoring
OWNER / STRANGER classification
Setup page
Project structure
Installation and run instructions
Environment variables
GitHub information
Security notes
Future improvements
Full forms and abbreviations
Author information
Download

Download README.md

You can place it directly in:

smart-crop-protection/
└── README.md

Then push it with:

git add README.md
git commit -m "Add comprehensive project README"
git push origin frontend-ui-redesign

If your PR is already open, the README commit will automatically appear in that PR. 

README.md
Document
crete readme for my github to add

Absolutely. Here is a clean GitHub README you can add directly as README.md in your smart-crop-protection repository.

# 🌱 AI-Based Smart Crop Protection & Intelligent Intrusion Alert System

An AI-powered smart agriculture system designed to protect crop fields from harmful animal and human intrusion using real-time computer vision, owner face recognition, virtual crop-zone monitoring, automated alerts, and a web-based monitoring dashboard.

---

## 📌 Project Overview

Traditional crop protection methods rely heavily on manual monitoring, physical fencing, or basic motion sensors. These approaches may generate false alarms and cannot reliably distinguish between the field owner and an unknown person.

This project combines **Artificial Intelligence, Computer Vision, Face Recognition, Web Technologies, and Automated Alert Systems** to provide intelligent crop-field protection.

The system can:

- Detect animals and humans using AI
- Monitor a defined crop-field boundary
- Identify the registered owner
- Classify unknown people as **STRANGER**
- Apply crop-specific threat rules
- Track detected objects
- Activate a siren when required
- Trigger flashlight-based deterrence in the advanced setup
- Send instant email alerts
- Store detection logs
- Display analytics
- Provide a complete web dashboard
- Support owner registration and authentication

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      CAMERA          │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   REACT FRONTEND     │
                    │      + VITE          │
                    └──────────┬───────────┘
                               │
                         HTTP Request
                               │
                               ▼
                    ┌──────────────────────┐
                    │ NODE.JS + EXPRESS    │
                    │      BACKEND         │
                    └──────────┬───────────┘
                               │
                         Image Request
                               │
                               ▼
                    ┌──────────────────────┐
                    │   PYTHON AI SERVICE  │
                    │       FASTAPI        │
                    └──────────┬───────────┘
                               │
               ┌───────────────┴────────────────┐
               │                                │
               ▼                                ▼
        ┌───────────────┐                ┌───────────────┐
        │   YOLOv8s     │                │ FACE RECOG.   │
        │ Object Detect │                │ Haar + LBPH   │
        └───────┬───────┘                └───────┬───────┘
                │                                │
                └──────────────┬─────────────────┘
                               ▼
                    ┌──────────────────────┐
                    │  BACKEND DECISION    │
                    │       ENGINE         │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             ▼                 ▼                 ▼
       ┌──────────┐      ┌──────────┐      ┌──────────┐
       │ MongoDB  │      │  Siren   │      │  Email   │
       │   Logs   │      │  Alert   │      │  Alert   │
       └──────────┘      └──────────┘      └──────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   MONITORING         │
                    │     DASHBOARD        │
                    └──────────────────────┘
🚀 Main Features
1. AI Object Detection

The system uses a custom-trained YOLOv8s model to detect objects in the camera feed.

The AI service provides:

Object label
Confidence score
Bounding-box coordinates
Track ID
Image dimensions
2. Owner Face Recognition

The system supports owner enrollment during registration.

The owner can capture multiple face samples through the browser camera.

The AI service uses:

OpenCV Haar Cascade
LBPH Face Recognition
Owner face model

Person detections are classified as:

Registered Owner → OWNER

Unknown Person → STRANGER

This prevents the system from treating the registered owner as an intruder.

3. Crop Boundary Monitoring

A virtual boundary is created around the protected crop field.

The system checks whether a detected object is inside or outside the configured crop zone.

             CROP FIELD

        ┌───────────────────┐
        │                   │
        │   PROTECTED       │
        │   CROP ZONE       │
        │                   │
        └───────────────────┘

     Camera             Camera
        ↓                 ↓
     Detection         Detection
4. Crop-Specific Rules

Different crops can have different threat conditions.

The backend checks the detected object against the configured crop rules.

Example:

Crop: Wheat

Animal/Object       Status
----------------------------
Elephant             Harmful
Cow                  Harmful
Bird                 Harmless
Person               Depends on owner status
👤 OWNER / STRANGER Detection

The project specifically classifies human detections as:

Detection	Classification
Registered owner	OWNER
Unknown person	STRANGER

This classification is used by the backend threat logic and detection logs.

📷 Real-Time Camera Detection

The camera workflow is:

Browser Camera
      ↓
Capture Frame
      ↓
React Frontend
      ↓
Node.js Backend
      ↓
FastAPI AI Service
      ↓
YOLOv8 Detection
      ↓
Face Recognition
      ↓
Backend Rule Processing
      ↓
Frontend Dashboard

The frontend continuously captures camera frames and sends them to the backend for analysis.

🎯 Bounding Box Detection

The AI service returns bounding-box coordinates.

The frontend uses these coordinates to draw detection boxes over the camera feed.

The displayed detection includes:

Object name
Confidence
Bounding box
Threat status
Owner/stranger classification

Example:

┌─────────────────────────────┐
│                             │
│       ┌───────────┐         │
│       │  STRANGER │         │
│       │    94%    │         │
│       └───────────┘         │
│                             │
└─────────────────────────────┘
🚨 Threat Detection

The backend combines several conditions before determining a threat.

Object Detection
       +
Crop Rules
       +
Boundary Check
       +
Owner Recognition
       +
Confidence
       +
Threat Duration
       ↓
Threat Decision

Possible states include:

No Active Threat
Warning
High Threat
🔊 Siren & Flashlight

The system supports different protection levels.

Basic Setup
2 Cameras
Boundary Monitoring
Instant Alerts
Medium Setup
2 Cameras
1 Siren inside the field
Boundary Monitoring
Instant Alerts
Advanced Setup
2 Cameras
1 Siren inside the field
1 Flashlight integrated with the siren
Boundary Monitoring
Instant Alerts

The advanced configuration provides both audible and visual deterrence.

📧 Email Alerts

The backend uses Nodemailer to send email alerts when configured threat conditions occur.

The alert system can provide information such as:

Detected object
Crop
Threat level
Detection image
Time of detection
📊 Detection Logs

All relevant detection events are stored in MongoDB.

The dashboard provides a Detection Logs page containing information such as:

Object
Crop
Confidence
Threat Level
Status
Siren Status
Track ID
Timestamp

Example:

OBJECT      CROP       CONFIDENCE     THREAT
------------------------------------------------
OWNER       Wheat        95%          Safe
STRANGER    Wheat        94%          Warning
Elephant    Wheat        91%          High
📈 Analytics Dashboard

The system provides analytics for reviewing detection activity.

Analytics can be used to understand:

Detection frequency
Object distribution
Confidence levels
Threat activity
Crop-specific events

Charts are implemented using Recharts.

🔐 Authentication

The frontend includes an authentication system with:

Login
Registration
Protected dashboard routes
Password authentication
Owner face enrollment

The dashboard is accessible only after authentication.

⚙️ System Setup Page

A dedicated Setup page is available from the dashboard sidebar.

The page presents:

01 — Basic Setup

Essential crop protection.

02 — Medium Setup

Smart warning system with siren-based deterrence.

03 — Advanced Setup

Complete protection with siren and flashlight.

The setup diagrams explain:

Number of cameras
Siren location
Flashlight
Detection boundary
Detection workflow
Alert mechanism
🖥️ Frontend

The frontend is built using:

Technology	Purpose
React	UI development
Vite	Development/build tool
Tailwind CSS	Styling
React Router	Routing
React Webcam	Camera access
Axios	API communication
Recharts	Analytics
Phosphor Icons	UI icons
Main Pages
Login
Register
Dashboard
Detection Logs
Analytics
Crop Rules
Setup
Settings
Main Components
CameraFeed.jsx
Sidebar.jsx
Topbar.jsx
⚙️ Backend

The backend is built using:

Node.js
Express.js
MongoDB
Mongoose
Multer
Axios
Nodemailer
JWT
dotenv

The backend is responsible for:

API handling
Authentication
Detection processing
Communication with AI service
Crop rules
Boundary processing
Owner/stranger classification
Threat decisions
Detection logs
Email alerts
Siren control
🤖 AI Service

The AI service is built using:

Python
FastAPI
Uvicorn
Ultralytics
YOLOv8s
OpenCV
PyTorch
Haar Cascade
LBPH

The AI service performs:

Image
  ↓
YOLO Detection
  ↓
Object Tracking
  ↓
Person Detection?
  ↓
Face Detection
  ↓
LBPH Recognition
  ↓
OWNER / STRANGER
  ↓
Detection Result
📂 Project Structure
smart-crop-protection/
│
├── ai-service/
│   ├── main.py
│   ├── train_face.py
│   ├── owner_model.yml
│   ├── owner_data/
│   ├── yolov8s_custom.pt
│   ├── requirements.txt
│   └── ...
│
├── backend/
│   ├── server.js
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── public/
│   │   └── setup/
│   │       ├── basic-setup.png
│   │       ├── medium-setup.png
│   │       └── advanced-setup.png
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── CameraFeed.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Topbar.jsx
│   │   │   └── ...
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Setup.jsx
│   │   │   └── ...
│   │   │
│   │   ├── App.jsx
│   │   └── App.css
│   │
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
🛠️ Installation
Prerequisites

Install:

Node.js
npm
Python 3.x
MongoDB / MongoDB Atlas
Git
1. Clone Repository
git clone https://github.com/PRAKASH-135/smart-crop-protection.git
cd smart-crop-protection
2. Start AI Service
cd ai-service
python -m venv .venv

Activate:

.\.venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

Run:

uvicorn main:app --reload --port 8000

AI service:

http://127.0.0.1:8000
3. Start Backend

Open a new terminal:

cd backend
npm install

Configure .env with your database, JWT, and email settings.

Start:

node server.js

Or, if configured:

npm run dev
4. Start Frontend

Open another terminal:

cd frontend
npm install

Start:

npm run dev

Frontend:

http://localhost:5173
🔄 Running the Complete System

Three services should be running.

Terminal 1
cd ai-service
.\.venv\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
Terminal 2
cd backend
node server.js
Terminal 3
cd frontend
npm run dev

Then open:

http://localhost:5173
🔑 Environment Variables

Do not commit secrets to GitHub.

Example backend .env:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password

Use the exact environment variable names required by the current backend implementation.

🧑‍💻 Owner Enrollment

During registration:

Enter Owner Details
        ↓
Allow Camera
        ↓
Start Face Scan
        ↓
Capture Multiple Samples
        ↓
POST /enroll-owner
        ↓
FastAPI Face Validation
        ↓
Train/Update Owner Model
        ↓
Registration Complete

The AI service validates the captured samples before updating the owner model.

📡 API Communication
Frontend → Backend

Used for:

Login
Registration
Camera detection
Logs
Analytics
Crop rules
Settings
Dashboard data
Frontend → AI Service

Owner enrollment:

POST /enroll-owner
Backend → AI Service

The backend sends camera frames to the AI service for object detection and owner recognition.

🔒 Security

Do not commit the following to GitHub:

.env
MongoDB passwords
JWT secrets
Email passwords
API keys
Private owner face images
Private credentials

Check before pushing:

git status

and:

git diff
📚 Tools & Full Forms
Term	Full Form / Meaning
AI	Artificial Intelligence
API	Application Programming Interface
ASGI	Asynchronous Server Gateway Interface
CORS	Cross-Origin Resource Sharing
COCO	Common Objects in Context
CRUD	Create, Read, Update, Delete
CSS	Cascading Style Sheets
DB	Database
DOM	Document Object Model
GPU	Graphics Processing Unit
HTTP	Hypertext Transfer Protocol
ID	Identifier
JSON	JavaScript Object Notation
JWT	JSON Web Token
LBPH	Local Binary Patterns Histograms
npm	Node Package Manager
REST	Representational State Transfer
SMTP	Simple Mail Transfer Protocol
UI	User Interface
URL	Uniform Resource Locator
UX	User Experience
YOLO	You Only Look Once
🔮 Future Improvements

Possible future improvements:

Multiple registered owners
Role-based access control
Mobile application
Cloud deployment
SMS notifications
Push notifications
IoT siren integration
Raspberry Pi deployment
ESP32/Arduino hardware integration
Solar-powered field deployment
Multiple camera streams
Automatic crop-zone calibration
Improved night detection
Cloud-based analytics
Advanced threat prediction
👨‍💻 Author

Prakash Tengunti

B.Tech — Computer Science and Engineering

GitHub

https://github.com/PRAKASH-135

LinkedIn

https://www.linkedin.com/in/prakash-tengunti-628b3b3a7/

📄 Project Status

The project currently contains:

✅ AI object detection
✅ YOLOv8s custom detection
✅ Owner face enrollment
✅ OWNER / STRANGER classification
✅ Real-time camera monitoring
✅ Bounding-box visualization
✅ Crop-zone monitoring
✅ Crop-specific rules
✅ Detection tracking
✅ Detection logs
✅ Analytics dashboard
✅ Authentication
✅ Email alerts
✅ Siren control logic
✅ Basic / Medium / Advanced setup page
✅ React frontend
✅ Node.js backend
✅ Python FastAPI AI service
✅ MongoDB integration
🌱 Smart Farming. Intelligent Protection. Better Tomorrow.

### Add it to your repository

Save the above as:

```text
smart-crop-protection/README.md
