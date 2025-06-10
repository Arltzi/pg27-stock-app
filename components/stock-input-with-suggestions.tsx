"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Popular stock symbols with company names
const popularStocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "AMD", name: "Advanced Micro Devices" },
  { symbol: "INTC", name: "Intel Corporation" },
  { symbol: "CRM", name: "Salesforce Inc." },
  { symbol: "ORCL", name: "Oracle Corporation" },
  { symbol: "ADBE", name: "Adobe Inc." },
  { symbol: "PYPL", name: "PayPal Holdings Inc." },
  { symbol: "UBER", name: "Uber Technologies Inc." },
  { symbol: "SPOT", name: "Spotify Technology S.A." },
  { symbol: "ZOOM", name: "Zoom Video Communications" },
  { symbol: "SQ", name: "Block Inc." },
  { symbol: "SHOP", name: "Shopify Inc." },
  { symbol: "TWTR", name: "Twitter Inc." },
  { symbol: "SNAP", name: "Snap Inc." },
  { symbol: "ROKU", name: "Roku Inc." },
  { symbol: "PINS", name: "Pinterest Inc." },
  { symbol: "DOCU", name: "DocuSign Inc." },
  { symbol: "ZM", name: "Zoom Video Communications" },
  { symbol: "WORK", name: "Slack Technologies" },
  { symbol: "CRWD", name: "CrowdStrike Holdings" },
  { symbol: "OKTA", name: "Okta Inc." },
  { symbol: "SNOW", name: "Snowflake Inc." },
  { symbol: "PLTR", name: "Palantir Technologies" },
  { symbol: "COIN", name: "Coinbase Global Inc." },
  { symbol: "RBLX", name: "Roblox Corporation" },
  { symbol: "HOOD", name: "Robinhood Markets Inc." },
  { symbol: "RIVN", name: "Rivian Automotive Inc." },
  { symbol: "LCID", name: "Lucid Group Inc." },
  { symbol: "F", name: "Ford Motor Company" },
  { symbol: "GM", name: "General Motors Company" },
  { symbol: "TSMC", name: "Taiwan Semiconductor" },
  { symbol: "BABA", name: "Alibaba Group Holding" },
  { symbol: "JD", name: "JD.com Inc." },
  { symbol: "PDD", name: "PDD Holdings Inc." },
  { symbol: "NIO", name: "NIO Inc." },
  { symbol: "XPEV", name: "XPeng Inc." },
  { symbol: "LI", name: "Li Auto Inc." },
  { symbol: "DIDI", name: "DiDi Global Inc." },
  { symbol: "BILI", name: "Bilibili Inc." },
  { symbol: "TME", name: "Tencent Music Entertainment" },
  { symbol: "NTES", name: "NetEase Inc." },
  { symbol: "WB", name: "Weibo Corporation" },
]

interface StockInputWithSuggestionsProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label: string
  id: string
}

export default function StockInputWithSuggestions({
  value,
  onChange,
  placeholder = "e.g. AAPL",
  label,
  id,
}: StockInputWithSuggestionsProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  // Update search value when the external value changes
  useEffect(() => {
    setSearchValue(value)
  }, [value])

  // Filter stocks based on search input
  const filteredStocks = popularStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchValue.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchValue.toLowerCase()),
  )

  const handleSelect = (selectedSymbol: string) => {
    onChange(selectedSymbol)
    setSearchValue(selectedSymbol)
    setOpen(false)
  }

  const handleInputChange = (newValue: string) => {
    setSearchValue(newValue.toUpperCase())
    onChange(newValue.toUpperCase())
    if (!open && newValue.length > 0) {
      setOpen(true)
    }
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-10 px-3 py-2 text-left font-normal"
            onClick={() => setOpen(!open)}
          >
            <span className={cn("truncate", !value && "text-muted-foreground")}>{value || placeholder}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search stocks..."
              value={searchValue}
              onValueChange={handleInputChange}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No stocks found.</CommandEmpty>
              <CommandGroup>
                {filteredStocks.slice(0, 10).map((stock) => (
                  <CommandItem
                    key={stock.symbol}
                    value={stock.symbol}
                    onSelect={() => handleSelect(stock.symbol)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{stock.symbol}</span>
                      <span className="text-sm text-muted-foreground truncate">{stock.name}</span>
                    </div>
                    <Check className={cn("ml-2 h-4 w-4", value === stock.symbol ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
