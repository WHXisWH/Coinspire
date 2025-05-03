# Coinspire Architecture

## Project Overview

Coinspire is a web application designed to empower creators to tokenize and share their original content as tradable digital assets using the Zora Coins Protocol. It combines intuitive UI with AI-driven features to help users launch their own social tokens seamlessly.

The platform analyzes current trends across social media, news, and communities, then provides creators with inspiration and templates to create content that resonates with audiences.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Languages**: TypeScript, JavaScript
- **Styling**: Tailwind CSS
- **State Management**: SWR for data fetching, React Hooks
- **UI Components**: Custom components with Tailwind

### Blockchain Integration
- **Network**: Base Chain (Ethereum L2)
- **SDK**: Zora Coins SDK
- **Wallet Connection**: ConnectKit, wagmi

### AI Services
- **Backend**: Python Flask API
- **NLP**: NLTK, custom analysis algorithms
- **Image Analysis**: Custom pattern recognition

### Storage
- **Media Storage**: IPFS via NFT.Storage
- **Metadata**: IPFS

## System Architecture

The application follows a modern frontend-centric architecture with separate AI services and blockchain integration:

```
┌────────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                        │
│  ┌──────────────┐   ┌──────────────┐   ┌───────────────────┐   │
│  │    Pages     │   │  Components  │   │      Hooks        │   │
│  └──────────────┘   └──────────────┘   └───────────────────┘   │
│  ┌──────────────┐   ┌──────────────┐   ┌───────────────────┐   │
│  │   API Routes │   │    Utils     │   │      Types        │   │
│  └──────────────┘   └──────────────┘   └───────────────────┘   │
└────────────┬───────────────────┬───────────────────────┬───────┘
             │                   │                       │
             ▼                   ▼                       ▼
┌────────────────────┐ ┌─────────────────────┐ ┌────────────────────┐
│    AI Services     │ │   Blockchain/Zora   │ │   IPFS Storage     │
│    (Python/Flask)  │ │     Integration     │ │   (NFT.Storage)    │
└────────────────────┘ └─────────────────────┘ └────────────────────┘
```

## Directory Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── api/              # API routes
│   │   ├── coins/        # Coin-related API endpoints
│   │   ├── ipfs/         # IPFS storage endpoints
│   │   ├── trends/       # Trend analysis endpoints
│   │   └── ...
│   ├── create/           # Creation page
│   ├── dashboard/        # Dashboard page
│   └── ...               # Other pages
├── components/           # React components
│   ├── create/           # Content creation components
│   ├── dashboard/        # Dashboard components
│   ├── layout/           # Layout components (header, footer)
│   ├── providers/        # Context providers
│   ├── ui/               # Reusable UI components
│   └── wallet/           # Wallet connection components
├── hooks/                # Custom React hooks
│   ├── useTrends.ts      # Trend data hooks
│   ├── useZora.ts        # Zora SDK hooks
│   └── ...
├── lib/                  # Core library functions
│   ├── ai.ts             # AI service integration
│   ├── ipfs.ts           # IPFS storage functions
│   ├── zora.ts           # Zora SDK functions
│   └── ...
├── styles/               # Global styles
├── types/                # TypeScript type definitions
└── utils/                # Utility functions

ai/                       # Python AI service
├── analyze/              # Analysis algorithms
├── suggest/              # Suggestion generators
└── app.py                # Flask API server
```

## Core Workflows

### 1. Trend Analysis Flow

```
┌─────────────┐     ┌───────────────┐     ┌────────────────┐
│ User views  │     │ Frontend calls│     │ AI Service     │
│ dashboard   │────▶│ trend API     │────▶│ analyzes data  │
└─────────────┘     └───────────────┘     └────────┬───────┘
                                                   │
┌─────────────┐     ┌───────────────┐     ┌────────▼───────┐
│ Data displayed    │ Frontend      │     │ Results sent   │
│ to user     │◀────│ renders data  │◀────│ to frontend    │
└─────────────┘     └───────────────┘     └────────────────┘
```

1. User visits the dashboard page
2. Frontend fetches trend data from the API endpoint `/api/trends`
3. API routes proxy the request to the AI service
4. AI service processes data and returns analysis
5. Frontend receives and displays trend information
6. If AI service is unavailable, the system falls back to mock data

### 2. Content Creation and Tokenization Flow

```
┌─────────────┐     ┌───────────────┐     ┌────────────────┐
│ User selects│     │ User uploads  │     │ User fills     │
│ template    │────▶│ or creates    │────▶│ coin metadata  │
└─────────────┘     │ content       │     └────────┬───────┘
                    └───────────────┘              │
                                                   ▼
