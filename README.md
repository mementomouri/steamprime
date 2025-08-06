# SteamPrime - Mobile Tiger Price List

A modern, responsive web application for managing and displaying mobile device prices with real-time updates and an intuitive admin panel.

## 🌟 Features

### User Interface
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **Dark/Light Theme**: Toggle between themes with smooth transitions
- **Real-time Search**: Instant search through products and categories
- **Modern UI**: Beautiful gradient designs and smooth animations
- **Persian/Farsi Support**: Full RTL support for Persian language

### Product Management
- **Dynamic Categories**: Organize products by brand (Apple, Samsung, PlayStation, etc.)
- **Price Tracking**: Real-time price updates with history
- **Product Details**: Comprehensive product information and specifications
- **Stock Management**: Track product availability

### Admin Panel
- **Secure Authentication**: Protected admin routes with NextAuth.js
- **Product Management**: Add, edit, and organize products
- **Category Management**: Create and manage product categories
- **Price Management**: Update prices with precision
- **Drag & Drop**: Reorder products and categories easily
- **Real-time Updates**: Changes reflect immediately

### Technical Features
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety
- **Prisma ORM**: Type-safe database operations
- **PostgreSQL**: Robust database backend
- **Tailwind CSS**: Utility-first styling
- **ESLint**: Code quality and consistency

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/steamprime.git
   cd steamprime
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/price_list_db"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

5. **Create Admin User**
   ```bash
   node scripts/create-admin.js
   ```

6. **Run Development Server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
steamprime/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin panel pages
│   │   ├── api/               # API routes
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── admin/            # Admin-specific components
│   │   └── ui/               # UI components
│   └── lib/                  # Utility functions
├── prisma/                   # Database schema and migrations
├── public/                   # Static assets
└── scripts/                  # Utility scripts
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio for database management

## 🗄️ Database Schema

### Categories
- `id`: Unique identifier
- `name`: Category name
- `position`: Display order
- `isActive`: Active status

### Products
- `id`: Unique identifier
- `name`: Product name
- `description`: Product description
- `categoryId`: Foreign key to category
- `position`: Display order
- `isActive`: Active status

### Prices
- `id`: Unique identifier
- `productId`: Foreign key to product
- `amount`: Price amount (Decimal)
- `createdAt`: Timestamp

## 🔐 Authentication

The admin panel uses NextAuth.js for secure authentication. Admin users can:
- Access protected routes
- Manage products and categories
- Update prices
- View analytics

## 🎨 Customization

### Themes
The application supports both light and dark themes. Theme preferences are stored in localStorage.

### Styling
Built with Tailwind CSS for easy customization. Main color scheme:
- Primary: Green (#10B981)
- Secondary: Blue (#3B82F6)
- Accent: Purple (#8B5CF6)

### Components
All UI components are located in `src/components/ui/` and can be customized as needed.

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Secret key for authentication
- `NEXTAUTH_URL`: Application URL

### Database Configuration
The application uses Prisma with PostgreSQL. Database migrations are automatically applied during build.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **سید مهراد سیدعلیخانی** - Project Manager & Developer
- **Mobile Tiger** - Company

## 📞 Contact

- **Phone**: 0912-493-61-46, 0912-124-04-65
- **WhatsApp**: [Mobile Tiger](https://wa.me/989124936146)
- **Telegram**: [@mehrad_tiger](https://t.me/mehrad_tiger)
- **Instagram**: [@mobile.tiger](https://instagram.com/mobile.tiger)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
- All contributors and supporters

---

**Made with ❤️ by Mobile Tiger Team**
