# Contact Form with reCAPTCHA v3

A modern, accessible contact form built with Node.js, Express, and reCAPTCHA v3. Features responsive design, real-time validation, and seamless deployment on Render.

## Features

- **Responsive Design**: Works on desktop and mobile with a clean, turquoise-themed UI.
- **Accessibility**: WCAG 2.1 AA compliant with ARIA labels, keyboard navigation, and high contrast.
- **reCAPTCHA v3**: Invisible verification for better UX, integrated with Google reCAPTCHA.
- **Real-time Validation**: Client-side validation with user-friendly error messages.
- **Backend API**: Express server validates reCAPTCHA tokens and processes form data.
- **Docker Support**: Containerized for easy deployment.

## Project Structure

```
form/
├── public/
│   ├── index.html        # Main HTML file with form
│   ├── styles.css       # Turquoise-themed CSS styles
│   └── form.js          # Client-side validation and reCAPTCHA logic
├── .env                 # Environment variables (RECAPTCHA_SECRET)
├── .gitignore           # Git ignore rules
├── .dockerignore        # Docker ignore rules
├── Dockerfile           # Multi-stage Docker build
├── server.js            # Express server with reCAPTCHA validation
├── package.json         # Dependencies and scripts
├── .github/workflows/docker.yml  # CI/CD workflow
└── README.md            # This file
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm
- Docker (optional, for containerized run)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd form
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env` and update `RECAPTCHA_SECRET` with your Google reCAPTCHA secret key.

### Running Locally

1. Start the server:
   ```
   npm start
   # or
   node server.js
   ```

2. Open `http://localhost:3000` in your browser.

### Docker

1. Build the image:
   ```
   docker build -t contact-form .
   ```

2. Run the container:
   ```
   docker run -p 3000:3000 contact-form
   ```

## Deployment

### Render

1. Push code to GitHub.
2. Connect repo to Render.
3. Create a Web Service, select Docker.
4. Add environment variable: `RECAPTCHA_SECRET=your_secret_key`.
5. Deploy.

The app will be live at `https://your-app.onrender.com`.

## Configuration

- **reCAPTCHA Keys**: Get from [Google reCAPTCHA](https://www.google.com/recaptcha/admin). Update site key in `index.html` and secret in `.env` or Render env vars.
- **Colors**: Customize in `styles.css` (turquoise theme: #00bcd4).

## API Endpoints

- `POST /verify-recaptcha`: Validates form data and reCAPTCHA token. Returns JSON success/error.

## Contributing

1. Fork the repo.
2. Create a feature branch.
3. Commit changes with conventional commits.
4. Push and create PR.

## License

MIT License.