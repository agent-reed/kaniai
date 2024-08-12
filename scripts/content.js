let kanjiElement = document.querySelector('.page-header__title-text');
let lessonKanji = document.querySelector('#turbo-body > div.lesson-container > div.lesson-container__header > div > div > div.character-header__meaning')

if (kanjiElement) {
  new MutationObserver(() => {
    if (document.querySelector('#visual-section')) {
      return;
    } else {
      let kanjiElement = document.querySelector('.page-header__title-text');
      setPicture(kanjiElement.textContent);
    }
  }).observe(document, {subtree: true, childList: true});

  setPicture(kanjiElement.textContent);
}

function setPicture(kanji) {
  const mnemonicSection = document.querySelector('#section-reading > section:nth-child(2)');

  if (mnemonicSection) {
    const visualSection = document.createElement('section');
    visualSection.classList.add('subject-section__subsection');

    const header = document.createElement('h3');
    header.classList.add('subject-section__subtitle')
    header.textContent = "Visualization"

    const image = document.createElement('img');
    image.width = '300';
    image.height = '300';
    image.src = 'https://d39wqa1ne2nsv1.cloudfront.net/' + kanji + '.png';
    image.onerror = function(){ visualSection.style.display = 'none';}

    visualSection.insertAdjacentElement('afterbegin', header)
    visualSection.insertAdjacentElement('beforeend', image)

    visual = mnemonicSection.insertAdjacentElement('afterend', visualSection);
    visual.setAttribute("id", "visual-section");
  }
}