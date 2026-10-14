import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import Icon from './components/Icon'
import { copy, email, socialLinks } from './content'
import { skills } from './skills'
import './App.css'

const dockApps = ['welcome', 'about', 'rebyte', 'github', 'linkedin', 'instagram', 'contact', 'settings']
const settingsNav = [['wifi', 'bluetooth', 'network', 'energy'], ['general', 'accessibility', 'appearance', 'menubar', 'dock', 'displays', 'spotlight']]

function App() {
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('desktop-language') === 'en' ? 'en' : 'it' } catch { return 'it' }
  })
  const [activeApp, setActiveApp] = useState('welcome')
  const [minimized, setMinimized] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [time, setTime] = useState(() => new Date())
  const [searchOpen, setSearchOpen] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)
  const [query, setQuery] = useState('')
  const [reducedMotion, setReducedMotion] = useState(false)
  const windowRef = useRef(null)
  const titleRef = useRef(null)
  const searchRef = useRef(null)
  const searchTrigger = useRef(null)
  const lastTrigger = useRef(null)
  const drag = useRef(null)
  const minimizing = useRef(null)
  const t = copy[language]
  const windowVisible = activeApp && !minimized

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    document.title = t.title
    try { localStorage.setItem('desktop-language', language) } catch { /* Switching works without browser storage. */ }
  }, [language, t.title])

  useEffect(() => {
    function handleKey(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchTrigger.current = document.activeElement
        setSearchOpen(value => !value)
      }
      if (event.key === 'Escape') {
        setSearchOpen(false)
        searchTrigger.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => { if (searchOpen) searchRef.current?.focus() }, [searchOpen])
  useEffect(() => { if (windowVisible) titleRef.current?.focus({ preventScroll: true }) }, [activeApp, windowVisible])
  useEffect(() => {
    const resetPosition = () => setPosition({ x: 0, y: 0 })
    window.addEventListener('resize', resetPosition)
    return () => window.removeEventListener('resize', resetPosition)
  }, [])

  function openApp(app, event) {
    lastTrigger.current = event?.currentTarget || document.activeElement
    const wasMinimizing = minimizing.current?.playState === 'running'
    minimizing.current?.cancel()
    minimizing.current = null
    if (app !== activeApp) {
      setActiveApp(app)
      setPosition({ x: 0, y: 0 })
      setExpanded(false)
    } else if (minimized || wasMinimizing) {
      // Restoring keeps the window's position, size, scroll and state; it grows back out of its dock icon.
      scaleToDock(app, true)
    }
    setMinimized(false)
    setSearchOpen(false)
    setQuery('')
  }

  // Fallback when the visitor has no mail app: the address is copied too, so they can paste it into webmail.
  function copyEmail() {
    navigator.clipboard?.writeText(email).then(() => {
      setEmailCopied(true)
      setTimeout(() => setEmailCopied(false), 2500)
    }).catch(() => {})
  }

  const lessMotion = () => reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Minimize uses macOS's "Scale" effect: the window shrinks into its dock icon, and grows back out of it on restore.
  function scaleToDock(app, restore = false) {
    const el = windowRef.current
    const icon = document.querySelector(`.dock-item[data-app="${app}"] .app-icon`)?.getBoundingClientRect()
    if (!el || !icon || lessMotion()) return null
    // Measured from layout, not the window's own rect, which is still scaled down while minimized.
    const area = el.parentElement.getBoundingClientRect()
    const offset = window.innerWidth < 700 || expanded ? { x: 0, y: 0 } : position
    const docked = { translate: `${icon.left + icon.width / 2 - (area.left + area.width / 2 + offset.x)}px ${icon.top + icon.height / 2 - (area.top + area.height / 2 + offset.y)}px`, scale: .05, opacity: 0 }
    el.style.transformOrigin = `${offset.x}px ${offset.y}px`
    return restore
      ? el.animate([docked, {}], { duration: 360, easing: 'cubic-bezier(.2,.75,.25,1)' })
      : el.animate([{}, docked], { duration: 360, easing: 'cubic-bezier(.55,0,.8,.3)', fill: 'forwards' })
  }

  function minimizeWindow() {
    const animation = scaleToDock(activeApp)
    if (!animation) return hideWindow()
    minimizing.current = animation
    // A restore click cancels the animation, which rejects this promise instead of hiding the window.
    animation.finished.then(() => hideWindow(), () => {})
  }

  function toggleMaximize() {
    const toggle = () => setExpanded(value => !value)
    if (!document.startViewTransition || lessMotion()) return toggle()
    document.startViewTransition(() => flushSync(toggle))
  }

  function hideWindow(close = false) {
    if (close) setActiveApp(null)
    else setMinimized(true)
    if (lastTrigger.current?.isConnected) lastTrigger.current.focus()
    else document.querySelector('.dock-button')?.focus()
  }

  function startDrag(event) {
    if (expanded || window.innerWidth < 700 || event.target.closest('button') || event.button !== 0) return
    const bounds = windowRef.current.getBoundingClientRect()
    drag.current = { pointerX: event.clientX, pointerY: event.clientY, ...position, bounds }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function moveWindow(event) {
    if (!drag.current) return
    const origin = drag.current
    const x = event.clientX - origin.pointerX
    const y = event.clientY - origin.pointerY
    setPosition({
      x: origin.x + Math.max(12 - origin.bounds.left, Math.min(x, window.innerWidth - 12 - origin.bounds.right)),
      y: origin.y + Math.max(46 - origin.bounds.top, Math.min(y, window.innerHeight - 112 - origin.bounds.bottom)),
    })
  }

  const appTitle = t.apps[activeApp]
  const matchingApps = dockApps.filter(app => t.apps[app].toLocaleLowerCase(t.locale).includes(query.toLocaleLowerCase(t.locale)))

  function appLink(app, className, children) {
    return socialLinks[app]
      ? <a href={socialLinks[app]} target="_blank" rel="noopener noreferrer" className={className} aria-label={`${t.apps[app]} — ${t.external}`}>{children}</a>
      : <button className={className} onClick={event => openApp(app, event)} aria-label={t.apps[app]}>{children}</button>
  }

  return (
    <div className={`desktop ${reducedMotion ? 'reduce-motion' : ''}`}>
      <div className="wallpaper" aria-hidden="true" />
      <header className="menu-bar">
        <nav className="menu-left" aria-label={t.menu}>
          <button className="desktop-name" onClick={event => openApp('welcome', event)}>Damien</button>
          <span className="active-app-name">{windowVisible ? appTitle : t.desktop}</span>
        </nav>
        <div className="menu-right">
          <button className="language-switch" onClick={() => setLanguage(language === 'it' ? 'en' : 'it')} aria-label={t.language}>{language.toUpperCase()}</button>
          <button className="icon-button search-button" aria-label={t.search} onClick={event => { searchTrigger.current = event.currentTarget; setSearchOpen(value => !value) }}><Icon name="search" size={16} /></button>
          <button className="icon-button control-button" aria-label={t.sound} onClick={event => openApp('settings', event)}><Icon name="controls" size={17} /></button>
          <time className="clock" dateTime={time.toISOString()} aria-label={t.clock}>{time.toLocaleDateString(t.locale, { weekday: 'short', day: 'numeric', month: 'short' })}<span>{time.toLocaleTimeString(t.locale, { hour: '2-digit', minute: '2-digit' })}</span></time>
        </div>
      </header>
      <main className="workspace">
        {activeApp && <section key={activeApp} ref={windowRef} className={`app-window glass ${expanded ? 'expanded' : ''} ${minimized ? 'is-minimized' : ''} window-${activeApp}`} style={{ '--window-x': `${expanded ? 0 : position.x}px`, '--window-y': `${expanded ? 0 : position.y}px` }} inert={minimized} aria-labelledby="window-title">
          <header className="window-titlebar" onPointerDown={startDrag} onPointerMove={moveWindow} onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }} onDoubleClick={event => { if (!event.target.closest('button')) toggleMaximize() }}>
            <div className="traffic-lights">
              <button className="traffic close" onClick={() => hideWindow(true)} aria-label={t.close}><span>×</span></button>
              <button className="traffic minimize" onClick={minimizeWindow} aria-label={t.minimize}><span>−</span></button>
              <button className="traffic maximize" onClick={toggleMaximize} aria-label={expanded ? t.restore : t.maximize}><span>↗</span></button>
            </div>
            <h2 ref={titleRef} tabIndex={-1} id="window-title">{appTitle}</h2>
          </header>
          <div className="window-content" key={activeApp}>
            {activeApp === 'welcome' && <div className="welcome-content">
              <span className="avatar">d<span>.</span></span>
              <h1>{t.greeting}</h1>
              <p className="welcome-description">{t.intro}</p>
              <div className="welcome-actions"><button className="button button-primary" onClick={event => openApp('about', event)}>{t.more}</button><button className="button button-secondary" onClick={event => openApp('contact', event)}>{t.connect}</button></div>
            </div>}
            {activeApp === 'about' && <div className="page-content about-content">
              <h1 className="page-title">{t.aboutTitle}</h1><p>{t.bio}</p><p>{t.bioMore}</p><p>{t.bioAi}</p>
              <h2 className="skills-title">{t.skillsTitle}</h2>
              <ul className="skills">{skills.map(skill => <li key={skill.name}><span className="skill-icon" style={{ color: skill.color }}><svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d={skill.path} /></svg></span>{skill.name}</li>)}</ul>
              <button className="text-link" onClick={event => openApp('contact', event)}>{t.connect}<Icon name="chevron" size={14} /></button>
            </div>}
            {activeApp === 'rebyte' && <div className="page-content"><h1 className="page-title">Rebyte</h1><p>{t.rebyteIntro}</p><p>{t.rebyteStack}</p><p>{t.rebyteStatus}</p></div>}
            {activeApp === 'contact' && <div className="page-content contact-content"><h1 className="page-title">{t.contactTitle}</h1><p className="page-description">{t.contactIntro}</p><div className="contact-links"><a href={`mailto:${email}`} onClick={copyEmail}><span className="app-icon contact"><Icon name="contact" size={20} /></span><strong aria-live="polite">{emailCopied ? t.emailCopied : 'Email'}</strong><Icon name="arrow" size={16} /></a>{['linkedin', 'github', 'instagram'].map(app => <a key={app} href={socialLinks[app]} target="_blank" rel="noopener noreferrer" aria-label={`${t.apps[app]} — ${t.external}`}><span className={`app-icon ${app}`}><Icon name={app} size={20} /></span><strong>{t.apps[app]}</strong><Icon name="arrow" size={16} /></a>)}</div>
            </div>}
            {activeApp === 'settings' && <div className="settings-content">
              <aside className="settings-sidebar" aria-label={t.apps.settings}>
                <button className="settings-search" onClick={event => { searchTrigger.current = event.currentTarget; setSearchOpen(true) }}><Icon name="search" size={14} />{t.search}</button>
                <div className="settings-profile">
                  <img src="/avatar.jpg" alt="" width="40" height="40" />
                  <span><strong>Damien</strong><span>Full Stack Developer</span></span>
                </div>
                {settingsNav.map(group => <div className="settings-nav" key={group[0]}>
                  {group.map(item => item === 'general'
                    ? <div className="settings-category is-selected" aria-current="page" key={item}><span className="settings-icon"><Icon name="settings" size={15} /></span>{t.settingsTitle}</div>
                    // Decorative only, like the real System Settings list; not interactive.
                    : <div className="settings-category" aria-hidden="true" key={item}><span className={`settings-icon icon-${item}`}><Icon name={item} size={15} /></span>{t.settingsItems[item]}</div>)}
                </div>)}
              </aside>
              <div className="settings-main">
                <h1>{t.settingsTitle}</h1>
                <div className="settings-group">
                  <label className="setting-row motion-row">
                    <span>{t.motion}</span>
                    <input type="checkbox" aria-label={t.motion} checked={reducedMotion} onChange={event => setReducedMotion(event.target.checked)} />
                    <span className="switch-track" aria-hidden="true" />
                  </label>
                  <div className="setting-row language-row">
                    <span id="language-label">{t.languageLabel}</span>
                    <div className="segmented-control" role="group" aria-labelledby="language-label">
                      <button aria-pressed={language === 'it'} onClick={() => setLanguage('it')}>Italiano</button>
                      <button aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>English</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
          </div>
        </section>}
      </main>
      <nav className="dock glass" aria-label={t.desktop}>
        {dockApps.map((app, index) => <div className={`dock-item ${index === 3 || index === 7 ? 'dock-separated' : ''}`} key={app} data-app={app}>
          {appLink(app, `dock-button ${activeApp === app && windowVisible ? 'app-active' : ''}`, <><span className={`app-icon ${app}`}><Icon name={app} size={31} /></span><span className="dock-tooltip">{t.apps[app]}</span><span className={`app-indicator ${activeApp === app ? 'is-open' : ''}`} /></>)}
        </div>)}
      </nav>
      {searchOpen && <div className="spotlight-backdrop" onClick={() => { setSearchOpen(false); searchTrigger.current?.focus() }}><section className="spotlight glass" aria-label={t.search} onClick={event => event.stopPropagation()}><div className="spotlight-input"><Icon name="search" size={24} /><input ref={searchRef} value={query} onChange={event => setQuery(event.target.value)} placeholder={t.search} aria-label={t.search} /></div><div className="spotlight-results">{matchingApps.map(app => <div key={app}>{appLink(app, 'spotlight-result', <><span className={`app-icon ${app}`}><Icon name={app} size={22} /></span><span>{t.apps[app]}</span><Icon name={socialLinks[app] ? 'arrow' : 'chevron'} size={16} /></>)}</div>)}{matchingApps.length === 0 && <p>{t.noApps}</p>}</div></section></div>}
    </div>
  )
}

export default App
