// websocket-instance.js
import { Server } from 'socket.io';
import { createLogger } from 'winston';
import { format } from 'winston';
import { transports } from 'winston';

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

let io = null;

export function initSocket(server) {
  if (!io) {
    try {
      io = new Server(server, {
        cors: { 
          origin: '*',
          methods: ['GET', 'POST']
        },
        pingTimeout: 60000,
        pingInterval: 25000
      });

      io.on('connection', (socket) => {
        console.log(socket.id)
        logger.info(`客户端连接成功: ${socket.id}`);

        // 处理用户加入房间
        socket.on('join', (userId) => {
          socket.join(userId);
          console.log('用户加入房间',userId ,socket.rooms)
          logger.info(`用户 ${userId} 加入房间`);
        });

        // 处理消息已读状态
        socket.on('messageRead', (data) => {
          console.log('收到消息已读状态:', data);
          // 广播给消息发送者
          io.to(data.to).emit('messageRead', {
            message_id: data.message_id,
            from: data.from,
            to: data.to
          });
          logger.info(`消息 ${data.message_id} 已读状态已通知发送者 ${data.from}`);
        });

        socket.on('disconnect', () => {
          console.log('用户断开连接',socket.id)
          logger.info(`客户端断开连接: ${socket.id}`);
        });

        socket.on('error', (error) => {
          console.log('Socket 错误',error)
          logger.error(`Socket 错误: ${socket.id}`, error);
        });
      });

      logger.info('WebSocket 服务器初始化成功');
    } catch (error) {
      logger.error('WebSocket 服务器初始化失败:', error);
      throw error;
    }
  }
  return io;
}

export function getSocket() {
  if (!io) {
    logger.warn('WebSocket 服务器未初始化');
    return null;
  }
  return io;
}