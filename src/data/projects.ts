export type CategoryId = "robotics" | "hardware" | "ai" | "web" | "cyber" | "mechanical";

export interface Project {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  tech: string[];
  areas: string[];
  status: string;
  featured?: boolean;
}

export interface Category {
  id: CategoryId;
  index: string;
  filterLabel: string;
  title: string;
  discipline: string;
}

export const categories: Category[] = [
  {
    id: "robotics",
    index: "01",
    filterLabel: "ROBOTICS",
    title: "Robotics & ROS",
    discipline: "ROS + Simulation + Motion Planning + Navigation + Perception",
  },
  {
    id: "hardware",
    index: "02",
    filterLabel: "HARDWARE",
    title: "Embedded & Hardware",
    discipline: "Mechanical + Electronics + Embedded + Control + Robotics",
  },
  {
    id: "ai",
    index: "03",
    filterLabel: "AI-ML",
    title: "AI & Machine Learning",
    discipline: "ML + Computer Vision + Generative AI + Data",
  },
  {
    id: "web",
    index: "04",
    filterLabel: "WEB",
    title: "Web & Product Engineering",
    discipline: "Frontend + Backend + Database + Product Engineering",
  },
  {
    id: "cyber",
    index: "05",
    filterLabel: "CYBERSECURITY",
    title: "Cybersecurity",
    discipline: "Threat Detection + URL Analysis + Protocol Security",
  },
  {
    id: "mechanical",
    index: "06",
    filterLabel: "MECHANICAL",
    title: "Mechanical Design",
    discipline: "CAD + Mechanisms + Fabrication + Analysis",
  },
];

