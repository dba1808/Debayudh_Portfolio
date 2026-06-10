# TODO - Performance fixes (no animation removal)

- [x] 1) Add FPS cap + visibility/hidden pause to heavy canvas loops:

  - [x] AgenticNetworkCanvas: throttle requestAnimationFrame to ~30–45fps; pause when tab hidden; stop anim when offscreen.
  - [x] Stars: ensure framer render loop is demand/paused; cap DPR and rotation updates.




- [x] 2) Reduce cursor overhead without changing visuals:
- [x] App.jsx CustomCursor: throttle mousemove -> cursorX/cursorY updates.

- [x] 3) Reduce Lenis + raf overhead when not scrolling:
  - [x] App.jsx useSmoothScroll: pause raf loop when page is idle/hidden.

- [ ] 4) Quick verification:
  - [x] Run dev server and check for lag.

  - [ ] Spot-check that all animations/canvases still look same when active.


