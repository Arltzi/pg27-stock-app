import { NextResponse } from "next/server"

// Alpha Vantage API key - in production, use environment variables
const API_KEY = "XZHKDKWD4JQQ7SND"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const stock1 = searchParams.get("stock1")
  const stock2 = searchParams.get("stock2")
  const timeframe = searchParams.get("timeframe")

  if (!stock1 || !stock2) {
    return NextResponse.json({ error: "Stock symbols are required" }, { status: 400 })
  }

  try {
    // Fetch data for both stocks
    const [stock1Data, stock2Data] = await Promise.all([fetchStockData(stock1), fetchStockData(stock2)])

    // Process and normalize the data for comparison
    const processedData = processStockData(stock1Data, stock2Data, stock1, stock2, timeframe)

    return NextResponse.json(processedData)
  } catch (error) {
    console.error("Error fetching stock data:", error)
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 })
  }
}

async function fetchStockData(symbol: string) {
  // Using Alpha Vantage API with demo key
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch data for ${symbol}`)
  }

  return response.json()
}

function processStockData(data1: any, data2: any, symbol1: string, symbol2: string, timeframe: string | null) {
  // Extract time series data
  const timeSeries1 = data1["Time Series (Daily)"] || {}
  const timeSeries2 = data2["Time Series (Daily)"] || {}

  // Get dates from both datasets
  const dates1 = Object.keys(timeSeries1)
  const dates2 = Object.keys(timeSeries2)

  // Find common dates between both datasets
  const commonDates = dates1.filter((date) => dates2.includes(date))

  // Sort dates in ascending order
  commonDates.sort()

  // Limit data based on timeframe
  const limitedDates = limitDatesByTimeframe(commonDates, timeframe)

  // Get the first closing prices to normalize
  const firstClose1 = Number.parseFloat(timeSeries1[limitedDates[0]]["4. close"])
  const firstClose2 = Number.parseFloat(timeSeries2[limitedDates[0]]["4. close"])

  // Create normalized data points
  return limitedDates.map((date) => {
    const close1 = Number.parseFloat(timeSeries1[date]["4. close"])
    const close2 = Number.parseFloat(timeSeries2[date]["4. close"])

    // Normalize prices to percentage change from first date
    const normalized1 = (close1 / firstClose1) * 100
    const normalized2 = (close2 / firstClose2) * 100

    return {
      date: formatDate(date),
      [symbol1]: Number.parseFloat(normalized1.toFixed(2)),
      [symbol2]: Number.parseFloat(normalized2.toFixed(2)),
    }
  })
}

function limitDatesByTimeframe(dates: string[], timeframe: string | null) {
  const now = new Date()
  const cutoffDate = new Date()

  switch (timeframe) {
    case "1month":
      cutoffDate.setMonth(now.getMonth() - 1)
      break
    case "3months":
      cutoffDate.setMonth(now.getMonth() - 3)
      break
    case "6months":
      cutoffDate.setMonth(now.getMonth() - 6)
      break
    case "1year":
      cutoffDate.setFullYear(now.getFullYear() - 1)
      break
    default:
      cutoffDate.setMonth(now.getMonth() - 3) // Default to 3 months
  }

  return dates.filter((date) => new Date(date) >= cutoffDate)
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
