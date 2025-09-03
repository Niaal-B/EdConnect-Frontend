import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC, { 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack, 
  IAgoraRTCClient, 
  RemoteUser 
} from 'agora-rtc-sdk-ng';
import api from '@/lib/api';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  Loader
} from 'lucide-react';

interface AgoraVideoCallProps {
  sessionId: string;
  currentUser: {
    id: string | number;
    name: string;
    avatar?: string;
  };
}

const AgoraVideoCall: React.FC<AgoraVideoCallProps> = ({ sessionId, currentUser }) => {
  const client = useRef<IAgoraRTCClient | null>(null);
  
  const [token, setToken] = useState<string>('');
  const [appId, setAppId] = useState<string>('');
  const [uid, setUid] = useState<number>(0);
  const [localTracks, setLocalTracks] = useState<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isCallReady, setIsCallReady] = useState(false);

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    return () => {
      if (client.current) {
        client.current.leave();
        client.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await api.post('sessions/agora/get-token/', {
          channelName: sessionId,
        });
        const data = response.data;
        setToken(data.token);
        setAppId(data.appId);
        setUid(data.uid);
      } catch (e) {
        console.error("Error fetching Agora token:", e);
      }
    };
    fetchToken();
  }, [sessionId]);

  useEffect(() => {
    if (!token) return;
    
    const createTracks = async () => {
      try {
        console.log("🎬 Creating tracks...");
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        console.log("✅ Tracks created successfully");
        setLocalTracks([audioTrack, videoTrack]);
      } catch (error) {
        console.error("❌ Failed to create tracks:", error);
        alert('Failed to access camera/microphone. Please check permissions.');
      }
    };
    
    createTracks();
  }, [token]);

  // Play local video immediately when tracks are ready
  useEffect(() => {
    if (localTracks && localVideoRef.current) {
      const [, videoTrack] = localTracks;
      console.log("🎥 Setting up local video");
      
      try {
        // Clear the container first
        localVideoRef.current.innerHTML = '';
        
        // Play directly to the container - Agora will create the video element
        videoTrack.play(localVideoRef.current);
        console.log("✅ Local video playing to container");
        
        // Add styling to any video elements that get created
        setTimeout(() => {
          const videoElements = localVideoRef.current?.querySelectorAll('video');
          videoElements?.forEach(video => {
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            video.style.transform = 'scaleX(-1)'; // Mirror effect
            video.muted = true;
            console.log("✅ Applied styles to local video element");
          });
        }, 100);
      } catch (error) {
        console.error("❌ Error playing local video:", error);
      }
    }
  }, [localTracks, isCallReady]);

  // Handle Agora events and join channel
  useEffect(() => {
    if (!client.current || !appId || !token || !sessionId || !uid || !localTracks) {
      return;
    }

    const startCall = async () => {
      if (!client.current) return;

      client.current.on('user-published', async (user, mediaType) => {
        console.log('👥 User published:', user.uid, mediaType);
        await client.current!.subscribe(user, mediaType);
        
        if (mediaType === 'video') {
          setRemoteUsers(prevUsers => {
            const existingUser = prevUsers.find(u => u.uid === user.uid);
            if (existingUser) {
              return prevUsers.map(u => u.uid === user.uid ? user : u);
            }
            return [...prevUsers, user];
          });
        }
        
        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
      });
      
      client.current.on('user-unpublished', (user, type) => {
        console.log('👥 User unpublished:', user.uid, type);
      });
      
      client.current.on('user-left', (user) => {
        console.log('👥 User left:', user.uid);
        setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
      });

      try {
        await client.current.join(appId, sessionId, token, uid);
        await client.current.publish(localTracks);
        console.log("✅ Joined channel and published tracks");
        setIsCallReady(true);
      } catch (error) {
        console.error("❌ Failed to join channel:", error);
      }
    };

    startCall();
    
    return () => {
      if (localTracks) {
        localTracks[0].close();
        localTracks[1].close();
      }
      if (client.current) {
        client.current.leave();
      }
      setIsCallReady(false);
    };
  }, [appId, token, sessionId, uid, localTracks]);

  // Play remote video when user joins
  useEffect(() => {
    if (remoteUsers.length > 0 && remoteVideoRef.current) {
      const remoteUser = remoteUsers[0];
      if (remoteUser.videoTrack) {
        console.log("🎥 Playing remote video");
        remoteUser.videoTrack.play(remoteVideoRef.current);
      }
    }
  }, [remoteUsers]);

  const leaveChannel = async () => {
    if (localTracks) {
      localTracks[0].close();
      localTracks[1].close();
    }
    if (client.current) {
      await client.current.leave();
    }
    setIsCallReady(false);
    setRemoteUsers([]);
    setLocalTracks(null);
  };

  const toggleVideo = async () => {
    if (localTracks) {
      const [, videoTrack] = localTracks;
      const newMutedState = !isVideoMuted;
      
      await videoTrack.setEnabled(!newMutedState);
      setIsVideoMuted(newMutedState);
      console.log(`🎥 Video ${newMutedState ? 'muted' : 'unmuted'}`);
      
      // If unmuting, we need to re-setup the video element
      if (!newMutedState && localVideoRef.current) {
        setTimeout(() => {
          try {
            // Re-create the video element structure
            localVideoRef.current!.innerHTML = '';
            const videoElement = document.createElement('video');
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'cover';
            videoElement.autoplay = true;
            videoElement.muted = true;
            videoElement.playsInline = true;
            
            localVideoRef.current!.appendChild(videoElement);
            videoTrack.play(videoElement);
            console.log("🎥 Re-rendered local video after toggle");
          } catch (error) {
            console.error("❌ Error re-rendering local video:", error);
          }
        }, 100);
      }
    }
  };

  const toggleAudio = async () => {
    if (localTracks) {
      const [audioTrack] = localTracks;
      const newMutedState = !isAudioMuted;
      
      await audioTrack.setEnabled(!newMutedState);
      setIsAudioMuted(newMutedState);
      console.log(`🎤 Audio ${newMutedState ? 'muted' : 'unmuted'}`);
    }
  };
  
  if (!isCallReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full mx-4 text-center text-white">
          <div className="mb-6">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Join Video Call</h2>
            <p className="text-blue-100">Session: {sessionId}</p>
          </div>
          <div className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
            <Loader className="w-5 h-5 animate-spin"/>
            {localTracks ? 'Connecting...' : 'Setting up camera...'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-white font-medium">Video Call</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-gray-300">
          <span className="text-sm">
            {remoteUsers.length > 0 ? 'Connected' : 'Waiting for participant...'}
          </span>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative p-4">
        {/* Remote Video (Main) */}
        <div className="w-full h-full bg-gray-800 rounded-lg relative overflow-hidden">
          {remoteUsers.length > 0 ? (
            <div 
              ref={remoteVideoRef}
              className="w-full h-full object-cover"
              style={{ 
                background: 'linear-gradient(45deg, #374151, #4b5563)',
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Video className="w-16 h-16 mx-auto mb-4" />
                <p>Waiting for participant to join...</p>
              </div>
            </div>
          )}

          {/* Local Video (Picture in Picture) - Enhanced */}
          <div className="absolute top-4 right-4 w-80 h-60 bg-gray-700 rounded-xl border-3 border-gray-600 overflow-hidden shadow-2xl">
            <div 
              ref={localVideoRef} 
              className="w-full h-full relative bg-gray-800"
              style={{
                transform: 'scaleX(-1)', // Mirror effect for natural self-view
                display: (!isVideoMuted && localTracks) ? 'block' : 'none'
              }}
            />
            
            {/* Video muted overlay */}
            {(isVideoMuted || !localTracks) && (
              <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center">
                <VideoOff className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-gray-400 text-sm">Camera Off</span>
              </div>
            )}
            
            {/* User label with better styling */}
            <div className="absolute bottom-2 left-2 bg-black/80 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
              You ({currentUser.name})
            </div>
            
            {/* Audio muted indicator with better positioning */}
            {isAudioMuted && (
              <div className="absolute top-2 left-2 bg-red-500 text-white p-2 rounded-full shadow-lg">
                <MicOff className="w-4 h-4" />
              </div>
            )}

            {/* Connection status indicator */}
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </div>

          {/* Additional local video preview when no remote user */}
          {remoteUsers.length === 0 && (
            <div className="absolute inset-4 bg-gray-700 rounded-lg overflow-hidden">
              {(isVideoMuted || !localTracks) && (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <VideoOff className="w-24 h-24 mb-4" />
                  <p className="text-lg">Your camera is off</p>
                  <p className="text-sm text-gray-500">Turn on your camera to see yourself</p>
                </div>
              )}
              
              <div className="absolute bottom-4 left-4 bg-black/80 text-white text-lg px-4 py-2 rounded-full backdrop-blur-sm">
                You ({currentUser.name})
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 border-t border-gray-700 p-6">
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full transition-all duration-200 ${
              isAudioMuted 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25' 
                : 'bg-gray-700 hover:bg-gray-600 text-white shadow-lg'
            }`}
            title={isAudioMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isAudioMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-all duration-200 ${
              isVideoMuted 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25' 
                : 'bg-gray-700 hover:bg-gray-600 text-white shadow-lg'
            }`}
            title={isVideoMuted ? 'Turn on camera' : 'Turn off camera'}
          >
            {isVideoMuted ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>

          <button
            onClick={leaveChannel}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-lg shadow-red-500/25"
            title="End call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgoraVideoCall;