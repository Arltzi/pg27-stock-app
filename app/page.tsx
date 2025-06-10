import StockComparisonChart from "@/components/stock-comparison-chart"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Stock Comparison Tool</h1>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <StockComparisonChart />
        </div>
      </div>
    </div>
  )
}