export const projects: Project[] = [
  // ── 01 · ROBOTICS & ROS ────────────────────────────────────────────────
  {
    id: "dwa-planner",
    name: "Custom DWA Local Planner — TurtleBot3",
    category: "robotics",
    featured: true,
    description:
      "Custom Dynamic Window Approach local planner written from scratch for TurtleBot3 on ROS 2 Humble — cost-function design, trajectory prediction, and adaptive planning running in Gazebo simulation and real-world conditions.",
    tech: ["ROS 2", "TurtleBot3", "DWA", "Gazebo", "RViz", "C++"],
    areas: ["Motion Planning", "Trajectory Prediction", "Cost Functions", "ROS 2 Nodes"],
    status: "Sim + real robot",
  },
  {
    id: "amr-simulation",
    name: "AMR Simulation",
    category: "robotics",
    featured: true,
    description:
      "PyBullet simulation of an autonomous mobile manipulator for agricultural work — path planning, obstacle avoidance, and navigation with a WebSocket control interface and an autonomous harvesting workflow.",
    tech: ["ROS", "Python", "Simulation", "Path Planning", "Bullet Physics"],
    areas: ["Navigation", "Obstacle Avoidance", "Kinematics", "Trajectory Planning"],
    status: "Simulation",
  },
  {
    id: "turtlebot3-nav",
    name: "TurtleBot3 ROS Navigation",
    category: "robotics",
    description:
      "First ROS build — TurtleBot3 autonomous navigation and mapping on ROS Noetic with Gazebo and slam_toolbox, exploring and mapping the environment in real time.",
    tech: ["ROS", "TurtleBot3", "Gazebo", "SLAM", "slam_toolbox"],
    areas: ["SLAM", "Autonomous Navigation", "Mapping", "Simulation"],
    status: "Simulation",
  },
  {
    id: "webots-nav",
    name: "Webots Intelligent Navigation",
    category: "robotics",
    description:
      "Built and tuned behaviors for the e-puck robot in Webots — autonomous navigation driven by onboard sensors and closed-loop control.",
    tech: ["Webots", "C", "Robotics", "Sensors"],
    areas: ["Sensor-driven Control", "Autonomous Navigation", "Behavior Tuning"],
    status: "Simulation",
  },
  {
    id: "tentabot",
    name: "Tentabot / Deep RL Navigation",
    category: "robotics",
    description:
      "Deep-RL navigation for mobile robots in dynamic environments using occupancy values of motion primitives, alongside the heuristic tentacle-based reactive navigation framework (IROS 2022 reference code).",
    tech: ["Deep RL", "Motion Primitives", "Reactive Navigation"],
    areas: ["Reinforcement Learning", "Motion Primitives", "Dynamic Environments"],
    status: "Open-source fork",
  },
  {
    id: "webots-line",
    name: "Webots Line Following",
    category: "robotics",
    description:
      "Robot task orchestration in Webots — repeatable simulations with structured line-following behaviors and tunable automation.",
    tech: ["Webots", "Automation", "Python", "Simulation"],
    areas: ["Line Following", "Simulation Automation", "Behavior Design"],
    status: "Simulation",
  },
  {
    id: "line-obstacle",
    name: "Line Following with Obstacle Avoidance",
    category: "robotics",
    description:
      "Webots simulation of a robot that follows a track while avoiding obstacles — IR line sensing, distance sensing, and PID tuning against realistic physics.",
    tech: ["Webots", "Python", "PID", "IR Sensors", "Distance Sensors"],
    areas: ["Line Following", "Obstacle Avoidance", "PID Control"],
    status: "Simulation",
  },

  // ── 02 · EMBEDDED & HARDWARE ──────────────────────────────────────────
  {
    id: "agri-mobile-robot",
    name: "Agricultural Mobile Robot with 6-DOF Arm",
    category: "hardware",
    featured: true,
    description:
      "Agricultural mobile manipulator — Mecanum omnidirectional base carrying a 6-DOF arm with dual-finger gripper, LiDAR and camera, joint-limit safety and real-time control; arm motions planned with inverse kinematics and path planning.",
    tech: ["6-DOF Arm", "Mecanum Drive", "LiDAR", "Inverse Kinematics", "WebSocket Control"],
    areas: ["Mechanical", "Electronics", "Embedded", "Control", "Robotics"],
    status: "System design",
  },
  {
    id: "rc-robot",
    name: "R C Robot (Kalabhairav)",
    category: "hardware",
    description:
      "Remote-controlled robotic system designed and built with integrated mechanical and electronic components; led the team presentation at university technical symposiums.",
    tech: ["Arduino", "Mechanical Design", "Electronics", "C++"],
    areas: ["Mechanical", "Electronics", "Embedded", "Control", "Robotics"],
    status: "Hardware build",
  },
  {
    id: "smart-monitoring",
    name: "Smart Monitoring System",
    category: "hardware",
    description:
      "IoT monitoring solution built on Arduino for real-time data collection and environmental analysis over wireless connectivity.",
    tech: ["Arduino", "IoT", "Python", "Sensors"],
    areas: ["Embedded", "Sensors", "IoT", "Data Acquisition"],
    status: "IoT build",
  },
  {
    id: "posture-detection",
    name: "Posture Detection on Jetson Nano",
    category: "hardware",
    description:
      "ML model that separates good from bad sitting posture in images and video, trained on a webcam-captured dataset and built to run on the Jetson Nano.",
    tech: ["Python", "Jetson Nano", "jetson-inference", "Machine Learning"],
    areas: ["Edge AI", "Computer Vision", "Embedded Deployment"],
    status: "Jetson Nano",
  },

  // ── 03 · AI & MACHINE LEARNING ────────────────────────────────────────
  {
    id: "omi-mentor",
    name: "Omi Mentor",
    category: "ai",
    featured: true,
    description:
      "AI-powered wearable companion that listens continuously and returns real-time personalized advice through in-app notifications, using generative AI techniques.",
    tech: ["TypeScript", "React", "Supabase", "Generative AI"],
    areas: ["Generative AI", "Personalization", "Product Engineering"],
    status: "Deployed",
  },
  {
    id: "arthoscan",
    name: "ArthoScan Pro",
    category: "ai",
    description:
      "Deep-learning web application for knee osteoarthritis detection and severity prediction — CNN model behind a Flask image-upload interface.",
    tech: ["Python", "Flask", "TensorFlow", "Keras", "OpenCV", "CNN"],
    areas: ["Deep Learning", "Medical Imaging", "Web Application"],
    status: "DL web app",
  },
  {
    id: "influence-ranker",
    name: "Influence Metric Ranker",
    category: "ai",
    description:
      "Social influence analytics — engagement, reach, and performance tracking across platforms with live dashboards, trend analysis, and report exports.",
    tech: ["TypeScript", "React", "TanStack Query", "Data Analytics"],
    areas: ["Data Analytics", "Dashboards", "API Integration"],
    status: "Live preview",
  },
  {
    id: "kannada-scribe",
    name: "Kannada Scribe Vision",
    category: "ai",
    description:
      "Deep-learning-powered Kannada handwritten text recognition, built to help preserve and digitize cultural heritage.",
    tech: ["TypeScript", "React", "Hugging Face Transformers", "Deep Learning"],
    areas: ["Deep Learning", "Handwriting Recognition", "Transformers"],
    status: "Web app",
  },
  {
    id: "hiring-ai",
    name: "Hiring AI Platform",
    category: "ai",
    description:
      "Collaborative build of an AI-driven recruitment platform — automated resume screening and ML-based candidate selection.",
    tech: ["Machine Learning", "Frontend", "Backend", "AI"],
    areas: ["Machine Learning", "Resume Screening", "Full-stack"],
    status: "Collaborative build",
  },
  {
    id: "qsense",
    name: "QSense",
    category: "ai",
    description:
      "Multimodal AI that understands your home environment and helps you act on what matters — see, understand, act.",
    tech: ["Next.js", "TypeScript", "React", "Supabase", "Multimodal AI"],
    areas: ["Multimodal AI", "Context Awareness", "Product Engineering"],
    status: "Deployed",
  },

  // ── 04 · WEB & PRODUCT ENGINEERING ────────────────────────────────────
  {
    id: "relieflink",
    name: "ReliefLink",
    category: "web",
    featured: true,
    description:
      "Digital logistics and coordination system for emergency aid distribution in crisis situations.",
    tech: ["Vite", "TypeScript", "React", "Tailwind CSS", "Maps"],
    areas: ["Frontend", "Maps & Routing", "Logistics", "Product Engineering"],
    status: "Deployed",
  },
  {
    id: "debt-manager",
    name: "Debt Manager",
    category: "web",
    description: "Personal debt tracker — a clear, calm plan for every loan you owe.",
    tech: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
    areas: ["Frontend", "Product Engineering", "Personal Finance"],
    status: "Deployed",
  },
  {
    id: "bengaluru-traffic",
    name: "Bengaluru Traffic Navigator",
    category: "web",
    description:
      "Real-time Bengaluru traffic navigator — Express and MongoDB services feeding traffic points, alerts, and metrics to a Mapbox map over Socket.IO.",
    tech: ["React", "Mapbox GL", "Express", "MongoDB", "Socket.IO", "Recharts"],
    areas: ["Frontend", "Backend", "Database", "Real-time Data"],
    status: "Real-time full-stack",
  },
  {
    id: "kodbank",
    name: "KodBank",
    category: "web",
    description:
      "Full-stack banking web app — registration and login with bcrypt, JWT auth in httpOnly cookies, protected routes, and a balance dashboard.",
    tech: ["React 19", "Vite", "Node.js", "Express", "MongoDB Atlas", "JWT"],
    areas: ["Frontend", "Backend", "Database", "Authentication"],
    status: "Deployed",
  },
  {
    id: "tripus",
    name: "TriPUS Store",
    category: "web",
    description:
      "Retail intelligence platform — revenue, customer, inventory, and transaction analytics for modern retail businesses.",
    tech: ["Next.js", "React", "TypeScript", "Analytics"],
    areas: ["Frontend", "Dashboards", "Analytics", "Product Engineering"],
    status: "Deployed",
  },
  {
    id: "crop-info",
    name: "Crop Info Harbor",
    category: "web",
    description:
      "Crop information web app — showcase pages with full detail views for browsing crop profiles.",
    tech: ["TypeScript", "React"],
    areas: ["Frontend", "Product Engineering", "Agriculture Tech"],
    status: "Web app",
  },

  // ── 05 · CYBERSECURITY ────────────────────────────────────────────────
  {
    id: "web-watch-phish",
    name: "Web Watch Phish",
    category: "cyber",
    featured: true,
    description:
      "AI-powered phishing detection built at ChipChamps AMUHACKS 4.0 — real-time URL safety analysis with threat breakdowns, scan history, and Chrome extension support.",
    tech: ["TypeScript", "React", "Machine Learning", "Web Security", "Chrome Extension"],
    areas: ["Threat Detection", "URL Analysis", "Security Tooling"],
    status: "Hackathon build",
  },
  {
    id: "mqtt-security",
    name: "Authentication & Integrity for MQTT",
    category: "cyber",
    description:
      "Certificate-based authentication and integrity for MQTT messaging — CA/TLS provisioning with encrypted publish/subscribe and Python test tooling.",
    tech: ["C", "MQTT", "TLS", "OpenSSL", "paho-mqtt"],
    areas: ["Protocol Security", "TLS / PKI", "Embedded Messaging"],
    status: "Security prototype",
  },

  // ── 06 · MECHANICAL DESIGN ────────────────────────────────────────────
  {
    id: "quadruped",
    name: "Quadruped Robot (Spot-Inspired)",
    category: "mechanical",
    featured: true,
    description:
      "Spot-inspired quadruped designed in Autodesk Fusion 360 — complete structural assembly and component modeling prepared for fabrication and future electronics integration.",
    tech: ["Fusion 360", "CAD", "Mechanical Design"],
    areas: ["CAD", "Assembly Design", "Mechanisms", "Fabrication"],
    status: "CAD model",
  },
  {
    id: "agri-mech",
    name: "Agricultural Robot Mechanical Design",
    category: "mechanical",
    description:
      "Mechanical definition of the agricultural mobile manipulator — Mecanum base geometry, 6-DOF arm reach, dual-finger gripper, joint limits, and mass distribution.",
    tech: ["6-DOF Arm", "Mecanum Drive", "Dual-Finger Gripper", "Joint Kinematics"],
    areas: ["Mechanical", "Kinematics", "Mechanisms", "Robotics"],
    status: "Design + simulation",
  },
];
