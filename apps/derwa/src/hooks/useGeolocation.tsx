import { useQuery } from '@tanstack/react-query'

export const useGeolocation = () => {
  return useQuery({
    queryKey: ['geolocation'],
    queryFn: () => fetch('https://ipapi.co/json/').then((res) => res.json()),
  })
}
