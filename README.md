# MDII Admin-Coordinator Panel

The MDII Coordinator Panel is a web application built with React.js, TypeScript, Tailwind CSS, Redux Toolkit, KoboToolbox and Azure Blob Storage that enables administrators to manage the digital research infrastructure. It provides a centralized interface for overseeing coordinators, domain experts, tools and platform activities. This application has two panels: one for admins and the other for coordinators, based on the activities they will be performing using the panel.

## Project Overview

### Tech Stack

- **React.js** 
- **TypeScript** 
- **Tailwind CSS** 
- **Redux Toolkit**
- **KoboToolbox API**
- **Azure Blob Storage**

## Folder Structure
```
mdii-coordinator-dashboard/
├── kobo-coordi-dash-main/           
│   ├── api/                                  # API integration layer
│   ├── src/
│   │   ├── components/                       # React components
│   │   │   ├── admin/                        # Admin-specific components
│   │   │   │   ├── calendar/                 # Admin Calendar components
│   │   │   │   ├── coordinatorManagement/    # Coordinator Management components
│   │   │   │   ├── dashboard/                # Dashboard components
│   │   │   │   ├── domainExpertManagement/   # Domain Expert Management components
│   │   │   │   └── userguide/                # User guide specific to the admin
│   │   │   ├── common/                       # Shared components (Feedback & Support, subcomponents, translation management)
│   │   │   ├── coordinator/                  # Coordinator management
│   │   │   │   └── userguide/                # User guide specific to the coordinator
│   │   │   └── ui/                           # UI components
│   │   ├── config/                           # API & Kobo config
│   │   ├── hooks/                            # Custom React hooks
│   │   ├── lib/                              # Utility libraries
│   │   ├── pages/                            # Main Components
│   │   ├── store/                            # State management
│   │   ├── types/                            # TypeScript type definitions
│   │   ├── utils/                            # Blob storage components
│   │   ├── main.tsx                          # Main entry file
│   │   ├── index.css                         # Global styles
│   │   └── App.tsx                           # Root component
│   ├── public/                               # Static assets (MDII logo, MDII sunburst graph)
│   └── package.json                          # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v22.21.1 or higher)
- npm

### Installation

1. **Clone the repository and navigate to the project folder**
```bash
   cd kobo-coordi-dash-main
```

2. **Install dependencies**
```bash
   npm install
```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory and add the required environment variables.

4. **Run the development server**
```bash
   npm run dev
```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Deployment

The application is deployed on Vercel:

🔗 **Live Application:** [https://mdii-coordinator-dashboard.vercel.app/](https://mdii-coordinator-dashboard.vercel.app/)

## Features

- **Admin Panel** - Manage evaluation tools, coordinators, domain experts and platform settings
- **Coordinator Panel** - Handle tool workflows and evaluation processes specific to the coordinator
- **Role-Based Access** - Separate interfaces based on user roles
- **KoboToolbox Integration** - Direct integration with survey data
- **Azure Blob Storage** - Secure cloud storage for platform assets
