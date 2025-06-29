# Personal CRM with Multi-Platform Social Media Automation

A comprehensive Personal CRM system with advanced social media management, AI content generation, and multi-platform automation capabilities.

## 🚀 Features

### 📱 Personal CRM
- **Contact Management**: Store and organize personal and professional contacts
- **Interaction Tracking**: Log calls, emails, meetings, and other interactions
- **Analytics Dashboard**: Visualize contact and interaction data
- **Advanced Search & Filtering**: Find contacts and interactions quickly

### 🤖 AI-Powered Social Media Management
- **Multi-Platform Posting**: Instagram, Twitter, LinkedIn, Facebook
- **AI Content Generation**: Create engaging content with multiple brand voices
- **Bible Scholar Voice**: Specialized voice for biblical content with scriptural authority
- **Content Calendar**: Schedule and plan your social media posts
- **Analytics & Reporting**: Track performance across all platforms

### 🌐 Multi-Platform Automation
- **Greta.ai Integration**: Automated posting with error handling
- **Robust Fallback System**: Email notifications when platforms fail
- **Live Testing**: Verify platform connections and posting capabilities
- **Success Reporting**: Detailed reports on posting success rates
- **Error Recovery**: Automatic retries for temporary failures

### 🔧 Advanced Features
- **Platform Authentication**: Secure OAuth integration with all major platforms
- **Content Formatting**: Platform-specific content optimization
- **Media Upload**: Support for images and videos
- **Real-time Monitoring**: Live status updates for all operations
- **Comprehensive Logging**: Track all activity for troubleshooting

## 🛠 Technology Stack

- **Frontend**: React 18, Tailwind CSS, Framer Motion
- **State Management**: React Context API
- **Icons**: React Icons (Feather Icons)
- **Charts**: ECharts for React
- **Date Handling**: date-fns
- **File Upload**: React Dropzone
- **API Integration**: Axios
- **Build Tool**: Vite

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📋 Social Media Platform Setup

### Instagram Business
1. Create a Facebook Developer account
2. Create a Facebook App with Instagram Basic Display
3. Get your Instagram Business Account ID
4. Generate a long-lived access token

### Twitter API v2
1. Apply for Twitter Developer account
2. Create a Twitter App
3. Generate Bearer Token and Access Tokens
4. Enable read and write permissions

### LinkedIn
1. Create a LinkedIn Developer account
2. Create a LinkedIn App
3. Add r_liteprofile and w_member_social permissions
4. Get your personal profile and company page IDs

### Facebook Pages
1. Use Facebook Developer account
2. Create a Facebook App with Pages permissions
3. Get your Facebook Page ID
4. Generate a Page Access Token

## 🤖 Greta.ai Integration

### Setup Instructions

1. **Import Workflow**
   - Copy the workflow configuration from `src/services/gretaWorkflow.js`
   - In Greta.ai dashboard, create new workflow
   - Import the JSON configuration

2. **Configure Environment Variables**
   Set these variables in Greta.ai:
   ```
   instagram_access_token
   instagram_business_id
   twitter_bearer_token
   twitter_access_token
   twitter_access_token_secret
   linkedin_access_token
   linkedin_personal_profile
   linkedin_company_page
   facebook_access_token
   facebook_page_id
   admin_email
   ```

3. **Test Integration**
   - Run test suite to verify all connections
   - Check fallback email delivery
   - Verify summary report generation

### Workflow Features

- ✅ **Multi-Platform Posting**: Simultaneous posting to all platforms
- ✅ **Error Handling**: Automatic retries and fallback notifications
- ✅ **Content Formatting**: Platform-specific optimization
- ✅ **Live Testing**: Real-time connection verification
- ✅ **Success Reporting**: Detailed analytics and metrics
- ✅ **Monitoring**: Health checks and performance tracking

## 📖 Bible Scholar Voice

The Bible Scholar voice is designed for ministries and biblical content creators:

### Voice Characteristics
- **Bold, Biblical, Unapologetic**: Speaks with scriptural authority
- **Authoritative**: Uses book, chapter, and verse citations
- **Confrontational**: Exposes false doctrine with love and courage
- **Expository**: Explains Scripture with proper context
- **Evangelistic**: Prioritizes soul-winning over entertainment
- **Unifying in Truth**: Seeks unity only in biblical doctrine

### Content Examples
- Doctrinal teaching with Scripture exposition
- False teaching alerts with biblical refutation
- Gospel obedience calls with verse citations
- Contextual biblical analysis and application

## 🔒 Security & Privacy

- **Local Storage**: All data stored locally in browser
- **No Server Required**: Completely client-side application
- **Secure API Handling**: Tokens stored securely in localStorage
- **Privacy First**: No data collection or tracking

## 📊 Analytics & Reporting

- **Contact Analytics**: Track contact growth and categories
- **Interaction Metrics**: Analyze communication patterns
- **Social Media Performance**: Monitor engagement across platforms
- **Success Rates**: Track posting success and failure rates
- **Platform Health**: Monitor API availability and performance

## 🛠 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure

```
src/
├── components/           # React components
├── pages/               # Page components
├── context/             # State management
├── services/            # API services
├── common/              # Shared utilities
└── assets/              # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the workflow configuration
- Test platform connections
- Verify API credentials

---

**Built with ❤️ for ministry and business social media automation**