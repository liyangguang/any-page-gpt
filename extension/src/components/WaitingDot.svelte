<span class="dot"></span>
<span class="dot"></span>
<span class="dot"></span>

<style>
  .dot {
    display: inline-block;
    width: .2em;
    height: .2em;
    border-radius: 50%;
    background-color: #aaa;
    animation: jumping 1.5s linear infinite;
  }


  .dot:nth-child(1) {
    margin-left: .3em;
  }
  .dot:nth-child(2) {
    animation-delay: .3s;
  }
  .dot:nth-child(3) {
    animation-delay: .6s;
  }

  @keyframes jumping {
    0% {
      transform: translate(0, .2em);
    }
    16% {
      transform: translate(0, -.3em);
    }
    33% {
      transform: translate(0, .2em);
    }
    100% {
      transform: translate(0, .2em);
    }
  }
</style>