export interface CuriaUser {
  id: string
  name: string
}

export interface GroupMember {
  id: string
  name: string
}

export interface GroupMessage {
  authorId: string
  authorName: string
  body: string
  ts: number
}

export interface CuriaGroup {
  id: string
  eventId: number
  name: string
  description: string
  capacity: number
  vibes: string[]
  meetupDetails: string
  creatorId: string
  creatorName: string
  members: GroupMember[]
  messages: GroupMessage[]
  ts: number
}

export function getUser(): CuriaUser {
  let user: CuriaUser | null = null
  try { user = JSON.parse(localStorage.getItem('curia_user')!) } catch { /* empty */ }
  if (!user) {
    const id = Math.random().toString(36).slice(2, 8).toUpperCase()
    user = { id, name: `Guest_${id}` }
    localStorage.setItem('curia_user', JSON.stringify(user))
  }
  return user
}

const SEED_GROUPS = [
  {
    eventId: null as number | null,
    name: "Let's go together!",
    description: 'Anyone want to meet up before and walk over together?',
    capacity: 5,
    vibes: ['casual', 'friendly'],
    meetupDetails: 'Meet at the Union front entrance at 15 min before start',
    creatorId: 'SEED01',
    creatorName: 'Husker Fan',
    members: [{ id: 'SEED01', name: 'Husker Fan' }, { id: 'SEED02', name: 'StudyBuddy' }],
    messages: [
      { authorId: 'SEED01', authorName: 'Husker Fan', body: 'Hey everyone, excited for this!', ts: Date.now() - 3600000 },
      { authorId: 'SEED02', authorName: 'StudyBuddy', body: 'Me too! See you there', ts: Date.now() - 1800000 },
    ],
  },
]

function loadAll(): Record<string, CuriaGroup[]> {
  try { return JSON.parse(localStorage.getItem('curia_groups')!) ?? {} } catch { return {} }
}

function saveAll(data: Record<string, CuriaGroup[]>) {
  localStorage.setItem('curia_groups', JSON.stringify(data))
}

function nextId() {
  return `g_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
}

export function getAllGroupCounts(): Record<string, number> {
  const all = loadAll()
  const counts: Record<string, number> = {}
  for (const [eventId, groups] of Object.entries(all)) {
    counts[eventId] = Array.isArray(groups) ? groups.length : 0
  }
  return counts
}

export function getGroups(eventId: number): CuriaGroup[] {
  const all = loadAll()
  const groups = all[eventId] ?? []

  if (groups.length === 0) {
    const seed: CuriaGroup = {
      ...SEED_GROUPS[0],
      id: nextId(),
      eventId,
      ts: Date.now() - 7200000,
    }
    all[eventId] = [seed]
    saveAll(all)
    return [seed]
  }

  return groups
}

export function createGroup(eventId: number, opts: { name: string; description: string; capacity: number; vibes: string[]; meetupDetails: string }): CuriaGroup {
  const user = getUser()
  const all = loadAll()
  const groups = all[eventId] ?? []

  const group: CuriaGroup = {
    id: nextId(),
    eventId,
    name: opts.name,
    description: opts.description,
    capacity: Number(opts.capacity) || 8,
    vibes: opts.vibes ?? [],
    meetupDetails: opts.meetupDetails ?? '',
    creatorId: user.id,
    creatorName: user.name,
    members: [{ id: user.id, name: user.name }],
    messages: [],
    ts: Date.now(),
  }

  all[eventId] = [group, ...groups]
  saveAll(all)
  return group
}

export function joinGroup(eventId: number, groupId: string): CuriaGroup | null {
  const user = getUser()
  const all = loadAll()
  const groups = all[eventId] ?? []
  const idx = groups.findIndex(g => g.id === groupId)
  if (idx === -1) return null

  const group = groups[idx]
  if (group.members.some(m => m.id === user.id)) return group
  if (group.members.length >= group.capacity) throw new Error('Group is full')

  group.members = [...group.members, { id: user.id, name: user.name }]
  saveAll(all)
  return group
}

export function leaveGroup(eventId: number, groupId: string) {
  const user = getUser()
  const all = loadAll()
  const groups = all[eventId] ?? []
  const idx = groups.findIndex(g => g.id === groupId)
  if (idx === -1) return

  const group = groups[idx]
  group.members = group.members.filter(m => m.id !== user.id)

  if (group.creatorId === user.id && group.members.length === 0) {
    all[eventId] = groups.filter(g => g.id !== groupId)
  }

  saveAll(all)
}

export function deleteGroup(eventId: number, groupId: string) {
  const all = loadAll()
  all[eventId] = (all[eventId] ?? []).filter(g => g.id !== groupId)
  saveAll(all)
}

export function getMessages(eventId: number, groupId: string): GroupMessage[] {
  const all = loadAll()
  const group = (all[eventId] ?? []).find(g => g.id === groupId)
  return group?.messages ?? []
}

export function postMessage(eventId: number, groupId: string, body: string): GroupMessage | null {
  const user = getUser()
  const all = loadAll()
  const groups = all[eventId] ?? []
  const group = groups.find(g => g.id === groupId)
  if (!group) return null

  const msg: GroupMessage = { authorId: user.id, authorName: user.name, body, ts: Date.now() }
  group.messages = [...(group.messages ?? []), msg]
  saveAll(all)
  return msg
}

export function isMember(group: CuriaGroup): boolean {
  const user = getUser()
  return group.members.some(m => m.id === user.id)
}

export function isCreator(group: CuriaGroup): boolean {
  const user = getUser()
  return group.creatorId === user.id
}
