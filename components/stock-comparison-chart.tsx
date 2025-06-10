"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

// Define timeframe options
const timeframes = [
  { value: "1month", label: "1 Month" },
  { value: "3months", label: "3 Months" },
  { value: "6months", label: "6 Months" },
  { value: "1year", label: "1 Year" },
]

export default function StockComparisonChart() {
  const [stock1, setStock1] = useState("AAPL")
  const [stock2, setStock2] = useState("MSFT")
  const [timeframe, setTimeframe] = useState("3months")
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchStockData = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/stocks?stock1=${stock1}&stock2=${stock2}&timeframe=${timeframe}`)

      if (!response.ok) {
        throw new Error("Failed to fetch stock data")
      }

      const data = await response.json()
      setChartData(data)
    } catch (err) {
      setError("Error fetching stock data. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Add a small delay to avoid excessive API calls while typing
    const timeoutId = setTimeout(() => {
      if (stock1.trim() && stock2.trim()) {
        fetchStockData()
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [stock1, stock2, timeframe])

  const calculateDomain = () => {
    if (chartData.length === 0) return ["dataMin - 5", "dataMax + 5"]

    // Find min and max values across both stocks
    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY

    chartData.forEach((dataPoint) => {
      const stock1Value = Number.parseFloat(dataPoint[stock1])
      const stock2Value = Number.parseFloat(dataPoint[stock2])

      min = Math.min(min, stock1Value, stock2Value)
      max = Math.max(max, stock1Value, stock2Value)
    })

    // Add padding (10% of the range)
    const padding = (max - min) * 0.1
    return [Math.floor(min - padding), Math.ceil(max + padding)]
  }

  return (
    <div className="space-y-6">
      {/* Stock Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="stock1" className="block text-sm font-medium mb-1">
            Stock 1
          </label>
          <Input
            id="stock1"
            value={stock1}
            onChange={(e) => setStock1(e.target.value.toUpperCase())}
            placeholder="e.g. AAPL"
            className="uppercase"
          />
        </div>
        <div>
          <label htmlFor="stock2" className="block text-sm font-medium mb-1">
            Stock 2
          </label>
          <Input
            id="stock2"
            value={stock2}
            onChange={(e) => setStock2(e.target.value.toUpperCase())}
            placeholder="e.g. MSFT"
            className="uppercase"
          />
        </div>
      </div>

      {/* Timeframe Selection */}
      <div className="flex justify-center">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <label htmlFor="timeframe" className="block text-sm font-medium mb-2 text-center">
            Comparison Timeframe
          </label>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-48 bg-white">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Stock Performance Comparison</CardTitle>
          <CardDescription>
            Normalized price comparison between {stock1} and {stock2}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={calculateDomain()} tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, "Value"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={stock1}
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey={stock2}
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
