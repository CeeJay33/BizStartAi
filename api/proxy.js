// api/proxy.js
import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express';
import serverless from 'serverless-http';

const app = express();

// Your Python backend
const BACKEND_URL = 'http://104.236.237.164:8080';

// Forward everything under /api/*
app.use(
  '/api',
  createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '', // Remove /api prefix before sending to backend
    },
  })
);

// Export as serverless function
export const handler = serverless(app);
