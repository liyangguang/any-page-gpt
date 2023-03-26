<header>
  <img src="$lib/images/logo.svg" alt="Logo">
  <nav>
    <a href="#how">How it works</a>
    <a href="#about">About</a>
  </nav>
</header>

<main>
  <section>
    <h1>AnyPageGPT</h1>
    <p>Make any pages into a GPT chatbot!</p>
    <a href="https://chrome.google.com/webstore/detail/keelaohbekengdipnogignilgbabhhec">Install extension</a>
    <!-- <img src="" alt="AnyPageGPT extension used on a web page"> -->
  </section>
  
  <section>
    <h2 id="how">How it works</h2>
    <ul>
      <li>Extract only the meaningful part of the web page.</li>
      <li>Encode the content into embedding chunks using OpenAI's Embeddings API.</li>
      <li>Find most relavent pieces of content and answer the question using OpenAI's ChatCompletion API.</li>
    </ul>
  
    <h2 id="about">About</h2>
    <p>Developed by <a href="https://liyangguang.com" target="_blank" rel="noreferrer">Yangguang Li</a>, Designed by <a href="https://yi-nie.com/" target="_blank" rel="noreferrer">Yi Nie</a>.</p>
    <ul>
      <li><a href="https://github.com/liyangguang/any-page-gpt">GitHub</a></li>
      <li><a href="https://github.com/liyangguang/any-page-gpt/issues">Issues and Feature requests</a></li>
    </ul>
  </section>
</main>

<style lang="scss">
main {
  section {
    padding: 2em;
  }
}
</style>
