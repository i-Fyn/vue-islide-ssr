import fs from 'node:fs/promises';
import express from 'express';
import { transformHtmlTemplate } from '@unhead/vue/server';
import CryptoJS from 'crypto-js'
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import { createLogger, format, transports } from 'winston';
import { Buffer } from 'node:buffer';
import zlib from 'node:zlib';
import { getSocket, initSocket } from './websocket.js';




// 配置日志
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple()
  }));
}

// 环境变量配置
try {
  if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: '.env.development' });
  } else if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: '.env.test' });
  } else {
    dotenv.config({ path: '.env.production' });
  }
} catch (error) {
  logger.error('环境变量加载失败:', error);
  process.exit(1);
}

const SECRET_KEY = process.env.VITE_STORAGE_SECRET;
const baseURL = process.env.VITE_BASE_URL;

if (!SECRET_KEY || !baseURL) {
  logger.error('缺少必要的环境变量');
  process.exit(1);
}

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5170;
const base = process.env.BASE || '/';

// 创建 Express 应用
const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(helmet({
  crossOriginEmbedderPolicy: false, // ✅ 禁用 COEP 头
  crossOriginOpenerPolicy: false,
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false,
  dnsPrefetchControl: true,
  frameguard: true,
  hidePoweredBy: true,
  hsts: isProduction,
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: true,
  xssFilter: true
}));
// 请求限制
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15分钟
  max: 1000, // 限制每个IP 15分钟内最多100个请求
  message: '请求过于频繁，请稍后再试'
});
app.use(limiter);

// 压缩
app.use(compression());

// 日志中间件
app.use(morgan('combined', {
  stream: {
    write: message => logger.info(message.trim())
  }
}));

// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error('未捕获的错误:', err);
  res.status(500).json({
    error: isProduction ? '服务器内部错误' : err.message
  });
});

// 缓存生产环境资源
let templateHtml;
try {
  templateHtml = isProduction
    ? await fs.readFile('./dist/client/index.html', 'utf-8')
    : '';
} catch (error) {
  logger.error('模板文件读取失败:', error);
  process.exit(1);
}

// 开发环境配置
let vite;
if (!isProduction) {
  try {
    const { createServer } = await import('vite');
    vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
      base,
    });
    app.use(vite.middlewares);
  } catch (error) {
    logger.error('Vite 服务器创建失败:', error);
    process.exit(1);
  }
} else {
  const sirv = (await import('sirv')).default;
  app.use(base, sirv('./dist/client', {
    extensions: [],
    dev: false,
    etag: true,
    maxAge: 31536000 // 1年
  }));
}

// API 代理配置

const proxyOptions = {
  target: baseURL,
  changeOrigin: true,
  secure: false,
  selfHandleResponse: true, // 必须手动处理响应体
  pathRewrite: (path) => {
    let rewritten;
    if (path == '/token') {
      rewritten = `/wp-json/jwt-auth/v1/token`;
    } else {
      rewritten = `/wp-json/islide/v1${path}`;
    }
    logger.info(`[Proxy Rewrite] ${path} → ${rewritten}`);
    return rewritten;
  },
  on: {
    proxyReq: async (proxyReq, req, res) => {

      // 记录请求开始时间
      req._startAt = process.hrtime();

      logger.info(`[Proxy Request] ${req.method} ${req.url}`);
      logger.debug(`[Proxy Headers] ${JSON.stringify(req.headers, null, 2)}`);

      if (req.headers.cookie) {
        proxyReq.setHeader('cookie', req.headers.cookie);
      }
      if (req.headers.authorization) {
        proxyReq.setHeader('authorization', req.headers.authorization);
      }
    },

    proxyRes: async (proxyRes, req, res) => {
      const chunks = [];

      proxyRes.on('data', chunk => chunks.push(chunk));

      proxyRes.on('end', () => {
        const encoding = proxyRes.headers['content-encoding'];
        const rawBuffer = Buffer.concat(chunks);
        const duration = process.hrtime(req._startAt);
        const ms = (duration[0] * 1e3 + duration[1] / 1e6).toFixed(2);

        const decompress = (buffer, cb) => {
          if (encoding === 'gzip') {
            zlib.gunzip(buffer, cb);
          } else if (encoding === 'deflate') {
            zlib.inflate(buffer, cb);
          } else if (encoding === 'br') {
            zlib.brotliDecompress(buffer, cb);
          } else {
            cb(null, buffer); // 无压缩
          }
        };

        decompress(rawBuffer, (err, decoded) => {
          if (err) {
            logger.error(`[Decompression Failed] ${err.message}`);
            res.statusCode = 500;
            return res.end('解压失败');
          }

          const body = decoded.toString('utf-8');
          const statusCode = proxyRes.statusCode;

          logger.info(`[Proxy Response] ${req.method} ${req.url} → ${statusCode} (${ms}ms)`);
          logger.debug(`[Proxy Response Headers] ${JSON.stringify(proxyRes.headers, null, 2)}`);

          try {
            const json = JSON.parse(body);
            if (req.url.includes('/sendMessage')) {
              const socket = getSocket();
              if (socket) {
                // 获取接收者ID
                const receiverId = json.to?.id;
                console.log('发送消息到', receiverId, json)
                if (receiverId) {
                  // 广播给指定用户
                  socket.to(Number(receiverId)).emit('newMessage', {
                    ...json,
                    is_read: false // 确保新消息初始状态为未读
                  });
                  console.log('发送消息成功', receiverId, json)
                  logger.info(`[Socket Emit] newMessage 已广播给用户 ${receiverId}`);
                } else {
                  logger.warn('[Socket Emit] newMessage 广播失败：未找到接收者ID');
                }
              }
            }
            logger.debug(`[Proxy Response Body] ${JSON.stringify(json, null, 2)}`);
            res.statusCode = statusCode;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(json));
          } catch (err) {
            logger.warn(`[Proxy Response Not JSON]`, body.slice(0, 200));
            res.statusCode = statusCode;
            res.end(body);
          }
        });
      });
    },

    error: (err, req, res) => {
      logger.error(`[Proxy Error] ${req.method} ${req.url} - ${err.message}`);
      res.status(500).json({
        error: isProduction ? '服务器内部错误' : err.message
      });
    }
  }
};

