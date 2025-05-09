"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownUp, Settings } from "lucide-react"

export default function DexInterface() {
  return (
    <div className="container max-w-md px-4 py-8">
      <Card className="p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-violet-600">Swap</h2>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">From</span>
              <span className="text-sm text-gray-500">Balance: 0.0</span>
            </div>

            <div className="flex items-center space-x-2">
              <Input type="number" placeholder="0.0" className="text-lg font-medium" />
              <Select>
                <SelectTrigger className="w-32 bg-violet-100">
                  <SelectValue placeholder="ETH" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eth">ETH</SelectItem>
                  <SelectItem value="usdc">USDC</SelectItem>
                  <SelectItem value="dai">DAI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="ghost" size="icon" className="rounded-full bg-violet-100">
              <ArrowDownUp className="h-4 w-4 text-gray-600" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">To</span>
              <span className="text-sm text-gray-500">Balance: 0.0</span>
            </div>

            <div className="flex items-center space-x-2">
              <Input type="number" placeholder="0.0" className="text-lg font-medium" readOnly />
              <Select>
                <SelectTrigger className="w-32 bg-violet-100">
                  <SelectValue placeholder="USDC" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eth">ETH</SelectItem>
                  <SelectItem value="usdc">USDC</SelectItem>
                  <SelectItem value="dai">DAI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg bg-violet-50 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">1 ETH =</span>
              <span className="font-medium">1,850.42 USDC</span>
            </div>
          </div>

          <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold">Swap</Button>
        </div>
      </Card>
    </div>
  )
}