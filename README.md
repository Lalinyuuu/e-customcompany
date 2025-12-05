# E-Customs Company Management

A modern Next.js application for managing company information for customs operations. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Features

- 🏢 **Company Management**: Create, read, update, and delete company records
- 🌐 **Internationalization**: Full support for Thai and English languages
- 🤖 **AI-Powered Auto-Fill**: Automatically fill company addresses using AI (Google Gemini)
- 📍 **Address Search**: Real-time Thai address search by zipcode
- 🔍 **Advanced Search & Filtering**: Search companies by name, tax ID, province, etc.
- 📊 **Data Export**: Export company data to CSV format
- 🎨 **Modern UI**: Beautiful, responsive design with dark mode support
- ✅ **Form Validation**: Comprehensive client-side validation with Thai Tax ID checksum
- 🔒 **Security**: Input sanitization, rate limiting, and error handling

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Internationalization**: next-intl
- **Form Validation**: Custom validators with Thai Tax ID checksum validation
- **Testing**: Jest + React Testing Library
- **AI Integration**: Google Gemini API

## Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone git@github.com:Lalinyuuu/e-customcompany.git
cd e-customs-company
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` or `.env` file in the root directory (see `.env.example`):

```env
# Optional: For AI address auto-fill feature
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Logging level (debug, info, warn, error)
LOG_LEVEL=info
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [locale]/          # Internationalized routes
│   │   ├── companies/     # Company management pages
│   │   └── dashboard/     # Dashboard page
│   └── api/               # API routes
│       ├── companies/     # Company CRUD endpoints
│       ├── ai-address/    # AI address generation
│       └── thai-address/  # Thai address search
├── components/            # React components
│   ├── company/          # Company-related components
│   │   ├── hooks/        # Custom hooks
│   │   └── *.tsx         # Component files
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
│   ├── api/              # API utilities (axios instance)
│   ├── errors/           # Error handling
│   ├── security/         # Security utilities (rate limiting)
│   ├── validators/       # Form validators
│   └── utils.ts          # General utilities
├── services/             # Service layer for API calls
├── types/                # TypeScript type definitions
├── constants/            # Application constants
└── config/               # Configuration files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run type-check` - Type check without emitting files

## Environment Variables

| Variable         | Description                                    | Required | Default     |
| ---------------- | ---------------------------------------------- | -------- | ----------- |
| `GEMINI_API_KEY` | Google Gemini API key for AI address auto-fill | No       | -           |
| `LOG_LEVEL`      | Logging level (debug, info, warn, error)       | No       | info        |
| `NODE_ENV`       | Environment (development, production)          | No       | development |

## API Endpoints

### Companies

- `GET /api/companies` - Get all companies (supports `?q=query` for search)
- `GET /api/companies/[id]` - Get company by ID
- `POST /api/companies` - Create new company
- `PUT /api/companies/[id]` - Update company
- `DELETE /api/companies/[id]` - Delete company
- `GET /api/companies/export?format=csv` - Export companies to CSV

### Address

- `GET /api/thai-address?zipcode=12345&partial=true` - Search Thai addresses by zipcode
- `POST /api/ai-address` - Generate address using AI (requires `companyName` in body)

## Features in Detail

### Company Form

The company form includes:

- Basic company information (name, tax ID, customer code)
- Address information with auto-complete
- Contact information
- Settings and permissions
- Additional information (BOI, AEO references)
- Other information (tax incentives, rubber registration, etc.)

### Validation

- **Thai Tax ID**: Validates 13-digit tax ID with checksum algorithm
- **Phone Numbers**: Validates Thai phone number formats
- **Email**: Standard email validation
- **Zip Code**: 5-digit Thai zip code validation
- **Real-time Validation**: Fields are validated as user types with debouncing

### Security

- Input sanitization on all API endpoints
- Rate limiting (100 requests/15min for general API, 50/min for address search, 20/min for AI)
- Error handling with proper error responses
- XSS protection through input sanitization

## Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow ESLint rules
- Use functional components with hooks
- Prefer named exports over default exports for components
- Use the logger utility instead of console.log

### Adding New Features

1. Create components in `src/components/`
2. Add API routes in `src/app/api/`
3. Add services in `src/services/` for API calls
4. Add validators in `src/lib/validators/` for form validation
5. Add translations in `messages/` for i18n support

### Testing

- Write tests for validators and hooks
- Test components with React Testing Library
- Run tests before committing: `npm run test`

## Internationalization

The application supports multiple languages:

- Thai (th)
- English (en)

Translations are stored in `messages/` directory. To add a new language:

1. Create a new JSON file in `messages/`
2. Add the locale to `src/i18n/routing.ts`
3. Add translations for all keys

## Performance Optimizations

- React.memo for expensive components
- useMemo and useCallback for expensive computations
- Code splitting with Next.js dynamic imports
- React Query for efficient data fetching and caching

## Error Handling

- Centralized error handling with custom error classes
- Structured logging with different log levels
- User-friendly error messages
- Error boundaries for React components

## License

This project is private and proprietary.
