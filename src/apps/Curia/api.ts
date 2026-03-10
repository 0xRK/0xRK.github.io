import type { CuriaEvent } from './utils/icsGenerator'

const CATEGORY_SIGNALS = [
  { keywords: ['technology', 'coding', 'programming', 'software', 'computer', 'hackathon', 'ai ', 'artificial intelligence', 'machine learning', 'data science', 'engineering', 'stem', 'robot', 'cyber', 'web', 'cloud', 'mobile', 'app'], category: 'technology' },
  { keywords: ['music', 'concert', 'jazz', 'band', 'orchestra', 'choir', 'symphony', 'opera', 'recital', 'performance', 'live music', 'rap', 'hip hop', 'r&b'], category: 'music' },
  { keywords: ['sport', 'athletic', 'game', 'basketball', 'football', 'soccer', 'volleyball', 'baseball', 'softball', 'swim', 'running', 'track', 'golf', 'tennis', 'wrestling', 'husker', 'rec center', 'fitness'], category: 'sports' },
  { keywords: ['food', 'dinner', 'lunch', 'breakfast', 'brunch', 'meal', 'pizza', 'cook', 'culinary', 'beverage', 'beer', 'wine', 'dining', 'taste', 'baking', 'potluck'], category: 'food' },
  { keywords: ['art', 'gallery', 'exhibit', 'museum', 'theater', 'theatre', 'film', 'movie', 'cinema', 'dance', 'painting', 'sculpture', 'photography', 'comedy', 'poetry', 'literary', 'drama', 'ross movie', 'visual arts'], category: 'arts' },
  { keywords: ['community', 'volunteer', 'service', 'charity', 'nonprofit', 'diversity', 'inclusion', 'culture', 'cultural', 'multicultural', 'international', 'greek', 'student org', 'club', 'sustainability', 'environment', 'garden'], category: 'community' },
  { keywords: ['health', 'wellness', 'yoga', 'meditation', 'mental health', 'fitness', 'nutrition', 'medical', 'nursing', 'healthcare', 'mindfulness', 'gym'], category: 'health' },
  { keywords: ['lecture', 'seminar', 'workshop', 'conference', 'academic', 'research', 'education', 'career', 'networking', 'internship', 'job fair', 'resume', 'startup', 'business', 'leadership', 'colloquium', 'symposium', 'dissertation'], category: 'education' },
]

interface RawEvent {
  title: string
  description?: string
  group?: string
  start?: string
  end?: string
  location?: string
  image_url?: string
  url?: string
  source: string
  audience?: string[]
}

function inferCategory(event: RawEvent) {
  const text = `${event.title} ${event.description ?? ''} ${event.group ?? ''}`.toLowerCase()

  if (event.group === 'Ross Movie') return 'arts'

  let bestCategory: string | null = null
  let bestScore = 0

  for (const { keywords, category } of CATEGORY_SIGNALS) {
    const score = keywords.reduce((sum, kw) => sum + (text.includes(kw) ? 1 : 0), 0)
    if (score > bestScore) {
      bestScore = score
      bestCategory = category
    }
  }

  return bestCategory ?? 'community'
}

function parseIsoDate(iso?: string) {
  if (!iso) return { date: null, time: null }
  const [datePart, timePart] = iso.split('T')
  const time = timePart ? timePart.slice(0, 5) : null
  return { date: datePart, time }
}

let cachedEvents: CuriaEvent[] | null = null

export async function loadEvents(): Promise<CuriaEvent[]> {
  if (cachedEvents) return cachedEvents

  const res = await fetch('/curia/events.json')
  if (!res.ok) throw new Error(`Failed to load events: ${res.status}`)
  const data = await res.json()

  cachedEvents = data.events.map((ev: RawEvent, idx: number): CuriaEvent => {
    const { date: startDate, time: startTime } = parseIsoDate(ev.start)
    const { date: endDate, time: endTime } = parseIsoDate(ev.end)
    const category = inferCategory(ev)

    const venueFull = ev.location ?? ''
    const venue = venueFull.split(' Room:')[0].split('-').slice(0, 2).join(' - ') || venueFull

    return {
      id: idx,
      name: ev.title,
      description: ev.description ?? '',
      date: startDate,
      time: startTime,
      endDate: endDate,
      endTime: endTime,
      venue: venue || 'UNL Campus',
      location: 'Lincoln, NE',
      category,
      tags: [],
      imageUrl: ev.image_url ?? null,
      url: ev.url ?? null,
      price: null,
      groupCount: 0,
      source: ev.source,
      audience: ev.audience ?? [],
    }
  })

  return cachedEvents!
}
