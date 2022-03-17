export default [
  {
    path: '/api',
    changeOrigin: true,
    target: 'http://localhost:4001',
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  {
    path: '/socket.io',
    changeOrigin: true,
    target: 'http://localhost:4001',
    headers: { 'Access-Control-Allow-Origin': '*' },
    ws: true, // 支持WebSocket
  },
];
