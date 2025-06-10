"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import StockInputWithSuggestions from "./stock-input-with-suggestions"

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
  const [usingSampleData, setUsingSampleData] = useState(false)

  const fetchStockData = async () => {
    setLoading(true)
    setError("")
    setUsingSampleData(false)

    try {
      const response = await fetch(`/api/stocks?stock1=${stock1}&stock2=${stock2}&timeframe=${timeframe}`)
      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to fetch stock data")
      }

      // Check if we're using sample data
      if (responseData.usingSampleData) {
        setUsingSampleData(true)
      }

      // The actual chart data is now in the data property
      setChartData(responseData.data || [])
    } catch (err) {
      console.error("Error fetching stock data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch stock data. Please try again.")
      // Set empty chart data on error
      setChartData([])
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
    if (!chartData || chartData.length === 0) return [80, 120] // Default domain if no data

    // Find min and max values across both stocks
    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY

    chartData.forEach((dataPoint) => {
      const stock1Value = dataPoint[stock1]
      const stock2Value = dataPoint[stock2]

      if (stock1Value !== undefined) min = Math.min(min, stock1Value)
      if (stock2Value !== undefined) min = Math.min(min, stock2Value)
      if (stock1Value !== undefined) max = Math.max(max, stock1Value)
      if (stock2Value !== undefined) max = Math.max(max, stock2Value)
    })

    // If we couldn't find valid min/max values, use defaults
    if (min === Number.POSITIVE_INFINITY || max === Number.NEGATIVE_INFINITY) {
      return [80, 120]
    }

    // Add padding (10% of the range)
    const padding = (max - min) * 0.1
    return [Math.floor(min - padding), Math.ceil(max + padding)]
  }

  return (
    <div className="space-y-6">
      {/* Stock Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StockInputWithSuggestions
          value={stock1}
          onChange={setStock1}
          placeholder="e.g. AAPL"
          label="Stock 1"
          id="stock1"
        />
        <StockInputWithSuggestions
          value={stock2}
          onChange={setStock2}
          placeholder="e.g. MSFT"
          label="Stock 2"
          id="stock2"
        />
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

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {usingSampleData && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Using Sample Data</AlertTitle>
          <AlertDescription>
            The API request failed, so we're displaying sample data. For real-time data, please try again later or use a
            different API key.
          </AlertDescription>
        </Alert>
      )}

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
