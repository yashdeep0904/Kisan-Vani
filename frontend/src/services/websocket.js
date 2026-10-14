class WebSocketClient {
    constructor() {
      this.socket = null;
      this.statusListeners = [];
      this.audioQueue = [];
      this.isPlaying = false;
    }
  
    connect(url = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/api/voice') {
      if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
        return;
      }
  
      this.notifyListeners('connecting');
      this.socket = new WebSocket(url);
  
      this.socket.onopen = () => {
        console.log('Voice Agent WebSocket Connected');
        this.notifyListeners('connected');
      };
  
      this.socket.onmessage = async (event) => {
        // Handles receiving the streamed audio output natively from the multimodal model[cite: 1]
        if (event.data instanceof Blob) {
          this.playAudioBlob(event.data);
        }
      };
  
      this.socket.onclose = () => {
        console.log('Voice Agent WebSocket Disconnected');
        this.notifyListeners('disconnected');
      };
  
      this.socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
        this.notifyListeners('error');
      };
    }
  
    sendAudioChunk(blob) {
      if (this.isConnected()) {
        this.socket.send(blob);
      }
    }
  
    playAudioBlob(blob) {
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      
      audio.onended = () => {
        URL.revokeObjectURL(url);
      };
      
      audio.play().catch(e => console.error("Audio play error:", e));
    }
  
    isConnected() {
      return this.socket && this.socket.readyState === WebSocket.OPEN;
    }
  
    disconnect() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    }
  
    onStatusChange(callback) {
      this.statusListeners.push(callback);
    }
  
    notifyListeners(status) {
      this.statusListeners.forEach(listener => listener(status));
    }
  }
  
  export const wsClient = new WebSocketClient();