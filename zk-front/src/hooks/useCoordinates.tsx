import { useRelaySession } from '../contexts/RelaySessionContext';

export default function useCoordinates() {
  return useRelaySession();
}
