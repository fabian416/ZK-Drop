import { Circuit } from '../types/types'; // Define este tipo si no existe (puedes crearlo como { [key: string]: any })
import { NativeModules } from 'react-native';

const { NoirModule } = NativeModules;

export async function setupCircuit(circuit: Circuit): Promise<string> {
  return await new Promise((resolve) => {
    NoirModule.setupCircuit(JSON.stringify(circuit), (circuitId: string) => {
      resolve(circuitId);
    });
  });
}

export async function generateProof(inputs: any, circuitId: string): Promise<{ proofWithPublicInputs: string; vkey: string }> {
  return await new Promise((resolve) => {
    NoirModule.generateProof(JSON.stringify(inputs), circuitId, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export async function verifyProof(proofWithPublicInputs: string, vkey: string, circuitId: string): Promise<boolean> {
  return await new Promise((resolve) => {
    NoirModule.verifyProof(proofWithPublicInputs, vkey, circuitId, (isValid: boolean) => {
      resolve(isValid);
    });
  });
}