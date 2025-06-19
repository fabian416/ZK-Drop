"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface RelaySessionContextType {
  status: string | null;
  error: string | null;
  qrData: string;
  qrId: string;
  getQrData: () => Promise<void>;
}

const RelaySessionContext = createContext<RelaySessionContextType | undefined>(undefined);

export function RelaySessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qrData, setQrData] = useState("");
  const [qrId, setQrId] = useState("");
  const backendUrl = "http://localhost:5000";

  const fetchStatus = async () => {
    if (!qrId) return;
    
    try {
        console.log("qrId", qrId);
        const response = await axios.get(`${backendUrl}/relay-session/status/${qrId}`);
        console.log("response", response);
        setStatus(response.data);
        setError(null);
    } catch (err) {
        setError('Failed to fetch status');
        console.error('Error fetching status:', err);
    }
  };

  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;

    if (qrId) {
      // Initial fetch
      fetchStatus();
      
      // Start polling
      pollInterval = setInterval(fetchStatus, 5000);
    }

    // Cleanup interval on unmount or when qrId changes
    return () => {
        if (pollInterval) {
            clearInterval(pollInterval);
        }
    };
  }, [qrId]); // Now properly depends on qrId

  const getQrData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/relay-session`);
      const data = response.data;
      setQrId(data);
      setQrData(`${backendUrl}/relay-session/${data}`);
    } catch (err) {
      setError('Failed to get QR data');
      console.error('Error getting QR data:', err);
    }
  };

  const value = {
    status,
    error,
    qrData,
    qrId,
    getQrData,
  };

  return (
    <RelaySessionContext.Provider value={value}>
      {children}
    </RelaySessionContext.Provider>
  );
}

export function useRelaySession() {
  const context = useContext(RelaySessionContext);
  if (context === undefined) {
    throw new Error('useRelaySession must be used within a RelaySessionProvider');
  }
  return context;
} 