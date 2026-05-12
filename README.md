# Portfolio Website - React Version

This is a fully responsive portfolio website built with **React.js**, converted from the original HTML/CSS/JS version.

## Features

- **Responsive Design** - Works perfectly on all devices
- **Modern UI/UX** - Clean, professional design with smooth animations
- **React Components** - Modular, reusable component architecture
- **Contact Form** - Working contact form with FormSubmit integration
- **Smooth Scrolling** - Enhanced user experience with smooth navigation
- **SEO Optimized** - Meta tags and semantic HTML

## Tech Stack

- **React.js** - Frontend framework
- **CSS3** - Styling with modern CSS features
- **Font Awesome** - Icons
- **FormSubmit** - Contact form backend

## Project Structure

```
react-portfolio/
├── public/
│   ├── assets/              # Images and media files
│   └── index.html           # HTML template
├── src/
│   ├── components/          # React components
│   │   ├── Navbar.js
│   │   ├── Hero.js
│   │   ├── About.js
│   │   ├── Skills.js
│   │   ├── Projects.js
│   │   ├── Testimonials.js
│   │   ├── Contact.js
│   │   └── Footer.js
│   ├── App.js               # Main App component
│   ├── App.css              # Main styles
│   ├── index.js             # React entry point
│   └── index.css            # Global styles
├── package.json             # Dependencies
└── README.md                # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Navigate to the project directory:**
   ```bash
   cd react-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   The app will automatically open at `http://localhost:3000`

## Building for Production

To create an optimized production build:

```bash
npm run build
```

This will create a `build` folder with optimized files ready for deployment.

## Deployment

### Deploy to GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/portfolio",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag the `build` folder to Netlify
3. Done!

### Deploy to Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow the prompts

## Contact Form Setup

The contact form uses FormSubmit. To activate it:

1. Fill out the form once with any test data
2. Check your email (connect@arjusingh.com) for activation link
3. Click the activation link
4. Form is now active!

## Customization

### Update Personal Information

Edit the following files:
- `src/components/Hero.js` - Name, titles, social links
- `src/components/About.js` - About text, stats
- `src/components/Skills.js` - Skills and tools
- `src/components/Projects.js` - Project details
- `src/components/Contact.js` - Contact email

### Change Colors

Edit `src/App.css` and update the CSS variables at the top:
```css
:root {
    --primary: #6366f1;
    --accent: #8b5cf6;
    /* ... other variables */
}
```

### Add/Remove Sections

Edit `src/App.js` to add or remove components from the main layout.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Runs tests
- `npm run eject` - Ejects from Create React App (one-way operation)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License.

## Author

**Arju Singh**
- Email: connect@arjusingh.com
- LinkedIn: [Arju Singh](https://www.linkedin.com/in/arju-singh-0ab697228/)
- GitHub: [@deadxolo](https://github.com/deadxolo)

---

Made with ❤️ using React.js
# Portfolio
# Portfolio
# port-slide
