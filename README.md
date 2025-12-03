MDII Admin-Coordinator Panel

The MDII Coordinator Panel is a web application built with React js, TypeScript, Tailwind CSS, Redux Toolkit, KoboToolbox and Azure Blob Storage that enables administrators to manage the digital research infrastructure. It provides a centralized interface for overseeing coordinators, domain experts, tools, and platform activities. This applcation has two panels one for admins and the other for coordinators based on the activities they will be performing using the panel.


Project Overview

- React js
- TypeScript
- Tailwind CSS 
- Redux Toolkit
- KoboToolbox API integration
- Azure Blob Storage 


Folder Structure (Includes the main ones)

mdii-coordinator-dashboard/
├── kobo-coordi-dash-main/           
│   ├── api/                                  # API integration layer
│   ├── src/
│   │   ├── components/                       # React components
│   │   │   ├── admin/                        # Admin-specific components
│   │   │   │   ├── calendar/                   # Admin Calendar components
│   │   │   │   ├── coordinatorManagement/      # Coordinator Management components
│   │   │   │   ├── dashboard/                  # Dashboard components
│   │   │   │   ├── domainExpertManagement/     # Domain Expert Management components
│   │   │   │   ├── userguide/                  # User guide specific to the admin
│   │   │   ├── common/                       # Shared components (Feedback & Support, subcomponents, translation management )
│   │   │   ├── coordinator/                  # Coordinator management
│   │   │   │   ├── userguide/                  # User guide specific to the coordinator
│   │   │   └── ui/                 # UI components
│   │   ├── config/                 # API & kobo config
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── lib/                    # Utility libraries
│   │   ├── pages/                  # Main Components
│   │   ├── store/                  # State management
│   │   ├── types/                  # TypeScript type definitions
│   │   └── utils/                  # blob storage components
│   │   └── main.tsx                # main file
│   │   └── index.css 
│   │   └── App.tsx            
│   └── public/                     # Static assets (mdii logo, mdii sunburst graph)
│   └── package.json                # Includes all installed 


Getting Started

# 1. Clone and install

Go into 'kobo-coordi-dash-main' folder
npm install

# 2. Create .env.local
add the .env file

# 3. Run dev server
npm run dev
# Open http://localhost:3000

# 4. Vercel deployed link
https://mdii-coordinator-dashboard.vercel.app/