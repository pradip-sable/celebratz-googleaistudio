/**
 * Utility helpers to construct Google Maps search and directions URLs
 * compatible with web browsers, Google Maps Android app, and iOS Google Maps app.
 */

export interface LocationIdentifiable {
  title?: string;
  address?: string;
  locality?: string;
  city?: string;
  googleMapsUrl?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Builds a search / place view URL in Google Maps
 */
export function getGoogleMapsSearchUrl(item: LocationIdentifiable): string {
  if (item.googleMapsUrl && item.googleMapsUrl.trim().length > 0) {
    return item.googleMapsUrl.trim();
  }

  if (item.coordinates && item.coordinates.lat && item.coordinates.lng) {
    return `https://www.google.com/maps/search/?api=1&query=${item.coordinates.lat},${item.coordinates.lng}`;
  }

  const queryParts = [
    item.title,
    item.address || item.locality,
    item.city || 'Pune',
    'Maharashtra'
  ].filter(Boolean);

  const query = queryParts.join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Builds a navigation / directions URL in Google Maps
 */
export function getGoogleMapsDirectionsUrl(item: LocationIdentifiable): string {
  if (item.coordinates && item.coordinates.lat && item.coordinates.lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${item.coordinates.lat},${item.coordinates.lng}`;
  }

  const queryParts = [
    item.title,
    item.address || item.locality,
    item.city || 'Pune',
    'Maharashtra'
  ].filter(Boolean);

  const destination = queryParts.join(', ');
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

/**
 * Open location in Google Maps (opens native Google Maps app on mobile or new tab in desktop)
 */
export function openGoogleMaps(item: LocationIdentifiable, mode: 'view' | 'directions' = 'view'): void {
  const url = mode === 'directions' ? getGoogleMapsDirectionsUrl(item) : getGoogleMapsSearchUrl(item);
  window.open(url, '_blank', 'noopener,noreferrer');
}
