// Import the ElevenLabs client library
import { Conversation } from '@elevenlabs/client';

class ElevenLabsCall {
    constructor(agentId, beginConvoLabel) {
        this.agentId = agentId;
        this.isOpen = false;
        this.stream = null;
        this.conversation = null;
        this.beginConvoLabel = beginConvoLabel;

        this.setupEventListeners();
    }

    async start() {
        try {
            // Request microphone access
            const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.stream = micStream;

            // Start ElevenLabs conversation session
            this.conversation = await Conversation.startSession({
                agentId: this.agentId,
                onConnect: () => {
                    console.log('Connected to agent');
                },
                onDisconnect: () => {
                    console.log('Disconnected from agent');
                    conversationEnded(this.beginConvoLabel);
                },
                onError: (error) => {
                    console.error('Conversation error:', error);
                }
            });

            this.isOpen = true;
            console.log('Call started');
        } catch (error) {
            console.error('Failed to start call:', error);
        }
    }


    async stop() {
        try {
            // End the ElevenLabs conversation
            if (this.conversation) {
                await this.conversation.endSession();
                this.conversation = null;
            }

            // Stop microphone stream
            if (this.stream) {
                this.stream.getTracks().forEach((track) => { track.stop(); });
                this.stream = null;
            }

            this.isOpen = false;
            console.log('Call stopped');
        } catch (error) {
            console.error('Failed to stop call:', error);
        }
    }

    setupEventListeners() {
        const handleVisibilityChange = () => {
            if (document.hidden && this.isOpen) {
                this.stop();
            }
        };

        const handleBeforeUnload = () => {
            if (this.isOpen) {
                this.stop();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("beforeunload", handleBeforeUnload);

        // Store cleanup function
        this.cleanup = () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }

    destroy() {
        if (this.cleanup) {
            this.cleanup();
        }
        if (this.conversation) {
            this.conversation.endSession();
        }
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
    }


}

// Expose to global scope so other scripts can use it
window.ElevenLabsCall = ElevenLabsCall;