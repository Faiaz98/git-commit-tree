// src/services/CollaborationService.js
import io from 'socket.io-client';

class CollaborationService {
    constructor() {
        this.socket = io(process.env.REACT_APP_WEBSOCKET_URL);
    }

    shareVisualization(repositoryUrl, viewState) {
        const shareId = this.generateShareId();
        this.socket.emit('share-visualization', {
            shareId,
            repository: repositoryUrl,
            viewState,
            timestamp: Date.now()
        });
        return shareId;
    }

    joinSharedSession(shareId) {
        this.socket.emit('join-session', shareId);
        return new Promise((resolve) => {
            this.socket.on('session-data', resolve);
        });
    }

    syncCursorPosition(position) {
        this.socket.emit('cursor-move', position);
    }
}