app.use('/api', createProxyMiddleware(proxyOptions));


const secureImgProxy = createProxyMiddleware({
  target: baseURL,
  changeOrigin: true,
  secure: false,
  selfHandleResponse: false, // 不需要手动处理响应流
  on: {
    proxyReq: (proxyReq, req) => {
      // 补充 cookie 和 UA，避免某些图片防盗链
      if (req.headers.cookie) {
        proxyReq.setHeader('cookie', req.headers.cookie);
      }
      proxyReq.setHeader('user-agent', req.headers['user-agent'] || '');
    },
    error: (err, req, res) => {
      console.error('[Proxy Error] secure-img:', err.message);
      res.status(500).send('图片代理失败');
    }
  },
  pathRewrite: (path) => {
    return path.replace('/image', '');
  }
});

app.use('/image', secureImgProxy);


app.post('/api/log-client-error', express.json(), (req, res) => {
  const { message, code, url, time } = req.body;
  logger.error(`[客户端网络错误] ${code} - ${message} @ ${url} (${new Date(time).toISOString()})`);
  res.status(200).send({ status: 'logged' });
});
// 渲染 HTML
app.use('*all', async (req, res, next) => {
  try {
    const url = req.originalUrl.replace(base, '');
    let template;
    let render;

    if (!isProduction) {
      template = await fs.readFile('./index.html', 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('/src/entry-server.js')).render;
    } else {
      template = templateHtml;
      render = (await import('./dist/server/entry-server.js')).render;
    }

    const rendered = await render(url, { req });
    const pinia = rendered.pinia;

    // 加密 Pinia 状态
    const piniaState = CryptoJS.AES.encrypt(
      JSON.stringify(pinia.state.value),
      SECRET_KEY
    ).toString();

    const html = await transformHtmlTemplate(
      rendered.head,
      template
        .replace(`<!--app-html-->`, rendered.html ?? '')
        .replace(`<!--pinia-state-->`, piniaState)
    );

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (error) {
    logger.error('页面渲染错误:', error);
    next(error);
  }
});

// 启动服务器
const server = app.listen(port, () => {
  logger.info(`服务器启动成功: http://localhost:${port}`);
});

// 初始化 WebSocket
initSocket(server);
logger.info('WebSocket 服务器已初始化');

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('收到 SIGTERM 信号，准备关闭服务器');
  server.close(() => {
    logger.info('服务器已关闭');
    process.exit(0);
  });
});

process.on('uncaughtException', (error) => {
  logger.error('未捕获的异常:', error);
  // 给进程一些时间来处理现有的请求
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('未处理的 Promise 拒绝:', reason);
});


