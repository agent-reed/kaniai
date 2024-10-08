const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const imageSource = (kanji) => {
  return 'https://d39wqa1ne2nsv1.cloudfront.net/' + kanji + '.jpg';
}

const imagePreload = (imageSrc, good, bad) => {
  var img = new Image();
  img.onload = good; 
  img.onerror = bad;
  img.src = imageSrc;

  return img;
}

const documentObserver = new MutationObserver(debounce(() => {
  setDocumentImage();
}, 300));

const lessonObserver = new MutationObserver(debounce(() => {
  setLessonImage();
}, 300));

navigation.addEventListener("navigate", event => {
  const url = new URL(event.destination.url);
  detectKanjiForVisual(url);
});

const detectKanjiForVisual = (url) => {
  if (url.pathname.includes("/kanji/")) {
    lessonObserver.disconnect();
    documentObserver.observe(document, {subtree: true, childList: true});
  } else if (url.pathname.includes("/subject-lessons/")) {
    documentObserver.disconnect();
    lessonObserver.observe(document, {subtree: true, childList: true});
  } else {
    documentObserver.disconnect();
    lessonObserver.disconnect();
  }
}

const setLessonImage = () => {
  if (document.querySelector('#visual-section')) {
    return;
  } else {
    let kanjiElement = document.querySelector('.character-header__meaning');
    let sideElement = document.querySelector('#reading > div > div.subject-slide__aside > section');

    if (kanjiElement && sideElement) {
      imagePreload(imageSource(kanjiElement.textContent), () => {
        const visualSection = document.createElement('section');
        visualSection.classList.add('subject-section');
  
        const header = document.createElement('h2');
        header.classList.add('subject-section__title')
        header.textContent = "Visualization"
  
        const button = document.createElement("button");
        button.classList.add('kaniai-button');
        button.textContent = "View Reading Image";
        button.onclick = () => showImageModal(imageSource(kanjiElement.textContent), true);
  
        visualSection.insertAdjacentElement('afterbegin', header)
        visualSection.insertAdjacentElement('beforeend', button)
  
        visual = sideElement.insertAdjacentElement('afterend', visualSection);
        visual.setAttribute("id", "visual-section");
      }, () => {return;})
    }
  }
}

const setDocumentImage = () => {
  if (document.querySelector('#visual-section')) {
    return;
  } else {
    let kanjiElement = document.querySelector('.page-header__title-text');
    let mnemonicSection = document.querySelector('#section-reading > section:nth-child(2)');
  
    if (kanjiElement && mnemonicSection) {
      const visualSection = document.createElement('section');
      visualSection.classList.add('subject-section__subsection');
  
      const header = document.createElement('h3');
      header.classList.add('subject-section__subtitle')
      header.textContent = "Visualization"
  
      const image = document.createElement('img');
      image.width = '300';
      image.height = '300';
      image.classList.add('kaniai-image');
      image.src = imageSource(kanjiElement.textContent);
      image.onerror = function(){ visualSection.style.display = 'none';}
      image.onclick = () => showImageModal(imageSource(kanjiElement.textContent), false);
  
      visualSection.insertAdjacentElement('afterbegin', header)
      visualSection.insertAdjacentElement('beforeend', image)
  
      visual = mnemonicSection.insertAdjacentElement('afterend', visualSection);
      visual.setAttribute("id", "visual-section");
    }
  }
}

const showImageModal = (src, isLesson) => {
  const modal = document.createElement('div')
  isLesson ? modal.classList.add('kaniai-lesson-modal') : modal.classList.add('kaniai-dictionary-modal');

  const close = document.createElement('span')
  close.classList.add('kaniai-close');
  close.textContent = "x"

  const modalImage = document.createElement('img')
  modalImage.classList.add('kaniai-modal-content');

  modal.insertAdjacentElement('afterbegin', close);
  modal.insertAdjacentElement('beforeend', modalImage);

  document.body.appendChild(modal);

  modal.style.display = "block";
  modalImage.src = src;
  
  close.onclick = () => {
    modal.remove();
  }
  
  window.onclick = (e) => {
    if(e.target == modal) {
      modal.remove();
    }
  }
}

detectKanjiForVisual(window.location);
