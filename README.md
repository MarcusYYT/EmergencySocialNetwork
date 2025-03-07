# Emergency Social Network (ESN)

## Purpose
This is a comprehensive Emergency Social Network (ESN) application developed as a group project for the course 18-652 at Carnegie Mellon University. The ESN platform facilitates communication and resource sharing during emergency situations, allowing users to coordinate, share status updates, and access critical resources.

## Live Demo
Access the live application: [Emergency Social Network](https://emergencysocialnetwork.onrender.com/)

## Key Features
- **User Management**: Registration, authentication, and profile management
- **Status Updates**: Users can update and share their status (OK, Help, Emergency)
- **Communication Channels**:
  - Public message wall for community-wide announcements
  - Private messaging between users
  - Threaded discussions for specific topics
  - Announcement board for critical information
- **Resource Sharing**: Platform for sharing and requesting resources during emergencies
- **Location Sharing**: Optional location sharing for emergency coordination
- **Emergency Contacts**: Management of emergency contact information
- **Email Notifications**: Configurable email alerts for important updates
- **Administrator Tools**: User management and system monitoring

## Technology Stack

### Backend
- **Node.js**: JavaScript runtime for server-side logic
- **Express.js**: Web application framework
- **Passport.js**: Authentication middleware
- **Socket.IO**: Real-time bidirectional event-based communication

### Frontend
- **HTML, CSS, JavaScript**: Core web technologies
- **Pug**: Template engine for generating HTML
- **Bootstrap 5**: Frontend component library for responsive design
- **Font Awesome**: Icon toolkit

### Database
- **MySQL**: Relational database management system
- **Sequelize**: Promise-based ORM for Node.js

### Development Tools
- **Nodemon**: Utility for monitoring changes and automatically restarting server
- **ESLint**: Static code analysis tool for identifying problematic patterns
- **JsDoc**: API documentation generator
  - Run `npx jsdoc -c JsDoc_config.json -r` to generate HTML documentation in the `out` folder
  - Run `npx jsdoc2md -c JsDoc_config.json` to generate markdown documentation

### Deployment
- **Render**: Cloud application hosting platform

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL database

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables in a `.env` file:
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   MAILGUN_API_KEY=your_mailgun_api_key
   MAILGUN_DOMAIN=your_mailgun_domain
   ```
4. Run the application: `npm start`
5. For development with auto-reload: `npm run dev`

## Project Structure
- `/controllers`: Request handlers and business logic
- `/models`: Database models and schema definitions
- `/routes`: API route definitions
- `/services`: Service layer for external integrations
- `/public`: Static assets (CSS, JavaScript, images)
- `/views`: Pug templates for rendering HTML
- `/middlewares`: Custom middleware functions

## Disclaimer
This project is built according to the guidelines of course 18-652 by Carnegie Mellon University, for showcasing purposes only.