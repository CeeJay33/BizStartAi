// api/proxy.js
import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express';

const app = express();

// Change this to your Python backend IP and port
const BACKEND_URL = 'http://104.236.237.164:8080';

app.use(
  '/api', // Requests to /api/* on Vercel
  createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '', // Remove /api prefix
    },
  })
);

export default app;
