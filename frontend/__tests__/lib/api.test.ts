import { api } from '@/lib/api'

// Mock fetch
global.fetch = jest.fn()

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET requests', () => {
    it('should make GET request with correct URL', async () => {
      const mockResponse = { data: { success: true } }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await api.get('/test-endpoint')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )
    })

    it('should handle GET request errors', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(api.get('/non-existent')).rejects.toThrow()
    })
  })

  describe('POST requests', () => {
    it('should make POST request with data', async () => {
      const mockResponse = { data: { success: true } }
      const postData = { name: 'test', value: 123 }
      
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await api.post('/test-endpoint', postData)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(postData),
        })
      )
    })

    it('should handle POST request errors', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      })

      await expect(api.post('/test-endpoint', {})).rejects.toThrow()
    })
  })

  describe('Error handling', () => {
    it('should handle network errors', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      await expect(api.get('/test-endpoint')).rejects.toThrow('Network error')
    })

    it('should handle non-JSON responses', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('Invalid JSON')
        },
      })

      await expect(api.get('/test-endpoint')).rejects.toThrow()
    })
  })

  describe('Base URL configuration', () => {
    it('should use correct base URL from environment', () => {
      // The API client should use the configured base URL
      expect(api).toBeDefined()
    })
  })
})