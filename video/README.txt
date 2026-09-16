DROP YOUR OPENING FILM IN THIS FOLDER
=====================================

Name it:  logo.mp4

That is all. Reload the home page and it plays full-screen, then flies into
the header logo as the page rises. Nothing else needs editing.

Notes
-----
· logo.webm also works, and is tried second if logo.mp4 is absent.
· Until you add it, the site falls back to the stand-in clip bundled at
  assets/video/nisa-intro.mp4. Your logo.mp4 always wins over it. If you
  delete both, the intro is skipped silently and the home page loads as
  normal — the site never waits on a missing file.
· Sound: the film tries to play WITH audio. Browsers only allow that once
  the visitor has interacted with the page, so on a cold load it falls back
  to muted and shows a speaker button at the bottom left (it pulses) — one
  tap and the sound is on. From the second page view onward the audio
  usually plays straight away.

· Where the picture ends: set END_AT near the top of intro() in
  assets/js/site.js. It is currently 4.82 seconds, which is where your
  current clip's picture stops — this avoids sitting on trailing black
  frames. If your new clip is a different length, change that number (or
  set it to null to always play to the very end).

· Clicking anywhere on the film skips it. So does Escape or the space bar.
· Aim for 1920x1080 or larger, H.264, under about 8 MB. It fills the screen,
  so the very edges of the frame may crop on narrow windows — keep the logo
  near the middle.
· The film is shown once per visit. To change that, see intro() in
  assets/js/site.js — the comment there covers every option.
· To replay it at any time, add ?intro=1 to the address.
