import { useState } from 'react';
import type { Game } from '../net/useGame';

export function Home({ game, onTable }: { game: Game; onTable: () => void }) {
  const initialCode = new URLSearchParams(location.search).get('room')?.toUpperCase() ?? '';

  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem('crooked-cop-name') ?? '';
    } catch {
      return '';
    }
  });

  const [code, setCode] = useState(initialCode);
  const [device, setDevice] = useState('');

  const openDevice = (kind: 'display' | 'cops') => {
    location.search = `?${kind}=${device.trim().toUpperCase()}`;
  };

  const remember = () => {
    try {
      localStorage.setItem('crooked-cop-name', name.trim());
    } catch {
      /* ignore */
    }
  };

  return (
    <main className="home">
      <div className="home-card">
        {/* Keep the original logo */}
        <img
          src="/assets/logo-crooked-cop.png"
          alt=""
          className="home-logo"
          width={560}
          height={560}
        />

        <h1 className="visually-hidden">The Crooked Cop</h1>

        <p className="h2-tagline">
          He swore to protect.
          <br />
          He chose to betray.
        </p>

        <p className="h2-intro">
          A hidden-role chase where Police hunt Heisters and one officer
          secretly betrays the team.
        </p>

        <label className="h2-field">
          <span className="h2-label">Your name</span>
          <input
            className="h2-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            placeholder="e.g. Kysiah"
            autoFocus
          />
        </label>

        <div className="h2-actions">
          <button
            className="h2-btn h2-btn--gold"
            disabled={!name.trim() || game.conn !== 'open'}
            onClick={() => {
              remember();
              game.create(name);
            }}
          >
            Create a room
          </button>

          <div className="h2-join">
            <input
              className="h2-input"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={4}
              placeholder="CODE"
              aria-label="Room code"
            />

            <button
              className="h2-btn h2-btn--blue h2-btn--inline"
              disabled={!name.trim() || code.length !== 4 || game.conn !== 'open'}
              onClick={() => {
                remember();
                game.join(code, name);
              }}
            >
              Join
            </button>
          </div>
        </div>

        {game.conn !== 'open' && (
          <p className="h2-hint">Connecting to the server…</p>
        )}

        <div className="h2-table">
          <span className="h2-hint">Playing on the physical board?</span>

          <button
            className="h2-btn h2-btn--grey h2-btn--small"
            onClick={onTable}
          >
            Facilitator mode
          </button>

          <span className="h2-hint">
            One device records the timer, log, clues and Artifacts. Works offline.
          </span>

          <details className="h2-device">
            <summary>Join a table device</summary>

            <p className="h2-hint">
              Type the code from the facilitator's screen.
            </p>

            <input
              className="h2-input"
              value={device}
              onChange={(e) => setDevice(e.target.value.toUpperCase())}
              maxLength={6}
              placeholder="CODE"
              aria-label="Device code"
            />

            <div className="h2-device-row">
              <button
                className="h2-btn h2-btn--grey h2-btn--inline"
                disabled={device.trim().length !== 6}
                onClick={() => openDevice('display')}
              >
                Table display
              </button>

              <button
                className="h2-btn h2-btn--grey h2-btn--inline"
                disabled={device.trim().length !== 6}
                onClick={() => openDevice('cops')}
              >
                Cops device
              </button>
            </div>
          </details>
        </div>
      </div>

      <footer className="credits">
        <span className="muted small">A game by</span>

        <img
          src="/assets/logo-out-of-track.png"
          alt="Out of Track"
          className="team-logo"
          width={480}
          height={427}
        />

        <span className="muted small">BSIT 3-8</span>
      </footer>
    </main>
  );
}
