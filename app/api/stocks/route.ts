import { NextResponse } from "next/server"

// Alpha Vantage API key - use environment variable
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || "XZHKDKWD4JQQ7SND"

// Sample data to use as fallback when API fails
const SAMPLE_DATA = {
  AAPL: {
    "Meta Data": {
      "1. Information": "Daily Prices (open, high, low, close) and Volumes",
      "2. Symbol": "AAPL",
      "3. Last Refreshed": "2023-06-09",
      "4. Output Size": "Compact",
      "5. Time Zone": "US/Eastern",
    },
    "Time Series (Daily)": {
      "2023-06-09": {
        "1. open": "180.5700",
        "2. high": "182.2300",
        "3. low": "180.1700",
        "4. close": "181.1200",
        "5. volume": "55551227",
      },
      "2023-06-08": {
        "1. open": "177.8950",
        "2. high": "180.8400",
        "3. low": "177.4600",
        "4. close": "180.5700",
        "5. volume": "56058723",
      },
      "2023-06-07": {
        "1. open": "178.4400",
        "2. high": "179.3500",
        "3. low": "177.3300",
        "4. close": "177.8200",
        "5. volume": "45642644",
      },
      "2023-06-06": {
        "1. open": "179.9700",
        "2. high": "180.1200",
        "3. low": "177.4300",
        "4. close": "178.6700",
        "5. volume": "48252751",
      },
      "2023-06-05": {
        "1. open": "182.6300",
        "2. high": "184.9500",
        "3. low": "178.0350",
        "4. close": "179.5800",
        "5. volume": "67157801",
      },
      "2023-06-02": {
        "1. open": "180.9700",
        "2. high": "181.7800",
        "3. low": "179.2600",
        "4. close": "180.9500",
        "5. volume": "55262300",
      },
      "2023-06-01": {
        "1. open": "177.7000",
        "2. high": "180.1200",
        "3. low": "176.9300",
        "4. close": "180.0900",
        "5. volume": "51427100",
      },
      "2023-05-31": {
        "1. open": "177.3300",
        "2. high": "179.3500",
        "3. low": "176.7600",
        "4. close": "177.2500",
        "5. volume": "99455200",
      },
      "2023-05-30": {
        "1. open": "176.9600",
        "2. high": "178.9900",
        "3. low": "176.5700",
        "4. close": "177.3000",
        "5. volume": "55964300",
      },
      "2023-05-26": {
        "1. open": "173.3200",
        "2. high": "175.7700",
        "3. low": "173.1100",
        "4. close": "175.4300",
        "5. volume": "54834000",
      },
      "2023-05-25": {
        "1. open": "172.4100",
        "2. high": "173.8900",
        "3. low": "171.6900",
        "4. close": "172.9900",
        "5. volume": "56058500",
      },
      "2023-05-24": {
        "1. open": "171.0900",
        "2. high": "172.4199",
        "3. low": "170.5200",
        "4. close": "171.8400",
        "5. volume": "45143500",
      },
      "2023-05-23": {
        "1. open": "173.1300",
        "2. high": "173.3800",
        "3. low": "171.2800",
        "4. close": "171.5600",
        "5. volume": "45597600",
      },
      "2023-05-22": {
        "1. open": "175.1600",
        "2. high": "175.2700",
        "3. low": "173.7400",
        "4. close": "174.2000",
        "5. volume": "40744300",
      },
      "2023-05-19": {
        "1. open": "175.1500",
        "2. high": "175.4200",
        "3. low": "174.1800",
        "4. close": "175.1600",
        "5. volume": "57466200",
      },
      "2023-05-18": {
        "1. open": "172.4100",
        "2. high": "175.2300",
        "3. low": "172.1000",
        "4. close": "175.0500",
        "5. volume": "65496700",
      },
      "2023-05-17": {
        "1. open": "171.7100",
        "2. high": "172.9300",
        "3. low": "170.4200",
        "4. close": "172.6900",
        "5. volume": "57271600",
      },
      "2023-05-16": {
        "1. open": "171.9900",
        "2. high": "173.1300",
        "3. low": "171.8000",
        "4. close": "172.0700",
        "5. volume": "42110300",
      },
      "2023-05-15": {
        "1. open": "173.1600",
        "2. high": "173.2100",
        "3. low": "171.4700",
        "4. close": "172.0700",
        "5. volume": "37266700",
      },
      "2023-05-12": {
        "1. open": "173.6200",
        "2. high": "174.0600",
        "3. low": "171.0000",
        "4. close": "172.5700",
        "5. volume": "45487100",
      },
      "2023-05-11": {
        "1. open": "173.8500",
        "2. high": "174.5900",
        "3. low": "172.1700",
        "4. close": "173.7500",
        "5. volume": "49514700",
      },
      "2023-05-10": {
        "1. open": "173.0200",
        "2. high": "174.0300",
        "3. low": "171.9000",
        "4. close": "173.5500",
        "5. volume": "53724500",
      },
      "2023-05-09": {
        "1. open": "173.0500",
        "2. high": "173.5400",
        "3. low": "171.6000",
        "4. close": "171.7700",
        "5. volume": "45326900",
      },
      "2023-05-08": {
        "1. open": "173.1600",
        "2. high": "173.9500",
        "3. low": "172.3100",
        "4. close": "173.5000",
        "5. volume": "37262900",
      },
      "2023-05-05": {
        "1. open": "170.9700",
        "2. high": "174.3000",
        "3. low": "170.7600",
        "4. close": "173.5700",
        "5. volume": "67807300",
      },
      "2023-05-04": {
        "1. open": "164.8900",
        "2. high": "167.0400",
        "3. low": "164.3100",
        "4. close": "165.7900",
        "5. volume": "81235400",
      },
      "2023-05-03": {
        "1. open": "169.5000",
        "2. high": "170.9200",
        "3. low": "167.1600",
        "4. close": "167.4500",
        "5. volume": "65136000",
      },
      "2023-05-02": {
        "1. open": "169.3000",
        "2. high": "170.3500",
        "3. low": "167.5400",
        "4. close": "168.5400",
        "5. volume": "48962100",
      },
      "2023-05-01": {
        "1. open": "169.2800",
        "2. high": "170.4500",
        "3. low": "168.6400",
        "4. close": "169.5900",
        "5. volume": "52472900",
      },
      "2023-04-28": {
        "1. open": "168.4900",
        "2. high": "169.8500",
        "3. low": "167.8800",
        "4. close": "169.6800",
        "5. volume": "55275800",
      },
    },
  },
  MSFT: {
    "Meta Data": {
      "1. Information": "Daily Prices (open, high, low, close) and Volumes",
      "2. Symbol": "MSFT",
      "3. Last Refreshed": "2023-06-09",
      "4. Output Size": "Compact",
      "5. Time Zone": "US/Eastern",
    },
    "Time Series (Daily)": {
      "2023-06-09": {
        "1. open": "335.3200",
        "2. high": "337.5000",
        "3. low": "332.6400",
        "4. close": "335.4000",
        "5. volume": "22865400",
      },
      "2023-06-08": {
        "1. open": "331.8600",
        "2. high": "335.9400",
        "3. low": "330.7600",
        "4. close": "335.0500",
        "5. volume": "23055100",
      },
      "2023-06-07": {
        "1. open": "333.1400",
        "2. high": "334.2900",
        "3. low": "329.3200",
        "4. close": "331.2100",
        "5. volume": "19580300",
      },
      "2023-06-06": {
        "1. open": "335.9500",
        "2. high": "336.0600",
        "3. low": "332.1600",
        "4. close": "333.6800",
        "5. volume": "19955100",
      },
      "2023-06-05": {
        "1. open": "335.9300",
        "2. high": "338.5600",
        "3. low": "332.2000",
        "4. close": "335.9400",
        "5. volume": "25616000",
      },
      "2023-06-02": {
        "1. open": "329.0400",
        "2. high": "335.9400",
        "3. low": "328.8900",
        "4. close": "335.4000",
        "5. volume": "27962300",
      },
      "2023-06-01": {
        "1. open": "325.4500",
        "2. high": "329.9900",
        "3. low": "324.3000",
        "4. close": "329.7400",
        "5. volume": "23734300",
      },
      "2023-05-31": {
        "1. open": "327.7800",
        "2. high": "329.9900",
        "3. low": "324.3800",
        "4. close": "325.9200",
        "5. volume": "33548800",
      },
      "2023-05-30": {
        "1. open": "332.2600",
        "2. high": "332.2600",
        "3. low": "327.3900",
        "4. close": "328.3900",
        "5. volume": "21239900",
      },
      "2023-05-26": {
        "1. open": "332.6400",
        "2. high": "333.4000",
        "3. low": "330.3100",
        "4. close": "332.8900",
        "5. volume": "22068500",
      },
      "2023-05-25": {
        "1. open": "337.9900",
        "2. high": "337.9900",
        "3. low": "331.8500",
        "4. close": "332.1600",
        "5. volume": "25835300",
      },
      "2023-05-24": {
        "1. open": "333.9100",
        "2. high": "337.0000",
        "3. low": "332.9000",
        "4. close": "337.0000",
        "5. volume": "22621500",
      },
      "2023-05-23": {
        "1. open": "334.3000",
        "2. high": "335.9500",
        "3. low": "332.9000",
        "4. close": "333.5000",
        "5. volume": "17984600",
      },
      "2023-05-22": {
        "1. open": "334.5500",
        "2. high": "335.6000",
        "3. low": "332.1000",
        "4. close": "334.2900",
        "5. volume": "18363300",
      },
      "2023-05-19": {
        "1. open": "330.8100",
        "2. high": "334.4400",
        "3. low": "330.4100",
        "4. close": "334.3500",
        "5. volume": "24788800",
      },
      "2023-05-18": {
        "1. open": "319.5600",
        "2. high": "328.4800",
        "3. low": "318.9500",
        "4. close": "328.3900",
        "5. volume": "28383200",
      },
      "2023-05-17": {
        "1. open": "319.9900",
        "2. high": "321.8900",
        "3. low": "318.7000",
        "4. close": "319.9900",
        "5. volume": "17502100",
      },
      "2023-05-16": {
        "1. open": "319.5000",
        "2. high": "321.8700",
        "3. low": "318.9300",
        "4. close": "319.7200",
        "5. volume": "16517300",
      },
      "2023-05-15": {
        "1. open": "310.6000",
        "2. high": "319.0400",
        "3. low": "310.5500",
        "4. close": "319.0400",
        "5. volume": "22370800",
      },
      "2023-05-12": {
        "1. open": "307.2600",
        "2. high": "310.6500",
        "3. low": "307.2600",
        "4. close": "310.6500",
        "5. volume": "15382100",
      },
      "2023-05-11": {
        "1. open": "307.0000",
        "2. high": "309.4800",
        "3. low": "305.3100",
        "4. close": "308.9700",
        "5. volume": "16058600",
      },
      "2023-05-10": {
        "1. open": "309.7200",
        "2. high": "310.6600",
        "3. low": "306.3200",
        "4. close": "307.0000",
        "5. volume": "17412300",
      },
      "2023-05-09": {
        "1. open": "307.2600",
        "2. high": "309.4900",
        "3. low": "306.3200",
        "4. close": "307.4000",
        "5. volume": "14678300",
      },
      "2023-05-08": {
        "1. open": "307.6800",
        "2. high": "309.7900",
        "3. low": "306.3200",
        "4. close": "308.6500",
        "5. volume": "14307500",
      },
      "2023-05-05": {
        "1. open": "305.8900",
        "2. high": "309.4800",
        "3. low": "304.3400",
        "4. close": "308.9700",
        "5. volume": "21847200",
      },
      "2023-05-04": {
        "1. open": "304.9700",
        "2. high": "306.7500",
        "3. low": "303.5000",
        "4. close": "305.4100",
        "5. volume": "16872900",
      },
      "2023-05-03": {
        "1. open": "306.3500",
        "2. high": "307.7700",
        "3. low": "303.4100",
        "4. close": "304.4000",
        "5. volume": "19723800",
      },
      "2023-05-02": {
        "1. open": "306.8100",
        "2. high": "307.8500",
        "3. low": "304.0200",
        "4. close": "305.5600",
        "5. volume": "19122200",
      },
      "2023-05-01": {
        "1. open": "307.7600",
        "2. high": "309.1800",
        "3. low": "306.0000",
        "4. close": "307.0000",
        "5. volume": "17920800",
      },
      "2023-04-28": {
        "1. open": "304.0100",
        "2. high": "308.9300",
        "3. low": "303.3100",
        "4. close": "307.2600",
        "5. volume": "28058500",
      },
    },
  },
  GOOGL: {
    "Meta Data": {
      "1. Information": "Daily Prices (open, high, low, close) and Volumes",
      "2. Symbol": "GOOGL",
      "3. Last Refreshed": "2023-06-09",
      "4. Output Size": "Compact",
      "5. Time Zone": "US/Eastern",
    },
    "Time Series (Daily)": {
      "2023-06-09": {
        "1. open": "123.3100",
        "2. high": "124.0400",
        "3. low": "122.7600",
        "4. close": "123.5300",
        "5. volume": "18825100",
      },
      "2023-06-08": {
        "1. open": "122.1700",
        "2. high": "123.3100",
        "3. low": "121.8900",
        "4. close": "123.0700",
        "5. volume": "18777200",
      },
      "2023-06-07": {
        "1. open": "123.2600",
        "2. high": "123.3100",
        "3. low": "121.8900",
        "4. close": "122.0400",
        "5. volume": "16646900",
      },
      "2023-06-06": {
        "1. open": "124.2800",
        "2. high": "124.3800",
        "3. low": "122.8800",
        "4. close": "123.1000",
        "5. volume": "17523800",
      },
      "2023-06-05": {
        "1. open": "124.0000",
        "2. high": "125.8000",
        "3. low": "123.3100",
        "4. close": "124.6700",
        "5. volume": "24445200",
      },
      "2023-06-02": {
        "1. open": "123.3100",
        "2. high": "124.8800",
        "3. low": "123.3100",
        "4. close": "124.6700",
        "5. volume": "22662900",
      },
      "2023-06-01": {
        "1. open": "122.1700",
        "2. high": "123.5500",
        "3. low": "121.8900",
        "4. close": "123.3100",
        "5. volume": "19087100",
      },
      "2023-05-31": {
        "1. open": "124.0000",
        "2. high": "124.0000",
        "3. low": "122.1700",
        "4. close": "122.8700",
        "5. volume": "33294100",
      },
      "2023-05-30": {
        "1. open": "124.0000",
        "2. high": "124.0000",
        "3. low": "123.0700",
        "4. close": "123.8400",
        "5. volume": "15052300",
      },
      "2023-05-26": {
        "1. open": "123.3100",
        "2. high": "124.0000",
        "3. low": "123.0700",
        "4. close": "124.0000",
        "5. volume": "16446400",
      },
      "2023-05-25": {
        "1. open": "124.0000",
        "2. high": "124.0000",
        "3. low": "122.4600",
        "4. close": "123.3100",
        "5. volume": "19612100",
      },
      "2023-05-24": {
        "1. open": "123.3100",
        "2. high": "124.0000",
        "3. low": "122.8700",
        "4. close": "124.0000",
        "5. volume": "17708700",
      },
      "2023-05-23": {
        "1. open": "124.6700",
        "2. high": "124.6700",
        "3. low": "123.3100",
        "4. close": "123.3100",
        "5. volume": "15145800",
      },
      "2023-05-22": {
        "1. open": "125.3800",
        "2. high": "125.3800",
        "3. low": "124.0000",
        "4. close": "124.6700",
        "5. volume": "15282700",
      },
      "2023-05-19": {
        "1. open": "124.6700",
        "2. high": "125.3800",
        "3. low": "124.0000",
        "4. close": "125.3800",
        "5. volume": "19760100",
      },
      "2023-05-18": {
        "1. open": "121.8900",
        "2. high": "124.6700",
        "3. low": "121.8900",
        "4. close": "124.6700",
        "5. volume": "24795800",
      },
      "2023-05-17": {
        "1. open": "121.8900",
        "2. high": "122.6000",
        "3. low": "121.1800",
        "4. close": "121.8900",
        "5. volume": "15868300",
      },
      "2023-05-16": {
        "1. open": "121.8900",
        "2. high": "122.6000",
        "3. low": "121.1800",
        "4. close": "121.8900",
        "5. volume": "15868300",
      },
      "2023-05-15": {
        "1. open": "117.5600",
        "2. high": "121.1800",
        "3. low": "117.5600",
        "4. close": "121.1800",
        "5. volume": "19791100",
      },
      "2023-05-12": {
        "1. open": "116.8500",
        "2. high": "117.5600",
        "3. low": "116.1400",
        "4. close": "117.5600",
        "5. volume": "14453100",
      },
      "2023-05-11": {
        "1. open": "116.8500",
        "2. high": "117.5600",
        "3. low": "116.1400",
        "4. close": "116.8500",
        "5. volume": "15868300",
      },
      "2023-05-10": {
        "1. open": "116.8500",
        "2. high": "117.5600",
        "3. low": "116.1400",
        "4. close": "116.8500",
        "5. volume": "15868300",
      },
      "2023-05-09": {
        "1. open": "116.1400",
        "2. high": "116.8500",
        "3. low": "115.4300",
        "4. close": "116.1400",
        "5. volume": "15868300",
      },
      "2023-05-08": {
        "1. open": "116.1400",
        "2. high": "116.8500",
        "3. low": "115.4300",
        "4. close": "116.1400",
        "5. volume": "15868300",
      },
      "2023-05-05": {
        "1. open": "114.7200",
        "2. high": "116.1400",
        "3. low": "114.7200",
        "4. close": "116.1400",
        "5. volume": "19791100",
      },
      "2023-05-04": {
        "1. open": "114.0100",
        "2. high": "114.7200",
        "3. low": "113.3000",
        "4. close": "114.0100",
        "5. volume": "15868300",
      },
      "2023-05-03": {
        "1. open": "114.0100",
        "2. high": "114.7200",
        "3. low": "113.3000",
        "4. close": "114.0100",
        "5. volume": "15868300",
      },
      "2023-05-02": {
        "1. open": "114.0100",
        "2. high": "114.7200",
        "3. low": "113.3000",
        "4. close": "114.0100",
        "5. volume": "15868300",
      },
      "2023-05-01": {
        "1. open": "114.0100",
        "2. high": "114.7200",
        "3. low": "113.3000",
        "4. close": "114.0100",
        "5. volume": "15868300",
      },
      "2023-04-28": {
        "1. open": "112.5900",
        "2. high": "114.0100",
        "3. low": "112.5900",
        "4. close": "114.0100",
        "5. volume": "19791100",
      },
    },
  },
  AMZN: {
    "Meta Data": {
      "1. Information": "Daily Prices (open, high, low, close) and Volumes",
      "2. Symbol": "AMZN",
      "3. Last Refreshed": "2023-06-09",
      "4. Output Size": "Compact",
      "5. Time Zone": "US/Eastern",
    },
    "Time Series (Daily)": {
      "2023-06-09": {
        "1. open": "126.0000",
        "2. high": "127.3600",
        "3. low": "125.4400",
        "4. close": "126.6600",
        "5. volume": "44618700",
      },
      "2023-06-08": {
        "1. open": "124.2400",
        "2. high": "126.3900",
        "3. low": "124.1500",
        "4. close": "126.3200",
        "5. volume": "44618700",
      },
      "2023-06-07": {
        "1. open": "124.4000",
        "2. high": "124.6900",
        "3. low": "122.7700",
        "4. close": "123.4300",
        "5. volume": "44618700",
      },
      "2023-06-06": {
        "1. open": "124.8300",
        "2. high": "125.8000",
        "3. low": "123.9500",
        "4. close": "124.2500",
        "5. volume": "44618700",
      },
      "2023-06-05": {
        "1. open": "124.9400",
        "2. high": "126.9900",
        "3. low": "124.3900",
        "4. close": "126.5700",
        "5. volume": "44618700",
      },
      "2023-06-02": {
        "1. open": "122.1000",
        "2. high": "125.8000",
        "3. low": "121.8300",
        "4. close": "124.2500",
        "5. volume": "44618700",
      },
      "2023-06-01": {
        "1. open": "120.5800",
        "2. high": "122.9200",
        "3. low": "120.5500",
        "4. close": "122.7700",
        "5. volume": "44618700",
      },
      "2023-05-31": {
        "1. open": "120.5800",
        "2. high": "122.9200",
        "3. low": "120.5500",
        "4. close": "120.5800",
        "5. volume": "44618700",
      },
      "2023-05-30": {
        "1. open": "120.5800",
        "2. high": "122.9200",
        "3. low": "120.5500",
        "4. close": "120.5800",
        "5. volume": "44618700",
      },
      "2023-05-26": {
        "1. open": "116.8600",
        "2. high": "120.5800",
        "3. low": "116.8600",
        "4. close": "120.5800",
        "5. volume": "44618700",
      },
      "2023-05-25": {
        "1. open": "116.8600",
        "2. high": "118.7200",
        "3. low": "116.8600",
        "4. close": "116.8600",
        "5. volume": "44618700",
      },
      "2023-05-24": {
        "1. open": "115.0000",
        "2. high": "116.8600",
        "3. low": "115.0000",
        "4. close": "116.8600",
        "5. volume": "44618700",
      },
      "2023-05-23": {
        "1. open": "115.0000",
        "2. high": "116.8600",
        "3. low": "115.0000",
        "4. close": "115.0000",
        "5. volume": "44618700",
      },
      "2023-05-22": {
        "1. open": "115.0000",
        "2. high": "116.8600",
        "3. low": "115.0000",
        "4. close": "115.0000",
        "5. volume": "44618700",
      },
      "2023-05-19": {
        "1. open": "115.0000",
        "2. high": "116.8600",
        "3. low": "115.0000",
        "4. close": "115.0000",
        "5. volume": "44618700",
      },
      "2023-05-18": {
        "1. open": "113.1400",
        "2. high": "115.0000",
        "3. low": "113.1400",
        "4. close": "115.0000",
        "5. volume": "44618700",
      },
      "2023-05-17": {
        "1. open": "113.1400",
        "2. high": "115.0000",
        "3. low": "113.1400",
        "4. close": "113.1400",
        "5. volume": "44618700",
      },
      "2023-05-16": {
        "1. open": "113.1400",
        "2. high": "115.0000",
        "3. low": "113.1400",
        "4. close": "113.1400",
        "5. volume": "44618700",
      },
      "2023-05-15": {
        "1. open": "111.2800",
        "2. high": "113.1400",
        "3. low": "111.2800",
        "4. close": "113.1400",
        "5. volume": "44618700",
      },
      "2023-05-12": {
        "1. open": "111.2800",
        "2. high": "113.1400",
        "3. low": "111.2800",
        "4. close": "111.2800",
        "5. volume": "44618700",
      },
      "2023-05-11": {
        "1. open": "111.2800",
        "2. high": "113.1400",
        "3. low": "111.2800",
        "4. close": "111.2800",
        "5. volume": "44618700",
      },
      "2023-05-10": {
        "1. open": "111.2800",
        "2. high": "113.1400",
        "3. low": "111.2800",
        "4. close": "111.2800",
        "5. volume": "44618700",
      },
      "2023-05-09": {
        "1. open": "109.4200",
        "2. high": "111.2800",
        "3. low": "109.4200",
        "4. close": "111.2800",
        "5. volume": "44618700",
      },
      "2023-05-08": {
        "1. open": "109.4200",
        "2. high": "111.2800",
        "3. low": "109.4200",
        "4. close": "109.4200",
        "5. volume": "44618700",
      },
      "2023-05-05": {
        "1. open": "107.5600",
        "2. high": "109.4200",
        "3. low": "107.5600",
        "4. close": "109.4200",
        "5. volume": "44618700",
      },
      "2023-05-04": {
        "1. open": "107.5600",
        "2. high": "109.4200",
        "3. low": "107.5600",
        "4. close": "107.5600",
        "5. volume": "44618700",
      },
      "2023-05-03": {
        "1. open": "107.5600",
        "2. high": "109.4200",
        "3. low": "107.5600",
        "4. close": "107.5600",
        "5. volume": "44618700",
      },
      "2023-05-02": {
        "1. open": "107.5600",
        "2. high": "109.4200",
        "3. low": "107.5600",
        "4. close": "107.5600",
        "5. volume": "44618700",
      },
      "2023-05-01": {
        "1. open": "107.5600",
        "2. high": "109.4200",
        "3. low": "107.5600",
        "4. close": "107.5600",
        "5. volume": "44618700",
      },
      "2023-04-28": {
        "1. open": "105.7000",
        "2. high": "107.5600",
        "3. low": "105.7000",
        "4. close": "107.5600",
        "5. volume": "44618700",
      },
    },
  },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const stock1 = searchParams.get("stock1")
  const stock2 = searchParams.get("stock2")
  const timeframe = searchParams.get("timeframe")

  if (!stock1 || !stock2) {
    return NextResponse.json({ error: "Stock symbols are required" }, { status: 400 })
  }

  try {
    // Try to fetch data from Alpha Vantage API or use sample data
    let stock1Data, stock2Data
    let usingSampleData = false

    try {
      // Try to fetch from API first
      const [stock1Response, stock2Response] = await Promise.all([fetchStockData(stock1), fetchStockData(stock2)])

      stock1Data = stock1Response
      stock2Data = stock2Response

      // Validate the API response
      if (!stock1Data["Time Series (Daily)"] || !stock2Data["Time Series (Daily)"]) {
        throw new Error("Invalid API response format")
      }
    } catch (apiError) {
      console.error("API fetch failed, using sample data:", apiError)

      // Fall back to sample data if API fails
      usingSampleData = true

      // Use sample data for the requested stocks or default to AAPL/MSFT
      stock1Data = SAMPLE_DATA[stock1.toUpperCase()] || SAMPLE_DATA["AAPL"]
      stock2Data = SAMPLE_DATA[stock2.toUpperCase()] || SAMPLE_DATA["MSFT"]
    }

    // Process and normalize the data for comparison
    const processedData = processStockData(stock1Data, stock2Data, stock1, stock2, timeframe)

    // Add flag to indicate if we're using sample data
    return NextResponse.json({
      data: processedData,
      usingSampleData,
    })
  } catch (error) {
    console.error("Error processing stock data:", error)
    return NextResponse.json(
      {
        error: "Failed to process stock data. Please try different symbols.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function fetchStockData(symbol: string) {
  // Using Alpha Vantage API
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`

  try {
    const response = await fetch(url, {
      cache: "no-store", // Disable caching to avoid stale data
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`)
    }

    const data = await response.json()

    // Check if the API returned an error message
    if (data.hasOwnProperty("Error Message")) {
      throw new Error(`API error: ${data["Error Message"]}`)
    }

    // Check if we got rate limited
    if (data.hasOwnProperty("Note") && data["Note"].includes("API call frequency")) {
      throw new Error("API rate limit exceeded")
    }

    return data
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error)
    throw error
  }
}

