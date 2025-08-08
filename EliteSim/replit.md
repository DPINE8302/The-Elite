# The Elite - Business Simulation

## Overview

The Elite is a comprehensive wealth and power simulation game that models the complexities of managing planet-scale wealth across multiple asset classes. Players begin by creating a character with specific lineage (old money vs. new money) and archetype (disruptor, oracle, conqueror, or tastemaker), then navigate through various business scenarios including capital markets, portfolio management, crisis resolution, competitive dynamics with AI rivals, and now a vast wealth empire management system.

The application has been significantly expanded with pre-loaded real 2024 market data and over 100 new features optimized for desktop, mobile, and iPad platforms. Players make strategic decisions across multiple pillars: Capital (investing and trading), Creation (building new ventures), Consumption (strategic spending), Crisis Management, Real Estate Empire, Art & Collectibles, Luxury Assets, Private Equity/VC, and Political Influence. The game features the sophisticated "Aegis OS" interface plus a new comprehensive "Wealth Empire" section for managing diverse asset portfolios.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React + TypeScript**: Modern component-based architecture using functional components with hooks
- **Vite**: Fast development build tool with hot module replacement
- **TailwindCSS + shadcn/ui**: Utility-first styling with a comprehensive component library
- **Wouter**: Lightweight client-side routing
- **TanStack Query**: Server state management and caching for API calls
- **Context API**: Global game state management with useReducer pattern

### Backend Architecture
- **Express.js**: RESTful API server with TypeScript
- **Modular Route System**: Clean separation of API endpoints with centralized error handling
- **Storage Abstraction**: Interface-based storage layer with in-memory storage implementation
- **Pre-loaded Market Data**: Real 2024 stock market data from major companies, indices, crypto, and commodities
- **Market Simulation**: Realistic price movement simulation with volatility modeling
- **Comprehensive Asset APIs**: Real estate, art & collectibles, luxury vehicles, private investments, political actions

### Data Storage Solutions
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL
- **Drizzle ORM**: Type-safe database interactions with schema-first approach
- **Schema-driven Design**: Shared TypeScript types between frontend and backend
- **Migration System**: Database versioning with drizzle-kit

### Key Data Models
- **Users & Players**: Authentication and character profiles
- **Portfolio Holdings**: Stock positions with cost basis tracking
- **Stock Watchlist**: Monitored securities for quick access
- **Crisis System**: Dynamic events requiring player response
- **Rivals**: AI competitors with their own wealth and threat levels
- **Market Data**: Real-time and historical stock information

### Authentication and Authorization
- **Session-based Authentication**: Express sessions with PostgreSQL storage
- **Player-scoped Data**: All game data tied to specific player characters
- **Role-based Access**: Different game modes and capabilities based on character archetype

### UI/UX Design Philosophy
- **Dark Theme**: Professional, financial terminal aesthetic
- **Data Density**: Information-rich displays optimized for decision making
- **Responsive Design**: Works across desktop and mobile devices
- **Accessibility**: Following WCAG guidelines with proper ARIA labels
- **Real-time Updates**: Live data feeds and interactive charts

## External Dependencies

### Third-party Services
- **Alpha Vantage API**: Real-time and historical stock market data
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit**: Development and deployment platform

### Key Libraries
- **@neondatabase/serverless**: PostgreSQL client optimized for serverless
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI component primitives
- **axios**: HTTP client for external API calls
- **zod**: Runtime type validation and schema parsing
- **date-fns**: Date manipulation and formatting

### Development Tools
- **TypeScript**: Static type checking across the entire stack
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with Autoprefixer
- **Vite Plugins**: Development experience enhancements including error overlays

### Deployment Architecture
- **Single Repository**: Monorepo structure with shared types
- **Environment Variables**: Database connections and API keys managed securely
- **Build Process**: Separate client and server builds with optimized outputs
- **Static Asset Serving**: Vite handles client assets, Express serves API