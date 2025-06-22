import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class YoutubeService {
  private apiKey = 'AIzaSyBm7Nd_mAhj52KJT9EY5l3_Owq-V-aYdw4';
  private apiUrl = 'https://www.googleapis.com/youtube/v3/search';

  constructor(private http: HttpClient) {}

  getVideosPorBusqueda(termino: string, maxResults: number = 6) {
    const params = new HttpParams()
      .set('part', 'snippet')
      .set('q', termino)
      .set('type', 'video')
      .set('key', this.apiKey)
      .set('maxResults', maxResults)
      .set('regionCode', 'MX');

    return this.http.get(this.apiUrl, { params });
  }

  getVideosPopulares(maxResults: number = 6) {
  const params = new HttpParams()
    .set('part', 'snippet')
    .set('chart', 'mostPopular')
    .set('regionCode', 'MX')
    .set('maxResults', maxResults)
    .set('key', this.apiKey);

  return this.http.get('https://www.googleapis.com/youtube/v3/videos', { params });
}

}