function processStockData(data1: any, data2: any, symbol1: string, symbol2: string, timeframe: string | null) {
  try {
    // Extract time series data
    const timeSeries1 = data1["Time Series (Daily)"] || {}
    const timeSeries2 = data2["Time Series (Daily)"] || {}

    // Get dates from both datasets
    const dates1 = Object.keys(timeSeries1)
    const dates2 = Object.keys(timeSeries2)

    if (dates1.length === 0 || dates2.length === 0) {
      throw new Error("No data available for one or both stocks")
    }

    // Find common dates between both datasets
    const commonDates = dates1.filter((date) => dates2.includes(date))

    if (commonDates.length === 0) {
      throw new Error("No common dates found between the two stocks")
    }

    // Sort dates in ascending order
    commonDates.sort()

    // Limit data based on timeframe
    const limitedDates = limitDatesByTimeframe(commonDates, timeframe)

    if (limitedDates.length === 0) {
      throw new Error("No data available for the selected timeframe")
    }

    // Get the first closing prices to normalize
    const firstClose1 = Number.parseFloat(timeSeries1[limitedDates[0]]["4. close"])
    const firstClose2 = Number.parseFloat(timeSeries2[limitedDates[0]]["4. close"])

    if (isNaN(firstClose1) || isNaN(firstClose2)) {
      throw new Error("Invalid closing price data")
    }

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
  } catch (error) {
    console.error("Error processing stock data:", error)
    throw error
  }
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
