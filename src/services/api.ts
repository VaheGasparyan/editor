class OfflineApiService {
  getFonts(): Promise<any[]> {
    return Promise.resolve([
      {
        name: "Arial",
        url: "", // You can later preload a .woff2 file if needed
      },
    ])
  }

  getUploads(): Promise<any[]> {
    return Promise.resolve([])
  }

  getPixabayResources(): Promise<any[]> {
    return Promise.resolve([])
  }

  getTemplates(): Promise<any[]> {
    return Promise.resolve([])
  }

  getCreations(): Promise<any[]> {
    return Promise.resolve([])
  }

  getElements(): Promise<any[]> {
    return Promise.resolve([])
  }
}

export default new OfflineApiService()
