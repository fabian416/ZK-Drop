'use client';

import { useEffect, useRef, useState } from 'react';
import { ZKPassport } from '@zkpassport/sdk';
import { useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';
import { v4 as uuidv4 } from 'uuid';
import * as circomlib from 'circomlibjs';

type ZKPassportModalProps = {
  open: boolean;
  onClose: () => void;
  setIdentity: any;
};

interface IZKPassport {
    documentType: string,
    documentNumber: string,
}

export default function ZKPassportModal({ open, onClose, setIdentity }: ZKPassportModalProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dots, setDots] = useState('');
  const [passportData, setPassportData] = useState<IZKPassport | null>(null);

  const zkpassportRef = useRef<ZKPassport | null>(null);
  const proofRef = useRef<any | null>(null);

  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 300);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (!open) return;

    const runZkPassport = async () => {
      setLoading(true);
      try {
        if (!zkpassportRef.current) {
          zkpassportRef.current = new ZKPassport();
        }

        const queryBuilder = await zkpassportRef.current.request({
          name: 'ZK-Access Demo',
          logo: `/logo-black.png`,
          purpose: 'Verify your identity using ZKPassport',
          scope: 'identity-verification',
          devMode: true,
        });

        const {
          url,
          requestId,
          onRequestReceived,
          onGeneratingProof,
          onProofGenerated,
          onResult,
          onReject,
          onError,
        } = queryBuilder
          .disclose('document_type')
          .disclose('document_number')
          .done();

        setUrl(url);
        setRequestId(requestId);
        setLoading(false);

        onRequestReceived(() => console.log('📩 Request received by user'));
        onGeneratingProof(() => {
          console.log('🔄 Generating proof...');
          setLoading(true);
        });

        onProofGenerated((proof) => {
          console.log('✅ Proof generated');
          proofRef.current = proof;
        });

        onResult(async ({ verified, result }) => {
          if (!verified || !proofRef.current) {
            console.error('❌ Proof verification failed or proof missing');
            setLoading(false);
            return;
          }

          try {
            const data = {
              documentType: result.document_type?.disclose?.result ?? '',
              documentNumber: result.document_number?.disclose?.result ?? '',
            };
            console.log({data});
            setPassportData(data)
            setLoading(false);
          } catch (err) {
            console.error('❌ Error al enviar datos al backend:', err);
            setLoading(false);
          }
        });

        onReject(() => {
          console.warn('❌ User rejected the request');
          setLoading(false);
        });

        onError((err) => {
          console.error('💥 Error:', err);
          setLoading(false);
        });
      } catch (e) {
        console.error('💥 Init error:', e);
        setLoading(false);
      }
    };

    runZkPassport();
  }, [open, router]);

    const useDemoIdentity = () => {
        const data = {
            documentType: "passport",
            documentNumber: uuidv4(),
        };
        setPassportData(data)
        setLoading(false);
    }

    useEffect(() => {
        generateIdentityID();
    }, [passportData])

    const generateIdentityID = async () => {
        if (!passportData) return;
      
        const poseidon = await circomlib.buildPoseidon();
      
        const fieldHashes = await Promise.all(
          Object.entries(passportData).map(async ([key, value]) => {
            return await poseidonHash(key, value); // hash(key || value)
          })
        );
      
        const identityHash = poseidon(fieldHashes);
        setIdentity(identityHash);
        onClose();
      };

    const poseidonHash = async (key: string, value: any) => {
        if (!key || value === undefined || value === null) {
        throw new Error("poseidonHash recibió un key o value vacío");
        }
    
        const poseidon = await circomlib.buildPoseidon();
        const keyBigInt = BigInt('0x' + Buffer.from(key).toString('hex'));
    
        let valueBigInt: bigint;
        if (typeof value === 'number' || typeof value === 'bigint') {
            valueBigInt = BigInt(value);
        } else if (typeof value === 'string') {
            try {
                valueBigInt = BigInt(value);
            } catch {
                valueBigInt = BigInt('0x' + Buffer.from(value).toString('hex'));
            }
        } else {
            throw new Error('Tipo de value no soportado');
        }
    
        const keyHash = poseidon([keyBigInt]);
        const valueHash = poseidon([valueBigInt]);

        const hash = poseidon([keyHash, valueHash]);
        return hash;
    };


  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h1 className="text-xl font-bold mb-4">ZK-Passport Required</h1>
        <p className="text-sm text-gray-700 mb-2">
            To prevent Sybil attacks, we verify you're a unique human using <strong>ZK Passport</strong>.
        </p>
        <p className="text-sm text-gray-600 mb-4">
            Your passport data will be <strong>hashed</strong> (never shared) to ensure no one can claim more than once — while staying fully anonymous.
        </p>
  
        {loading ? (
            <div className="flex justify-center mb-4">
                <p className="text-blue-600 font-semibold">
                ⏳ Creating proof{dots}
                {Array(3 - dots.length).fill('.').map((d, i) => (
                    <span key={i} className="invisible">{d}</span>
                ))}
                </p>
            </div>
            ) : url ? (
            <div className="flex justify-center mb-4">
                <QRCode value={url} size={256} />
            </div>
            ) : (
            <p className="text-gray-500 mb-4 text-center">Waiting for request...</p>
        )}
  
        {!loading && (
            <div className="flex justify-center mt-4">
                <button
                    onClick={useDemoIdentity}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                >
                    Use demo identity instead
                </button>
            </div>
        )}

      </div>
    </div>
  );
}
