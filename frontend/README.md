# CallbackListener Frontend

A modern React-based dashboard built with Next.js 15, TypeScript, and Tailwind CSS for managing and monitoring webhook endpoints in real-time.

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **npm, yarn, or pnpm** - Package manager
- **Docker Desktop** (optional) - [Install Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hectorleondev/callback-listener.git
   cd callback-listener/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Or use Docker:**
   ```bash
   docker compose up -d
   ```

The application will be available at `http://localhost:3000`

### Quick Verification

```bash
# Health check
curl http://localhost:3000/api/health

# Open dashboard
open http://localhost:3000
```

## 📋 Features

### Core Functionality
- **📊 Real-time Dashboard**: Live webhook statistics and metrics
- **🎣 Webhook Management**: Create, view, and delete webhook endpoints
- **📝 Request Monitoring**: View captured requests with detailed information
- **🔍 Advanced Filtering**: Search and filter requests by method, content, time
- **📱 Responsive Design**: Mobile-first design that works on all devices
- **⚡ Real-time Updates**: Live updates without page refresh
- **🎨 Modern UI**: Clean, intuitive interface with dark/light themes

### Advanced Features
- **💾 Request Details**: Full request inspection with formatted JSON
- **📊 Analytics Dashboard**: Visual charts and statistics
- **🔗 Deep Linking**: Direct links to specific webhooks and requests
- **⚙️ Settings Management**: Customizable dashboard preferences
- **📋 Copy Functionality**: One-click copying of URLs and data
- **🔄 Auto-refresh**: Configurable auto-refresh intervals
- **📱 Progressive Web App**: Install as mobile/desktop app

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15.2 with App Router
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 3.4 with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: React hooks with custom stores
- **HTTP Client**: Native fetch with error handling
- **Build Tool**: Turbopack for fast development
- **Container**: Docker with multi-stage builds

### Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles and Tailwind imports
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Dashboard home page
│   ├── webhooks/                # Webhook management pages
│   │   ├── page.tsx            # Webhook list page
│   │   └── [pathId]/           # Dynamic webhook details
│   │       └── page.tsx        # Individual webhook page
│   └── api/                     # API routes (health checks)
│       └── health/
│           └── route.ts         # Health check endpoint
├── components/                   # Reusable UI components
│   ├── ui/                      # Base UI components (buttons, inputs, etc.)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── layouts/                 # Layout components
│       └── AppLayout.tsx        # Main application layout
├── features/                     # Feature-based modules
│   ├── common/                  # Shared feature components
│   │   ├── ui/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   └── hooks/
│   │       └── useApi.ts
│   ├── webhooks/                # Webhook management features
│   │   ├── ui/
│   │   │   ├── CreateWebhookForm.tsx
│   │   │   ├── WebhookList.tsx
│   │   │   └── WebhookCard.tsx
│   │   ├── hooks/
│   │   │   ├── useWebhooks.ts
│   │   │   └── useWebhookOperations.ts
│   │   └── types/
│   │       └── webhook.types.ts
│   └── requests/                # Request monitoring features
│       ├── ui/
│       │   ├── RequestsTable.tsx
│       │   ├── RequestDetailsModal.tsx
│       │   └── WebhookLogsManager.tsx
│       ├── hooks/
│       │   └── useRequests.ts
│       └── types/
│           └── request.types.ts
├── lib/                         # Utility libraries
│   ├── utils/                   # Helper functions
│   │   ├── cn.ts               # Class name utility
│   │   ├── formatters.ts       # Data formatting utilities
│   │   └── api.ts              # API client configuration
│   ├── stores/                  # State management
│   │   └── uiStore.ts          # UI state store
│   ├── hooks/                   # Global custom hooks
│   │   ├── useLocalStorage.ts
│   │   └── useTheme.ts
│   └── providers/               # React providers
│       └── AppProviders.tsx     # Combined app providers
├── types/                       # Global TypeScript types
│   ├── api.types.ts            # API response types
│   └── global.types.ts         # Global type definitions
├── public/                      # Static assets
│   ├── favicon.ico
│   └── icons/
├── docker-compose.yml           # Development environment
├── Dockerfile                   # Production container
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 🎨 UI Components

### Design System

The application uses a custom design system built on top of Tailwind CSS and Radix UI:

#### Color Palette
```css
/* Light theme */
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--primary: 222.2 47.4% 11.2%;
--secondary: 210 40% 96%;

/* Dark theme */
--background: 222.2 84% 4.9%;
--foreground: 210 40% 98%;
--primary: 210 40% 98%;
--secondary: 217.2 32.6% 17.5%;
```

#### Typography
- **Font Family**: Inter (system font fallback)
- **Font Sizes**: Responsive scale from sm to 4xl
- **Font Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

#### Components

##### Base Components
```tsx
// Button variants
<Button variant="default">Primary Action</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Subtle</Button>

// Input components
<Input placeholder="Enter webhook name" />
<Textarea placeholder="Request body..." />
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
</Select>

// Layout components
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

##### Feature Components
```tsx
// Webhook management
<CreateWebhookForm onSuccess={handleSuccess} />
<WebhookList webhooks={webhooks} />
<WebhookCard webhook={webhook} />

// Request monitoring  
<RequestsTable requests={requests} />
<RequestDetailsModal request={request} />
<WebhookLogsManager pathId={pathId} />

// Common UI
<LoadingSpinner size="lg" />
<ErrorBoundary fallback={ErrorFallback} />
```

## 🔧 Configuration

### Environment Variables

Create `.env.local` for local development:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Development settings
NODE_ENV=development
NEXT_PUBLIC_ENVIRONMENT=development

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Optional: Feature flags
NEXT_PUBLIC_ENABLE_REAL_TIME=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};
```

### Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... more colors
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

## 🔌 API Integration

### API Client

The frontend communicates with the backend through a centralized API client:

```typescript
// lib/utils/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Webhook operations
  async getWebhooks() {
    return this.request<WebhookResponse>('/api/paths');
  }

  async createWebhook(data: CreateWebhookRequest) {
    return this.request<WebhookResponse>('/api/paths', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getWebhookRequests(pathId: string, params?: RequestParams) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<RequestsResponse>(`/api/paths/${pathId}/logs?${query}`);
  }

  // Dashboard operations
  async getDashboardStats() {
    return this.request<DashboardStats>('/api/dashboard/stats');
  }
}

export const apiClient = new ApiClient();
```

### Custom Hooks

#### useWebhooks Hook
```typescript
// features/webhooks/hooks/useWebhooks.ts
export function useWebhooks() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWebhooks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getWebhooks();
      setWebhooks(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch webhooks');
    } finally {
      setLoading(false);
    }
  };

  const createWebhook = async (data: CreateWebhookRequest) => {
    try {
      const response = await apiClient.createWebhook(data);
      setWebhooks(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create webhook');
    }
  };

  const deleteWebhook = async (pathId: string) => {
    try {
      await apiClient.deleteWebhook(pathId);
      setWebhooks(prev => prev.filter(w => w.path_id !== pathId));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete webhook');
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  return {
    webhooks,
    loading,
    error,
    refetch: fetchWebhooks,
    createWebhook,
    deleteWebhook,
  };
}
```

#### useRequests Hook
```typescript
// features/requests/hooks/useRequests.ts
export function useRequests(pathId: string, options: RequestOptions = {}) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    limit: options.limit || 50,
    offset: 0,
    total: 0,
    hasMore: false,
  });

  const fetchRequests = async (params?: RequestParams) => {
    try {
      setLoading(true);
      const response = await apiClient.getWebhookRequests(pathId, {
        ...options,
        ...params,
      });
      
      if (params?.offset === 0) {
        setRequests(response.data.requests);
      } else {
        setRequests(prev => [...prev, ...response.data.requests]);
      }
      
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (pagination.hasMore && !loading) {
      fetchRequests({ offset: pagination.offset + pagination.limit });
    }
  };

  useEffect(() => {
    fetchRequests({ offset: 0 });
  }, [pathId]);

  return {
    requests,
    loading,
    error,
    pagination,
    refetch: () => fetchRequests({ offset: 0 }),
    loadMore,
  };
}
```

## 📊 Pages & Features

### Dashboard Page (`/`)

The main dashboard provides an overview of webhook activity:

```tsx
// app/page.tsx
export default function DashboardPage() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">CallbackListener Dashboard</h1>
        
        <StatsGrid stats={stats} />
        <RecentActivity requests={stats.recentRequests} />
        <QuickActions />
      </div>
    </AppLayout>
  );
}
```

#### Features:
- **Statistics Cards**: Total webhooks, requests, active endpoints
- **Recent Activity**: Latest captured requests
- **Quick Actions**: Create webhook, view documentation
- **Auto-refresh**: Optional real-time updates

### Webhooks Page (`/webhooks`)

Webhook management interface:

```tsx
// app/webhooks/page.tsx
export default function WebhooksPage() {
  const { webhooks, loading, error, createWebhook, deleteWebhook } = useWebhooks();
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Webhook Endpoints</h1>
          <Button onClick={() => setShowCreateForm(true)}>
            Create Webhook
          </Button>
        </div>

        {showCreateForm && (
          <CreateWebhookForm
            onSuccess={(webhook) => {
              setShowCreateForm(false);
              // Webhook automatically added to list via hook
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        <WebhookList
          webhooks={webhooks}
          loading={loading}
          error={error}
          onDelete={deleteWebhook}
        />
      </div>
    </AppLayout>
  );
}
```

#### Features:
- **Webhook List**: All created webhook endpoints
- **Create Form**: Simple webhook creation
- **Webhook Cards**: Individual webhook information
- **Actions**: View, copy URL, delete webhooks

### Webhook Details Page (`/webhooks/[pathId]`)

Individual webhook monitoring:

```tsx
// app/webhooks/[pathId]/page.tsx
export default function WebhookDetailsPage({ params }: { params: { pathId: string } }) {
  const { requests, loading, error, loadMore, pagination } = useRequests(params.pathId);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  return (
    <AppLayout>
      <div className="space-y-6">
        <WebhookHeader pathId={params.pathId} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RequestsTable
              requests={requests}
              loading={loading}
              onSelectRequest={setSelectedRequest}
              onLoadMore={pagination.hasMore ? loadMore : undefined}
            />
          </div>
          
          <div>
            <WebhookInfo pathId={params.pathId} />
          </div>
        </div>

        {selectedRequest && (
          <RequestDetailsModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
          />
        )}
      </div>
    </AppLayout>
  );
}
```

#### Features:
- **Request Table**: All captured requests for the webhook
- **Request Details**: Modal with full request information
- **Filtering**: Search and filter requests
- **Pagination**: Load more requests on demand
- **Real-time Updates**: Live request capture

## 🧪 Testing

### Test Setup

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom

# Create jest.config.js
npx create-next-app@latest --typescript --tailwind --eslint
```

### Test Examples

```typescript
// __tests__/components/WebhookCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { WebhookCard } from '@/features/webhooks/ui/WebhookCard';

const mockWebhook = {
  id: '123',
  path_id: 'test-webhook',
  created_at: '2025-06-14T19:44:40.190938',
  request_count: 5,
};

describe('WebhookCard', () => {
  it('renders webhook information', () => {
    render(<WebhookCard webhook={mockWebhook} />);
    
    expect(screen.getByText('test-webhook')).toBeInTheDocument();
    expect(screen.getByText('5 requests')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = jest.fn();
    render(<WebhookCard webhook={mockWebhook} onDelete={onDelete} />);
    
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith('test-webhook');
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test WebhookCard.test.tsx
```

## 🛠️ Development

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check

# Format code with Prettier
npm run format
```

### Code Quality

#### ESLint Configuration
```javascript
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "error"
  }
}
```

#### Prettier Configuration
```javascript
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Git Hooks

```bash
# Install husky for git hooks
npm install --save-dev husky lint-staged

# Set up pre-commit hook
npx husky init
echo "npx lint-staged" > .husky/pre-commit
```

```javascript
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

## 🐳 Docker

### Development Environment

```bash
# Start development environment
docker compose up -d

# View logs
docker compose logs -f

# Rebuild image
docker compose up --build

# Stop services
docker compose down
```

### Production Build

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Build
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-http://localhost:5001}
        NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL:-http://localhost:3000}
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:5001}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-http://localhost:3000}
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:3000/api/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - callback-network

networks:
  callback-network:
    driver: bridge
```

## 📱 Progressive Web App

### PWA Configuration

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // Next.js config
});
```

### Manifest

```json
// public/manifest.json
{
  "name": "CallbackListener",
  "short_name": "CallbackListener",
  "description": "Webhook capture and monitoring dashboard",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🔧 Performance Optimization

### Next.js Optimizations

1. **Image Optimization**: Using Next.js Image component
2. **Code Splitting**: Automatic route-based splitting
3. **Tree Shaking**: Unused code elimination
4. **Bundle Analysis**: Webpack bundle analyzer

```bash
# Analyze bundle size
npm run analyze

# Performance metrics
npm run lighthouse
```

### Performance Monitoring

```typescript
// lib/utils/performance.ts
export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics service
    console.log(metric);
  }
}
```

### Loading Strategies

```tsx
// Lazy loading components
const RequestDetailsModal = lazy(() => 
  import('@/features/requests/ui/RequestDetailsModal')
);

// Suspense boundaries
<Suspense fallback={<LoadingSpinner />}>
  <RequestDetailsModal />
</Suspense>
```

## 🚀 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Netlify Deployment

```bash
# Build command
npm run build

# Publish directory
out

# Environment variables
NEXT_PUBLIC_API_URL=https://your-api.com
NEXT_PUBLIC_APP_URL=https://your-app.netlify.app
```

### Self-hosted Deployment

```bash
# Build production
npm run build

# Start production server
npm start

# Or use PM2
pm2 start npm --name "callback-listener-frontend" -- start
```

### Environment Variables

```env
# Production environment
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## 🔐 Security

### Security Headers

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

### Content Security Policy

```javascript
// CSP configuration
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL};
`;
```

## 📚 Documentation

### Storybook Integration

```bash
# Install Storybook
npx storybook@latest init

# Run Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

### Component Documentation

```typescript
// components/ui/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'default',
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
};
```

## 🤝 Contributing

### Development Workflow

1. **Fork and clone the repository**
2. **Create feature branch**: `git checkout -b feature/my-feature`
3. **Install dependencies**: `npm install`
4. **Start development**: `npm run dev`
5. **Make changes with tests**
6. **Run quality checks**: `npm run lint && npm run type-check`
7. **Test your changes**: `npm test`
8. **Commit changes**: Use conventional commit format
9. **Submit pull request**

### Code Standards

- **TypeScript**: Use strict TypeScript configuration
- **React**: Follow React best practices and hooks patterns
- **Styling**: Use Tailwind CSS utility classes
- **Testing**: Write tests for components and utilities
- **Documentation**: Update Storybook stories and README

### Commit Message Format

```
type(scope): description

feat(webhooks): add webhook creation form
fix(ui): resolve button loading state
docs(readme): update API documentation
test(components): add webhook card tests
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🔍 Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check what's using port 3000
lsof -i :3000

# Use different port
PORT=3001 npm run dev
```

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Type checking
npm run type-check
```

#### API Connection Issues
```bash
# Check API URL
echo $NEXT_PUBLIC_API_URL

# Test API connection
curl $NEXT_PUBLIC_API_URL/health/

# Check CORS configuration
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Node.js debugging
NODE_OPTIONS='--inspect' npm run dev
```

### Getting Help

1. **Check Documentation**: This README and Storybook
2. **Search Issues**: Look for similar problems
3. **Create Issue**: Use issue template with details
4. **Contact**: [Create an issue](https://github.com/hectorleondev/callback-listener/issues)

## 📞 Support

For support and questions:

- **GitHub Issues**: [Create an issue](https://github.com/hectorleondev/callback-listener/issues)
- **Documentation**: Check this README and Storybook
- **Community**: Join discussions in GitHub Discussions

## 🎯 Roadmap

### Current Version (v1.0)
- ✅ Modern React dashboard with Next.js 15
- ✅ Real-time webhook monitoring
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript integration
- ✅ Docker support

### Planned Features (v1.1)
- [ ] Real-time WebSocket updates
- [ ] Advanced filtering and search
- [ ] Export functionality
- [ ] Custom themes and branding
- [ ] Mobile app (React Native)

### Future Features (v2.0)
- [ ] Collaborative features
- [ ] Advanced analytics dashboard
- [ ] Integration with external services
- [ ] Custom webhook templates
- [ ] Enterprise features

---

**CallbackListener Frontend** - Built with ❤️ using Next.js, TypeScript, and Tailwind CSS.

For backend documentation, see [../backend/README.md](../backend/README.md)
