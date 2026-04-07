import { mapping } from '../data/mapping'
import { places } from '../data/places_full'

export const FEATURED_EVENT_IDS = [7, 2, 10, 8, 9, 1, 3, 6, 5]

const categoryImages = {
  food: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
  culture: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80',
  community: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
  volunteer: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80',
  workshop: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80',
  default: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80',
}

const eventImageOverrides = {
  1: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
  2: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
  3: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
  5: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80',
  6: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
  7: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
  8: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80',
  9: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
  10: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1200&q=80',
}

function extractCategory(event) {
  return String(event?.event_category || event?.event_setting || 'default').toLowerCase()
}

export function getEventDisplayType(event) {
  const title = String(event?.title || '').toLowerCase()
  const setting = String(event?.event_setting || '').toLowerCase()

  if (title.includes('supper club')) return 'Supper Club'
  if (title.includes('pizza') || title.includes('pasta')) return 'Cooking Workshop'
  if (title.includes('cookery') || title.includes('cooking') || setting.includes('class')) return 'Cooking Class'
  if (title.includes('seafood') || title.includes('meal')) return 'Community Meal'
  if (setting.includes('workshop')) return 'Workshop'
  if (extractCategory(event).includes('culture')) return 'Culture'
  return 'Food Event'
}

export function getEventImage(event) {
  const directImage = typeof event?.image === 'string' && event.image.startsWith('http') ? event.image : null
  if (directImage) return directImage

  if (event?.event_id in eventImageOverrides) return eventImageOverrides[event.event_id]

  const category = extractCategory(event)
  if (category.includes('food')) return categoryImages.food
  if (category.includes('culture')) return categoryImages.culture
  if (category.includes('volunteer')) return categoryImages.volunteer
  if (category.includes('workshop') || category.includes('class')) return categoryImages.workshop
  if (category.includes('community')) return categoryImages.community
  return categoryImages.default
}

export function getMappedPlace(event) {
  if (!event) return null
  const directPlaceId = event.place_id
  if (directPlaceId) {
    return places.find((place) => String(place.place_id) === String(directPlaceId)) || null
  }
  const mapped = mapping.find((row) => String(row.event_id) === String(event.event_id))
  if (!mapped) return null
  return places.find((place) => String(place.place_id) === String(mapped.place_id)) || null
}

export function getEventLocation(event) {
  const mappedPlace = getMappedPlace(event)
  if (mappedPlace) {
    const borough = mappedPlace.meta?.card_borough
    const postcode = mappedPlace.meta?.card_postcode
    return {
      name: mappedPlace.card_name,
      subtitle: [borough, postcode].filter(Boolean).join(' · '),
      placeId: mappedPlace.place_id,
    }
  }

  return {
    name: event?.location_text || event?.venue || 'Location to be confirmed',
    subtitle: event?.postcode || '',
    placeId: null,
  }
}

export function getEventDateLabel(event) {
  const raw = event?.start_time
  if (!raw || raw === 'unknown' || raw === 'TBC') return 'TBC'
  return raw
}

export function getEventShortDescription(event, max = 130) {
  const text = (event?.description || 'No description available.').trim()
  if (text.length <= max) return text
  return `${text.slice(0, max).trim()}…`
}

export function formatPlaceOptionLabel(place) {
  const postcode = place?.meta?.card_postcode
  const subtype = place?.space_subtype_v2?.replaceAll('_', ' ')
  return [place?.card_name, postcode, subtype].filter(Boolean).join(' · ')
}
