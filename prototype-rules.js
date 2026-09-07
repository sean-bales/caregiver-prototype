// Business data for the clickable prototype: surfaces, situations, and layer-one click rules.
export const SURFACES = {
  today:    { phone: 'Today',    desktop: 'Today desktop',    label: 'Today',            base: 'F1',  tab: 'today' },
  compose:  { phone: 'Compose',  desktop: 'Compose desktop',  label: 'Compose',          base: 'C1',  tab: 'today' },
  device:   { phone: 'Device',   desktop: 'Device desktop',   label: 'Device',           base: 'D1',  tab: null },
  chapters: { phone: 'Chapters', desktop: 'Chapters desktop', label: 'Story · Chapters', base: 'S1',  tab: 'story' },
  photos:   { phone: 'Photos',   desktop: 'Photos desktop',   label: 'Story · Photos',   base: 'P1',  tab: 'story' },
  profile:  { phone: 'Profile',  desktop: 'Profile desktop',  label: 'Profile',          base: 'PR1', tab: 'profile' },
  settings: { phone: 'Settings', desktop: 'Settings desktop', label: 'Settings',         base: 'S1',  tab: 'settings' },
  auth:     { phone: 'Auth',     desktop: 'Auth desktop',     label: 'Auth',             base: 'A1',  tab: null },
  admin:    { phone: 'Admin',    desktop: 'Admin desktop',    label: 'Admin',            base: 'AD1', tab: null },
  public:   { phone: 'Public',   desktop: 'Public desktop',   label: 'Public',           base: 'P1',  tab: null }
};
export const ORDER = ['today', 'compose', 'device', 'chapters', 'photos', 'profile', 'settings', 'auth', 'admin', 'public'];
export const TABS = { today: 'today', story: 'chapters', profile: 'profile', settings: 'settings' };

// Situation groups. Each option maps surface -> frame. `null` frames mean "base".
export const SITUATIONS = [
  { key: 'device', title: 'Device', options: [
    { id: 'online',  label: 'Online', frames: {} },
    { id: 'offline', label: 'Offline since 9:12 AM', frames: { today: '5', device: 'D5' } },
    { id: 'never',   label: 'Never seen', frames: { today: '12', device: 'D12' } }
  ] },
  { key: 'schedule', title: 'Schedule', options: [
    { id: 'off', label: 'Off', frames: {} },
    { id: 'on',  label: 'On', frames: { today: '4', device: 'D8' } }
  ] },
  { key: 'app', title: 'App connection', options: [
    { id: 'online',  label: 'Online', frames: {} },
    { id: 'offline', label: 'App offline', frames: { today: '6', compose: 'C11a' } }
  ] },
  { key: 'session', title: 'Session', options: [
    { id: 'live',  label: 'Live', frames: {} },
    { id: 'ended', label: 'Ended', frames: { today: '7', device: 'D14', compose: 'C11e', settings: 'S14', admin: 'AD20', auth: 'A18' } }
  ] },
  { key: 'texts', title: 'Texts', options: [
    { id: 'off',    label: 'Off', frames: {} },
    { id: 'on',     label: 'On', frames: { settings: 'S2', public: 'P8' } },
    { id: 'opted',  label: 'Opted out by text', frames: { settings: 'S8' } },
    { id: 'notset', label: 'Not set up on the server', frames: { settings: 'S9', public: 'P10' } },
    { id: 'viewer', label: 'Viewer role', frames: { settings: 'S11', public: 'P9' } }
  ] },
  { key: 'who', title: 'Signed in as', options: [
    { id: 'alex',  label: 'Alex Morgan', frames: {} },
    { id: 'out',   label: 'Signed out', frames: { auth: 'A1', public: 'P1' } },
    { id: 'admin', label: 'The administrator', frames: { admin: 'AD1', public: 'P16' } }
  ] }
];
export const DEFAULT_SITUATION = { device: 'online', schedule: 'off', app: 'online', session: 'live', texts: 'off', who: 'alex' };

// Frames that layer one cannot reach and the situation lists do not name; the switcher's This screen list covers them.
export function frameForSituation(surface, situation) {
  for (const g of SITUATIONS) {
    const opt = g.options.find(o => o.id === situation[g.key]);
    if (opt && opt.frames[surface]) return opt.frames[surface];
  }
  return null;
}
export function situationForFrame(surface, frame) {
  const s = { ...DEFAULT_SITUATION };
  for (const g of SITUATIONS) for (const o of g.options) if (o.frames[surface] === frame) s[g.key] = o.id;
  return s;
}

// Click rules. [frames, label, target]. frames: '*' or comma list. label: string prefix (normalized) or RegExp or '*'.
// target: 'surface/frame' | 'frame' (same surface) | 'back' | 'tab:today' | 'push:device/D1' | 'gap:text' | function(ctx)
const R = {
  today: [
    ['F1,1,2,3,4,5,6,12,11,10b', 'send something', 'A3'],
    ['F1,1,2,3,11,10b', 'pause voice', 'A1'], ['F1,1,2,3,11,10b', 'night light', 'A1'],
    // Resting screen (A3 of the reconciliation brief): Wake screen and voice is a full wake; the Voice row has no button.
    ['4', 'wake screen and voice', 'A1 then F1'],
    ['A1', /pausing/, '4'], ['A1', /turning on/, 'A2'], ['A2', 'try again', 'A1'],
    ['A3', 'message', 'compose/C1'], ['A3', 'reminder', 'compose/C2'], ['A3', 'photo', 'compose/C3'], ['A3', 'cancel', 'F1'],
    ['*', 'mark all read', 'gap:Mark all read on this data has no accepted frame; state 3 shows the all-read case on the busy day.'],
    ['A4,A5', 'mark read', 'F1'], ['A4', 'today', 'F1'], ['A5', 'close', 'F1'],
    ['F1,1,2,3,4,5,11,10b', 'mark read', ctx => ctx.cardText.includes('About') ? 'A5' : 'A4'],
    ['*', 'mark done', 'A8'], ['*', 'skip tonight', 'gap:The skipped row after Skip tonight has no accepted frame; A8 shows the marked-done row.'], ['*', 'skip', 'A7'],
    ['A6', /remove today|remove reminder/, 'A9'], ['A6', 'stop repeating', 'A6b'], ['A6b', 'stop repeating', 'A10'], ['A9', 'remove reminder', 'A10'],
    ['A6,A6b,A7,A9,A11,A12', 'cancel', 'F1'],
    ['A11', 'open photo', 'A13'], ['A11', 'unpin', 'gap:Unpin has no accepted frame after the tap.'], ['A11', 'remove from the board', 'A12'],
    ['A12', 'remove from the board', 'gap:The board after Remove has no accepted frame; the toast is in the A19 catalogue ("Removed.").'],
    ['A13', '*', 'A14'], ['A14', 'close', 'F1'], ['A14', /options/, 'A11'],
    ['*', 'show me how', 'A15'], ['*', 'not now', 'F1'], ['A15,A16,A17', 'done', 'F1'], ['A16', 'install caregiver', 'gap:The phone\u2019s own install dialog is not drawn.'],
    ['7', 'sign in', 'auth/A18'], ['8', 'sign in', 'F1'], ['10b', 'try again', 'F1'], ['A18', 'try again', 'F1'],
    ['*', /options/, ctx => ctx.cardText.includes('posted') || ctx.cardText.includes('Message') || ctx.cardText.includes('Photo') ? 'A11' : 'A6'],
    ['F1,1,2,3,4,5', '*', ctx => {
      const t = ctx.cardText;
      if (!ctx.inCard) return null;
      if (t.includes('· read') || ctx.cardHas('Mark read')) return t.includes('About') ? 'A5' : 'A4';
      if (/Set for|Reminded|He said so|He pressed|ended|marked/.test(t)) return 'A6';
      if (/posted|not yet on his Companion/.test(t)) return 'A11';
      return null;
    }]
  ],
  compose: [
    ['C1,C2,C3,C4,C5,C6,C7,C8,C11a,C11b,C11c,C11d', /^message$/, 'C1'], ['C1,C2,C3,C4,C5,C6,C7,C8', /^reminder$/, 'C2'], ['C1,C2,C3,C4,C5,C6,C7,C8', /^photo$/, 'C3'],
    ['C1,C2,C3,C11f', 'cancel', 'today/F1'], ['C4,C5,C6,C7,C8,C11a,C11b,C11c,C11d', 'cancel', 'C12'],
    ['C12', 'discard', 'today/F1'], ['C12', 'keep writing', 'C4'],
    ['C4,C5,C11a,C11b', /^post/, 'C9a'], ['C7', /add reminder|save/, 'C9b'], ['C8,C11c', /^post|^send|^add/, 'C9c'], ['C8,C11f', 'change', 'C3'], ['C11f', /^post/, 'gap:Post is inactive on C11f; the HEIC refusal has to be cleared first (Change).'],
    ['C11a,C11c', 'try again', ctx => ctx.frame === 'C11c' ? 'C9c' : 'C9a'], ['C11e', 'sign in', 'auth/A18'],
    ['C9a', '*', 'C10a'], ['C9b', '*', 'C10b'], ['C9c', '*', 'C10c'],
    ['C6', 'done', 'C7'], ['C6', '*', 'C7'],
    ['C4', /keep/, 'C5'], ['C5', /keep/, 'C4'],
    ['C1', '*', 'C4'], ['C2', '*', 'C6'], ['C3', '*', 'C8'],
    ['C10a,C10b,C10c', '*', 'today/F1']
  ],
  device: [
    ['*', /^today$|^settings$|^story$|^profile$/, 'back'],
    ['D1,D13,D6,D7,D8,D8a,D9,D10,D11,D15', /^off$/, 'D2'], ['D2', '*', 'D3'], ['D3', /^wake/, 'D1'], ['D4', 'try again', 'D2'],
    ['*', 'pause voice', 'D6'], ['*', 'night light', 'D6'], ['D6', /^wake/, 'D1'],
    ['D15', 'try again', 'D7'],
    ['*', /schedule/, ctx => ctx.frame === 'D8' || ctx.frame === 'D8a' ? 'D1' : 'D8a'],
    ['*', /live|conversation/, ctx => ctx.frame === 'D10' || ctx.frame === 'D11' ? 'D9' : 'D10'],
    ['*', /speaker|volume|brightness|microphone|level/, 'D7']
  ],
  chapters: [
    ['*', /^photos$/, 'photos/P1'], ['*', /^chapters$/, 'S1'], ['*', /^story$|back to chapters/, 'S1'],
    ['S12', 'try again', 'S1'],
    ['S6', 'add a note', 'S8'], ['S7', 'edit', 'S8'], ['S8,S8b,S10', 'save', 'S9'], ['S8,S8b,S10', 'cancel', 'S7'], ['S10', 'try again', 'S9'],
    ['S1', '*', ctx => ctx.inCard ? 'S4' : null], ['S4,S5', '*', ctx => ctx.inCard ? 'S6' : null]
  ],
  photos: [
    ['*', /^chapters$/, 'chapters/S1'], ['*', /^photos$/, 'P1'], ['*', /^story$/, 'chapters/S1'],
    ['P1,P2,P16,P5,P5b,P14,P12,P13', 'add photo', 'P3'], ['P3', '*', 'P4'], ['P4', /^add|^cancel/, ctx => ctx.label.startsWith('cancel') ? 'P1' : 'P16'], ['P4', '*', 'P16'],
    ['P14', 'try again', 'P1'], ['P8', 'try again', 'P7'],
    ['P6,P7,P8,P8b,P10', 'send to his screen', 'P9'], ['P9,P9b', /^send/, 'P10'], ['P9,P9b', 'cancel', 'P6'],
    ['P6,P7,P8,P8b,P10', 'delete photo', 'P11'], ['P11', /^delete/, 'P1'], ['P11', /cancel|keep/, 'P6'],
    ['P6,P7,P8,P8b,P10', /^close$|^done$|^back$/, 'P1'], ['P6,P7,P8,P8b,P10', /options/, 'P11'],
    ['P1,P16,P5,P5b,P14', '*', ctx => ctx.inCard ? (ctx.cardText.includes('Family') ? 'P7' : 'P6') : null]
  ],
  profile: [
    ['PR1,PR7,PR8,PR3', /^edit/, 'PR2'], ['PR2,PR4,PR5,PR6', /^save/, 'PR3'], ['PR2,PR4,PR6', /cancel|discard/, 'PR1'],
    ['PR4', /reload|use theirs|show/, 'PR1'], ['PR9', /^done$/, 'PR2'], ['PR9', 'cancel', 'PR2'], ['PR9', /remove/, 'PR2'],
    ['PR2', /^alex$/, 'PR9'],
    ['PR1,PR7,PR8,PR3', '*', ctx => ctx.inCard ? 'PR2' : null]
  ],
  settings: [
    ['*', /^settings$/, 'S1'], ['*', /^texts/, 'S3'], ['*', /^device/, 'push:device/*'], ['*', 'sign out', 'auth/A0'],
    ['S3,S9,S17', /send code/, 'S4'], ['S4,S5,S12', 'verify', 'S6'], ['S4,S5,S12', 'send a new code', 'S4'], ['S6', '*', 'S7a'],
    ['S7a,S16', 'send a test text', 'S7b'], ['S7a,S7b,S16,S10', 'use a different number', 'S12'], ['S7a,S7b,S16', /switch|turn off|texts on/, 'S15'], ['S15', /switch|turn on/, 'S7a'],
    ['*', 'show me how', 'gap:Settings install instructions are on the card itself; Today A15 to A17 hold the sheets.'],
    ['*', /^terms/, 'public/P11'], ['*', /^privacy/, 'public/P12']
  ],
  auth: [
    ['A1,A2,A3,A4,A5,A6,A21,A18,A0,A17', /^sign in$|^signing in/, ctx => ctx.situation.who === 'admin' ? 'admin/AD1' : 'today/F1'],
    ['*', /forgot/, 'A10'], ['A10,A12', /^send|^email|reset|link/, 'A11'], ['A10,A11,A12', /^sign in$|^back/, 'A1'],
    ['A7,A8,A9,A19,A20', /^save/, 'today/F1'], ['A7,A8,A9,A19,A20', 'sign out', 'A1'],
    ['A13,A14', /^save/, 'today/F1'], ['A15,A16', /forgot|new link|request/, 'A10'],
    ['*', /about caregiver/, 'public/P1'], ['*', /opt-in/, 'public/P2'], ['*', /^terms/, 'public/P11'], ['*', /^privacy/, 'public/P12'],
    ['A1', '*', ctx => ctx.inField ? 'A2' : null]
  ],
  admin: [
    ['*', 'sign out', 'auth/A1'], ['*', /^users$|back to the login/, ctx => ctx.label.startsWith('back') ? 'AD3' : 'AD1'], ['*', /^alex morgan$/, 'AD3'],
    ['AD1,AD17,AD2,AD19,AD9', 'new account', 'AD5'], ['AD19', 'try again', 'AD1'],
    ['AD3,AD4,AD10b', 'reset password', 'AD10a'], ['AD10a', /^reset/, 'AD10b'], ['AD10a,AD11,AD11b', 'cancel', 'AD3'],
    ['AD3,AD4,AD10b', 'delete this login', 'AD11'], ['AD11,AD11b', /^delete/, 'AD1'],
    ['AD3,AD4,AD10b', /person settings|daniel morgan/, 'AD12'], ['AD12,AD16,AD13,AD14,AD22', /^save/, 'gap:Person settings after Save has no accepted frame; AD12 stands.'], ['AD12,AD16,AD13,AD14,AD22,AD18', 'cancel', 'AD3'],
    ['AD5', '*', ctx => (ctx.inField || ctx.inCard) ? 'AD6' : null], ['AD6,AD7', 'create account', 'AD9'], ['AD8,AD21', 'create account', 'AD9'], ['AD5,AD6,AD7,AD8,AD21', 'cancel', 'AD1'],
    ['AD20', 'sign in', 'auth/A18'],
    ['AD1,AD17,AD9', '*', ctx => ctx.inCard ? (ctx.cardText.includes('Ruth') ? 'AD4' : 'AD3') : null]
  ],
  public: [
    ['P1', /^sign in$/, 'auth/A1'], ['P1', /opt-in/, 'P2'], ['*', /^terms/, 'P11'], ['*', /^privacy/, 'P12'],
    ['P2,P13,P3,P15,P14', /^text me|^send|^continue|^sign up|sign me up|code/, 'P4'],
    ['P4', /^sign in$/, 'P5'], ['P4', /forgot/, 'auth/A10'], ['P5,P6', /verify|confirm|turn on/, 'P7'], ['P5,P6', 'send a new code', 'P5'],
    ['P7,P8,P9,P10,P16,P6', /^settings$|^back|^done$/, 'settings/S1'], ['P7', /open legavo|open caregiver/, 'today/F1'], ['P8', /change|different/, 'P2'],
    ['P11,P12', /^caregiver$|^back|^home|legavo/, 'P1'], ['P11,P12', /^sign in$/, 'auth/A1'],
    ['P2,P13', '*', ctx => ctx.inField ? 'P3' : null]
  ]
};
export const RULES = R;

// Common rules that run before the surface rules on signed-in surfaces.
export const COMMON = [
  [/device settings|companion settings|^d ?daniel$|^daniel$/, 'push:device/*'],
  [/^today$/, 'tab:today'], [/^story$/, 'tab:story'], [/^profile$/, 'tab:profile'], [/^settings$/, 'tab:settings']
];
export const SIGNED_IN = ['today', 'compose', 'device', 'chapters', 'photos', 'profile', 'settings'];
