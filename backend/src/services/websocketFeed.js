import WebSocket from 'ws';

export const connectToLiveMarketFeed = (ioServerBroadcast) => {
  // Connect to a public commodity or financial exchange WebSocket feed
  const ws = new WebSocket('wss://stream.commodity-exchange-provider.com/ws');

  ws.on('open', () => {
    console.log('Connected to live exchange WebSocket stream');
    // Subscribe to market channels
    ws.send(JSON.stringify({ action: 'subscribe', channel: 'agricultural-prices' }));
  });

  ws.on('message', (data) => {
    const liveTick = JSON.parse(data.toString());
    // Broadcast live tick directly to connected frontend clients
    ioServerBroadcast('priceUpdate', liveTick);
  });

  ws.on('error', (err) => {
    console.error('WebSocket feed error:', err);
  });
};