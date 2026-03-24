export interface FeatureCollection {
  type: 'FeatureCollection'
  features: Pickup[]
}

export interface Pickup {
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
  properties: {
    brand: string
    opening_hours: string
    operator: string
  }
}
