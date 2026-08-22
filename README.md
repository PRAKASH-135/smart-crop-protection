AI-Based Smart Crop Protection & Intelligent Intrusion Alert System

An AI-powered smart agriculture system designed to protect crop fields
by detecting animals and people in real time, identifying whether a
detected person is the registered owner or a stranger, checking whether
the detection is inside/outside the protected crop zone, and triggering
alerts when a harmful intrusion is detected.

Project Overview

Traditional crop protection methods such as manual monitoring, physical
fencing, and basic motion alarms can be expensive, unreliable, and
unable to distinguish between harmless activity and genuine threats.

This project combines:

Computer vision and AI-based object detection

Real-time camera monitoring

Virtual crop-zone/boundary monitoring

Owner face recognition

Crop-specific threat rules

Detection tracking

Siren/flashlight alert logic

Email notifications

Detection logs and analytics

Authentication and protected dashboard access

The system is divided into three major layers:

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

The AI service uses a custom-trained YOLOv8s model to detect objects
relevant to crop protection.

The detection response contains information such as:

Object/class label

Confidence score

Bounding-box coordinates

Track ID

Image dimensions

2. Owner Recognition

The system can enroll an authorized owner using face samples captured
through the frontend camera.

The owner-recognition pipeline uses:

OpenCV Haar Cascade for face detection

LBPH for face recognition

A locally stored owner recognition model

When a person is detected:

Matching registered owner → OWNER
No matching owner → STRANGER

3. Crop Boundary Monitoring

The frontend provides a virtual crop-zone/boundary.

The backend uses this information to determine whether a detection is
relevant to the protected field.

This allows the system to distinguish between:

Activity outside the protected crop area

Activity inside the protected crop area

4. Crop-Specific Rules

Different crops can have different harmful-object rules.

The backend checks the detected object against the configured crop rules
before deciding whether it represents a threat.

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

When the configured threat condition is satisfied, the system can
activate the siren logic.

The advanced setup also represents a flashlight integrated with the
siren unit for stronger visual deterrence.

9. Email Alerts

The backend can send email alerts using Nodemailer when configured
threat conditions occur.

10. Detection Logs

Detection events are stored and displayed through the Detection Logs
page.

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

The dashboard includes an analytics section for reviewing detection
activity and system statistics.

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

The setup page contains visual diagrams explaining the equipment and
workflow.

Technology Stack

Frontend

Technology              Purpose

React                   User interface
Vite                    Frontend development/build tool
Tailwind CSS            Utility-based styling
React Router            Page routing
React Webcam            Browser camera access
Axios                   HTTP communication
Recharts                Analytics charts
@phosphor-icons/react   UI icons

Backend

Technology   Purpose

Node.js      JavaScript runtime
Express.js   REST API server
MongoDB      Database
Mongoose     MongoDB ODM
Multer       Image upload handling
Axios        AI-service communication
Nodemailer   Email alerts
JWT          Authentication
dotenv       Environment configuration

AI Service

Technology     Purpose

Python         AI service implementation
FastAPI        AI REST API
Uvicorn        FastAPI server
Ultralytics    YOLO framework
YOLOv8s        Object detection
OpenCV         Image processing and face processing
Haar Cascade   Face detection
LBPH           Owner face recognition
PyTorch        Deep-learning framework

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

The frontend is organized into reusable React components and page-level
components.

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

The face images used for enrollment are local application data and
should not be committed to a public repository.

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

Used to send captured frames for AI inference and receive detection
results.

Installation and Setup

Prerequisites

Install the following before running the project:

Node.js

npm

Python 3.x

MongoDB / MongoDB Atlas

Git

For AI acceleration, a compatible NVIDIA GPU can be used, but CPU
execution is also possible depending on the model and environment.

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

Terminal 1 --- AI Service

cd ai-service
.\.venv\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000

Terminal 2 --- Backend

cd backend
npm run dev

or:

node server.js

Terminal 3 --- Frontend

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

The project can be merged into the main branch after the pull request
passes the repository's merge checks.

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

The owner face dataset and generated recognition model should be treated
as sensitive application data.

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

Abbreviation   Full Form

AI             Artificial Intelligence
API            Application Programming Interface
ASGI           Asynchronous Server Gateway Interface
CORS           Cross-Origin Resource Sharing
COCO           Common Objects in Context
CRUD           Create, Read, Update, Delete
CSS            Cascading Style Sheets
DB             Database
DOM            Document Object Model
GPU            Graphics Processing Unit
HTTP           Hypertext Transfer Protocol
ID             Identifier
JSON           JavaScript Object Notation
JWT            JSON Web Token
LBPH           Local Binary Patterns Histograms
npm            Node Package Manager
REST           Representational State Transfer
SMTP           Simple Mail Transfer Protocol
UI             User Interface
URL            Uniform Resource Locator
UX             User Experience
YOLO           You Only Look Once

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

The project is structured as a full-stack AI application with separate
frontend, backend, and AI-service layers.

Author

Prakash Tengunti

B.Tech -- Computer Science and Engineering

GitHub:
https://github.com/PRAKASH-135

LinkedIn:
https://www.linkedin.com/in/prakash-tengunti-628b3b3a7/

License

Add the appropriate project license here if the repository is intended
to be distributed publicly.