┌─────────────┐     ┌───────────────┐     ┌────────────────┐
│ Coin token  │     │ Zora SDK      │     │ Content stored │
│ created     │◀────│ creates coin  │◀────│ on IPFS via    │
└─────────────┘     └───────────────┘     │ NFT.Storage    │
                                          └────────────────┘
```

1. User selects a template or design inspiration from AI-generated options
2. User uploads or creates content based on template
3. User fills in coin metadata (name, symbol, description)
4. Content is uploaded to IPFS via NFT.Storage
5. Metadata JSON with IPFS links is created and uploaded to IPFS
6. Zora SDK is used to create a new coin with the IPFS metadata URI
7. Blockchain transaction is processed
8. User is shown transaction status and success confirmation

### 3. AI Recommendation Flow

```
┌─────────────┐     ┌───────────────┐     ┌────────────────┐
│ User visits │     │ Frontend sends│     │ AI service     │
│ creation page│───▶│ trend keywords│────▶│ processes      │
└─────────────┘     └───────────────┘     └────────┬───────┘
                                                   │
┌─────────────┐     ┌───────────────┐     ┌────────▼───────┐
│ User selects│     │ Templates     │     │ AI returns     │
│ from results│◀────│ displayed     │◀────│ templates &    │
└─────────────┘     └───────────────┘     │ suggestions    │
                                          └────────────────┘
```

1. User visits the content creation page
2. Frontend sends current trend keywords to the recommendation API
3. AI service generates templates and creative suggestions
4. Frontend displays template options to the user
5. User selects a template to use as a starting point

## Integration Points

### Zora Coins Protocol Integration

The application integrates with Zora's Coins Protocol through:

1. **Coins SDK**: Uses `@zoralabs/coins-sdk` for all blockchain interactions
2. **Creation**: Uses `createCoin` function to tokenize content
3. **Trading**: Integrates `tradeCoin` functionality for coin trading
4. **Querying**: Uses Zora's API for trending and new coins

### AI Service Integration

The AI service is a separate Python Flask application that provides:

1. **Trend Analysis**: Processes data to identify trends
2. **Recommendation Engine**: Suggests templates and creative directions
3. **Content Analysis**: Analyzes images and text

### IPFS Storage Integration

IPFS storage is handled through NFT.Storage:

1. **Media Storage**: Uploads content files to IPFS
2. **Metadata Storage**: Creates and uploads metadata JSON
3. **URI Management**: Converts IPFS CIDs to URIs for Zora SDK

## Feature Implementation Details

### Trend Analysis Dashboard

- Uses SWR for data fetching with caching and revalidation
- Displays keyword clouds, theme rankings, and color palettes
- Shows trending coins from Zora's protocol
- Visualizes data with Recharts for charts and custom components

### Content Creation

- Template gallery with AI-recommended designs
- Content upload and preview functionality
- Metadata form with validation
- Integration with wallet connection for blockchain transactions
- Transaction status monitoring and confirmation

### Wallet Integration

- Uses ConnectKit for user-friendly wallet connection
- Integrates wagmi for React hooks to interact with Base chain
- Handles transaction signing and confirmation

## Error Handling and Fallbacks

The application implements several fallback mechanisms:

1. **AI Service Unavailability**: Falls back to static mock data
2. **Network Issues**: Implements retry logic for API calls
3. **Transaction Failures**: Provides clear error messages and recovery options
4. **IPFS Connectivity**: Handles upload failures with retry functionality

## Environment Configuration

The application uses environment variables for configuration:

- API endpoints and keys
- Blockchain RPC URLs
- Feature flags for testing and development
- IPFS gateway configuration

## Future Architecture Extensions

The architecture is designed to allow for these planned extensions:

1. **User Authentication**: Integration of user profiles and authentication
2. **Analytics Dashboard**: Enhanced analytics for creators
3. **Advanced AI Features**: More sophisticated trend prediction
4. **Mobile Application**: Mobile-specific features and optimizations
5. **Social Integration**: Direct integration with social platforms

## Development and Deployment Workflow

```
Local Development → Staging Deployment → Production Deployment
     │                    │                     │
     ▼                    ▼                     ▼
   Testing            Integration           Monitoring
     │                    │                     │
     └────────────────────┴─────────────────────┘
                  ▼
           Continuous Improvement
```

The development workflow follows a modern CI/CD approach with:

1. Local development with mock data
2. Testing with actual services
3. Staging deployment for integration testing
4. Production deployment with monitoring
5. Continuous improvement based on feedback and metrics

## Conclusion

Coinspire's architecture combines modern web technologies with blockchain integration and AI services to create a powerful platform for creators. The modular design allows for independent development of different system components while maintaining tight integration through well-defined interfaces.
