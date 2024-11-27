'use client'
import { Search, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'

export default function Home() {
  const [makes, setMakes] = useState([]) // To store vehicle makes
  const [modelYears, setModelYears] = useState([]) // To store model years
  const [selectedMake, setSelectedMake] = useState('') // To track the selected make
  const [selectedYear, setSelectedYear] = useState('') // To track the selected model year
  const [filter, setFilter] = useState('') // To store search filter text

  // Fetch vehicle makes from NHTSA API
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const response = await axios.get(
          'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json'
        )
        setMakes(response.data.Results)
      } catch (error) {
        console.error("Error fetching vehicle makes:", error)
      }
    }

    fetchMakes()
  }, [])

  // Generate model years from 2015 to the current year
  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = 2015; year <= currentYear; year++) {
      years.push(year)
    }
    setModelYears(years)
  }, [])

  const handleMakeChange = (e) => {
    setSelectedMake(e.target.value)
  }

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value)
  }

  // update and search vehicule makes
  const handleSearch = () => {
    const lowercasedFilter = filter.toLowerCase()

    const foundMake = makes.find(make => 
      make.MakeName.toLowerCase().includes(lowercasedFilter)
    )
    if (foundMake) {
      setSelectedMake(foundMake.MakeName)
    }
  }
  // Check if both make and year are selected to enable the Next button
  const isNextButtonEnabled = selectedMake && selectedYear

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Find Your Vehicle</h1>

        <div className="relative">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search..."
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Make
            </label>
            <select
              id="make"
              value={selectedMake}
              onChange={handleMakeChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a Make</option>
              {makes.map((make, index) => (
                <option key={make.MakeID || index} value={make.MakeName}>
                  {make.MakeName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Model Year
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={handleYearChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a Year</option>
              {modelYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4">
          <Link
            href={isNextButtonEnabled ? `/results/${selectedMake}/${selectedYear}` : '#'}
            className={`w-full flex items-center justify-center p-3 rounded-lg text-white font-medium transition-all duration-200 ${
              isNextButtonEnabled
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            aria-disabled={!isNextButtonEnabled}
          >
            Next
            <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}