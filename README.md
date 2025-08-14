# Blockchain Supply Chain Management DApp

A comprehensive blockchain-based supply chain management decentralized application (DApp) built with React.js, featuring four distinct user roles and complete supply chain tracking functionality.

## 🚀 Features

### Four User Roles

#### 1. **Supplier/Ministry** (Read & Write)
- Manage inventory and vendor relationships
- Buy from vendors, sell to vendors, or buy from ministry
- View full product history and transactions
- Track supply chain activities
- Monitor vendor performance

#### 2. **Vendor** (Write - Add Products)
- Add new products to inventory
- Sell goods to customers
- View transaction history and customer purchases
- Analytics dashboard with sales trends
- Product management and inventory tracking

#### 3. **Customer** (Read Only)
- Browse and purchase products
- Add items to cart and checkout
- View purchase history
- Live order tracking with real-time status updates
- Product search and filtering

#### 4. **Blockchain Expert** (Read & Write - Admin)
- View all blockchain transactions
- Manage consensus protocol and validation
- Monitor system health and security
- Configure privacy and security settings
- Fault tolerance monitoring and management

## 🛠 Technology Stack

- **Frontend**: React.js 18+ with JSX
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Package Manager**: pnpm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blockchain-supply-chain
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm run dev
   ```

4. **Build for production**
   ```bash
   pnpm run build
   ```

## 🏗 Project Structure

```
blockchain-supply-chain/
├── src/
│   ├── components/
│   │   ├── auth/                 # Authentication components
│   │   │   ├── RoleSelection.jsx
│   │   │   └── WalletConnection.jsx
│   │   ├── charts/               # Chart components
│   │   │   ├── SalesChart.jsx
│   │   │   └── TransactionChart.jsx
│   │   ├── common/               # Shared components
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── Toast.jsx
│   │   ├── dashboards/           # Role-specific dashboards
│   │   │   ├── VendorDashboard.jsx
│   │   │   ├── CustomerDashboard.jsx
│   │   │   ├── SupplierDashboard.jsx
│   │   │   └── BlockchainExpertDashboard.jsx
│   │   ├── products/             # Product management
│   │   │   ├── ProductForm.jsx
│   │   │   └── ProductList.jsx
│   │   ├── orders/               # Order management
│   │   │   └── OrderList.jsx
│   │   ├── blockchain/           # Blockchain components
│   │   │   └── TransactionList.jsx
│   │   ├── tracking/             # Order tracking
│   │   │   └── OrderTracking.jsx
│   │   └── pages/                # Page components
│   │       ├── AddProduct.jsx
│   │       ├── MyProducts.jsx
│   │       ├── Analytics.jsx
│   │       └── TrackOrders.jsx
│   ├── context/                  # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── WalletContext.jsx
│   │   └── DataContext.jsx
│   ├── App.jsx                   # Main application component
│   └── main.jsx                  # Application entry point
├── public/                       # Static assets
├── dist/                         # Production build output
└── package.json                  # Project dependencies
```

## 🎯 Key Features

### Authentication & Wallet Integration
- Role-based access control
- Wallet connection (existing or new wallet creation)
- Secure user authentication flow
- Persistent login state

### Dashboard Analytics
- Real-time metrics and KPIs
- Interactive charts and graphs
- Sales trends and performance analytics
- Transaction history visualization

### Product Management
- Add, edit, and manage products
- Image upload functionality
- Category-based organization
- Inventory tracking

### Order Management
- Shopping cart functionality
- Order placement and tracking
- Live status updates
- Purchase history

### Blockchain Integration
- Mock blockchain simulation
- Transaction validation
- Consensus protocol management
- Security and fault tolerance monitoring

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Interface**: Clean, professional design with consistent styling
- **Interactive Elements**: Hover states, animations, and transitions
- **Loading States**: Spinners and skeleton loaders for better UX
- **Toast Notifications**: User feedback for actions and errors
- **Accessibility**: ARIA labels and keyboard navigation support

## 🔧 Configuration

### Environment Variables
The application uses mock data for demonstration purposes. In a production environment, you would configure:

- Blockchain network endpoints
- API keys for external services
- Database connections
- Authentication providers

### Customization
- **Colors**: Modify Tailwind CSS configuration for brand colors
- **Components**: Extend or customize existing components
- **Data**: Replace mock data with real blockchain integration
- **Features**: Add additional role-specific functionality

## 🚀 Deployment

The application is ready for deployment to various platforms:

- **Vercel**: `vercel --prod`
- **Netlify**: Deploy the `dist/` folder
- **AWS S3**: Upload build files to S3 bucket
- **GitHub Pages**: Use GitHub Actions for automated deployment

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Security Features

- Role-based access control
- Encrypted wallet information
- Secure transaction validation
- Privacy settings management
- Fault tolerance monitoring

## 🧪 Testing

The application has been thoroughly tested for:
- All user role functionalities
- Form validations and error handling
- Responsive design across devices
- Navigation and routing
- Data persistence and state management

## 📈 Performance

- **Build Size**: ~879KB JavaScript, ~96KB CSS
- **Load Time**: Optimized for fast initial load
- **Code Splitting**: Ready for dynamic imports
- **Caching**: Browser caching for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React.js and Vite
- UI components from shadcn/ui
- Icons from Lucide React
- Charts powered by Recharts
- Styled with Tailwind CSS

---

**Note**: This is a demonstration application with mock blockchain functionality. For production use, integrate with actual blockchain networks and implement proper security measures.

