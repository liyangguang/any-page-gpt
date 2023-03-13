<script lang="ts">
  export let value = 0;

  const STROKE_WITDH = 80;
  const RADIUS = 250;
  const BACKGROUND_COLOR = '#ccc';
  const FOREGROUND_START_COLOR = '#FFBF98';
  const FOREGROUND_END_COLOR = '#F76B79';
</script>

<svg viewBox="0 0 {RADIUS * 2} {RADIUS * 2}">
  <defs>
    <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color={FOREGROUND_START_COLOR}/>
      <stop offset="100%" stop-color={FOREGROUND_END_COLOR}/>
    </linearGradient>
  </defs>
  <circle cx={RADIUS} cy={RADIUS} r="200" stroke={BACKGROUND_COLOR} stroke-width={STROKE_WITDH} fill="none"/>
  <path d="M 250,50 A 200 200 0 1 1 250 450 A 200 200 0 1 1 250 50"
        stroke="url(#linear)" stroke-linecap="round" stroke-width={STROKE_WITDH}
        fill="none" stroke-dasharray="{value * 1256},1256" />
</svg>

<style>
  svg {
    width: 100%;
    aspect-ratio: 1/1;
  }
</style>
