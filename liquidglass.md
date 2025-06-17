Following is the code of html to support the css example:
<div class="container container--inline">
  <div class="glass-container glass-container--rounded glass-container--large">
    <div class="glass-filter"></div>
    <div class="glass-overlay"></div>
    <div class="glass-specular"></div>
    <div class="glass-content glass-content--inline">

      <div class="player">
        <div class="player__thumb">
          <img class="player__img" src='https://images.unsplash.com/photo-1619983081593-e2ba5b543168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDk1NzAwNDV8&ixlib=rb-4.1.0&q=80&w=400' alt=''>
          <div class="player__legend">
            <h3 class="player__legend__title">All Of Me</h3>
            <span class="player__legend__sub-title">Nao</span>
          </div>
        </div>

        <div class="player__controls">
          <div class="player__controls__play">
            <svg viewBox="0 0 448 512" width="24" title="play">
              <path fill="black" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
            </svg>
          </div>

          <div class="player__controls__ff">
            <svg viewBox="0 0 448 512" width="24" title="play">
              <path fill="black" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
            </svg>

            <svg viewBox="0 0 448 512" width="24" title="play">
              <path fill="black" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
            </svg>
          </div>
        </div>

      </div>
    </div>
</div></div>

<div class="container container--inline">
  

  <div class="glass-container glass-container--rounded">
    <div class="glass-filter"></div>
    <div class="glass-overlay"></div>
    <div class="glass-specular"></div>
    <div class="glass-content glass-content--alone">

      <div class="glass-item">
        <svg viewBox="0 0 512 512" width="40" title="search">
          <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
      </div>
    </div>
  </div>
</div>

<div class="container">
  

  <div class="glass-container">
    <div class="glass-filter"></div>
    <div class="glass-overlay"></div>
    <div class="glass-specular"></div>
    <div class="glass-content">
      <a href="#">
        <img src="https://assets.codepen.io/923404/finder.png" alt="Finder" />
      </a>
      <a href="#">
        <img src="https://assets.codepen.io/923404/map.png" alt="Maps" />
      </a>
      <a href="#">
        <img src="https://assets.codepen.io/923404/messages.png" alt="Messages" />
      </a>
      <a href="#">
        <img src="https://assets.codepen.io/923404/safari.png" alt="Safari" />
      </a>
      <a href="#">
        <img src="https://assets.codepen.io/923404/books.png" alt="Books" />
      </a>
    </div>

    <!-- SVG FILTER DEFINITION -->
    <svg style="display: none">
      <filter id="lg-dist" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
        <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
        <feDisplacementMap in="SourceGraphic" in2="blurred" scale="70" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  </div>
</div>



Following is the CSS implementation example:
:root {
  --lg-bg-color: rgba(255, 255, 255, 0.25);
  --lg-highlight: rgba(255, 255, 255, 0.75);
  --lg-text: #ffffff;
  --lg-hover-glow: rgba(255, 255, 255, 0.4);
  --lg-red: #fb4268;
  --lg-grey: #5b5b5b;
}

/* ========== BASE LAYOUT ========== */
body {
  margin: 0;
  padding: 2rem 0;
  min-height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: sans-serif;
  background: url("https://images.unsplash.com/photo-1551384963-cccb0b7ed94b?q=80&w=3247&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
    center/cover;
  animation: bg-move 5s ease-in-out infinite alternate;
}

@keyframes bg-move {
  from {
    background-position: center center;
  }
  to {
    background-position: center top;
  }
}

/* ========== CONTAINER ========== */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.container--inline {
  flex-direction: row;
}

/* ========== GLASS CONTAINER ========== */
.glass-container {
  position: relative;
  display: flex;
  font-weight: 600;
  color: var(--lg-text);
  cursor: pointer;
  background: transparent;
  border-radius: 2rem;
  overflow: hidden;
  box-shadow: 0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 2.2);
}

.glass-container--rounded {
  border-radius: 5rem;
  margin: 0.5rem;
  fill: var(--lg-grey);
}

.glass-container--small {
  margin: 5rem 0 1rem;
  border-radius: 5rem;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.25);
}

.glass-container--large {
  min-width: 32rem;
}

.glass-container--medium {
  min-width: 25rem;
}

.glass-container svg {
  fill: white;
}

/* ========== GLASS ITEM ========== */
.glass-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 1rem;
  color: white;
  transition: color 0.3s ease;
  text-align: center;
}

.glass-item svg {
  fill: white;
  height: 50px;
  margin-bottom: 0.25rem;
}

.glass-item--active {
  background: rgba(0, 0, 0, 0.25);
  color: black;
  margin: 0 -0.5rem;
  padding: 0.25rem 1.95rem;
  border-radius: 5rem;
}

.glass-item--active svg {
  fill: black;
}

.player {
  display: flex;
  align-items: center;
  width: 100%;
  flex: 1 1 auto;
  justify-content: space-between;
}

.player__thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
}

.player__img {
  width: 5rem;
  height: auto;
  margin: 0.25rem 0;
  border-radius: 0.5rem;
}

.player__legend {
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  color: black;
}

.player__legend__title {
  font-size: 1rem;
  margin: 0;
}

.player__legend__sub-title {
  font-size: 1rem;
  margin: 0;
  opacity: 0.45;
}

.player__controls {
  margin-right: -1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player__controls__play {
  margin-right: 1rem;
  display: flex;
}

.player__controls__ff {
  display: flex;
}

/* ========== GLASS LAYERS ========== */
.glass-filter {
  position: absolute;
  inset: 0;
  z-index: 0;
  backdrop-filter: blur(0px);
  filter: url(#lg-dist);
  isolation: isolate;
}

.glass-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: var(--lg-bg-color);
}

.glass-specular {
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: inherit;
  overflow: hidden;
  box-shadow: inset 1px 1px 0 var(--lg-highlight),
    inset 0 0 5px var(--lg-highlight);
}

.glass-content {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 1rem 1.5rem 0.9rem;
}

.glass-content--inline {
  padding: 0.25rem 2rem 0.25rem 0.75rem;
  flex: 1 1 auto;
  justify-content: space-between;
}

/* ========== ICONS AND IMAGES ========== */
.glass-content a {
  display: inline-block;
  position: relative;
  padding: 1px;
  border-radius: 1.2rem;
}

.glass-content a img {
  display: block;
  width: 75px;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 2.2);
}

.glass-content a img:hover {
  transform: scale(0.95);
}
