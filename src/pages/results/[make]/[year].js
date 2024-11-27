'use client'

import { useRouter } from 'next/router'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Loader2, AlertCircle, Car } from 'lucide-react'

export default function Result() {
  const router = useRouter()
  const { makeId, year } = router.query

  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch vehicle models based on make and year
  useEffect(() => {
    if (!makeId || !year) return  // Avoid making the request if makeId or year are empty

    const fetchModels = async () => {
      try {
        setLoading(true)
        console.log(makeId, year)
        const response = await axios.get(
          `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
        )
        setModels(response.data.Results)
      } catch (err) {
        setError("Error fetching vehicle models.")
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [makeId, year])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center">
        <AlertCircle className="w-6 h-6 mr-2" />
        <p>{error}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 text-center">
          Vehicle Models for {makeId} - {year}
        </h1>

        {models.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {models.map((model, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                <Car className="w-8 h-8 text-blue-500 mb-2" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{model.ModelName}</h2>
                <p className="text-gray-600">Make: {model.MakeName}</p>
                <p className="text-gray-600">Year: {year}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
            <p>No models found for {makeId} in {year}.</p>
          </div>
        )}
      </div>
    </div>
  )
}