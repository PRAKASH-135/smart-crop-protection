# 🌾 AI-Based Smart Crop Protection & Intelligent Intrusion Alert System

An AI-powered smart crop protection system that uses **YOLOv8 object detection**, **crop-specific rules**, and a **real-time web dashboard** to detect animals, birds, and human intruders and automatically trigger alerts when a harmful object is detected.

---

## 📌 Project Overview

Crop fields are often damaged by animals, birds, and unauthorized human intrusion. Traditional protection methods such as manual monitoring and continuous siren activation can be inefficient and may generate unnecessary alarms.

This project provides an intelligent solution by combining:

- Artificial Intelligence
- Computer Vision
- YOLOv8 Object Detection
- Crop-specific rule-based decision making
- Real-time webcam monitoring
- Automatic siren activation
- MongoDB detection logging
- React-based monitoring dashboard

The system determines whether a detected object is harmful based on the **selected crop** before activating the siren.

---

## 🎯 Objectives

- Detect animals, birds, and humans using AI.
- Monitor crop fields through a camera.
- Provide crop-specific harmful and harmless object rules.
- Reduce unnecessary siren activation.
- Detect human intruders.
- Provide real-time detection status.
- Store detection history in MongoDB.
- Provide logs and analytics through a web dashboard.

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      Camera/Webcam   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │      Dashboard       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Node.js + Express    │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Python FastAPI       │
                    │    AI Service        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      YOLOv8          │
                    │ Object Detection     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Crop Rule Engine     │
                    │ Harmful / Harmless   │
                    └──────────┬───────────┘
                               │
                  ┌────────────┴────────────┐
                  ▼                         ▼
           ┌─────────────┐           ┌─────────────┐
           │ Siren Alert │           │   MongoDB   │
           └─────────────┘           │ Detection   │
                                     │    Logs     │
                                     └─────────────┘
