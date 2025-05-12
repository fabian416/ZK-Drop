'use client'

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppKitAccount } from "@reown/appkit/react";

export default function AppKitButton() {
  const router = useRouter();
  const pathname = usePathname();
  const { isConnected } = useAppKitAccount();

  useEffect(() => {
    if (!isConnected && pathname !== "/") {
      console.log("🔌 Wallet disconnected");
      router.push("/");
    }
  }, [isConnected, router, pathname]);

  return (
    <div className="mx-4">
      <appkit-button />
    </div>
  );
}

