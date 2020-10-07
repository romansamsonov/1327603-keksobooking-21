'use strict';

const COUNT_ADS = 8;

const TYPES = [
  `palace`,
  `flat`,
  `house`,
  `bungalow`
];

const TIMES = [
  `12:00`,
  `13:00`,
  `14:00`
];

const FEATURES = [
  `wifi`,
  `dishwasher`,
  `parking`,
  `washer`,
  `elevator`,
  `conditioner`
];

const PHOTOS = [
  `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel3.jpg`
];

const X_OFFSET = -25;

const Y_OFFSET = -70;

const pinList = document.querySelector(`.map__pins`);
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

let getRandomInteger = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
};

let getRandomArray = (array) => {
  return array.slice(0, getRandomInteger(1, array.length));
};

let createAd = (index) => {
  let locationX = getRandomInteger(0, pinList.offsetWidth);
  let locationY = getRandomInteger(130, 630);
  const ad = {
    author: {
      avatar: `img/avatars/user0${index}.png`
    },
    offer: {
      title: `Заголовок ${index}`,
      address: `${locationX}, ${locationY}`,
      price: getRandomInteger(1000, 1000000),
      type: TYPES[getRandomInteger(0, TYPES.length - 1)],
      rooms: getRandomInteger(1, 100),
      guests: getRandomInteger(0, 100),
      checkin: TIMES[getRandomInteger(0, TIMES.length - 1)],
      checkout: TIMES[getRandomInteger(0, TIMES.length - 1)],
      features: getRandomArray(FEATURES),
      description: `Описание ${index}`,
      photos: getRandomArray(PHOTOS)
    },
    location: {
      x: locationX,
      y: locationY
    }
  };

  return ad;
};

let generateAds = () => {
  const ads = [];

  for (let i = 1; i <= COUNT_ADS; i++) {
    ads.push(createAd(i));
  }

  return ads;
};

const ads = generateAds();

let renderAds = () => {
  document.querySelector(`.map`).classList.remove(`.map__faded`);
  const fragment = document.createDocumentFragment();

  let renderPin = (ad) => {
    const pinElement = pinTemplate.cloneNode(true);

    pinElement.style = `left: ${ad.location.x + X_OFFSET}px; top: ${ad.location.y + Y_OFFSET}px;`;
    pinElement.querySelector(`img`).src = ad.author.avatar;
    pinElement.querySelector(`img`).alt = ad.offer.title;

    return pinElement;
  };

  for (let i = 0; i < ads.length; i++) {
    fragment.appendChild(renderPin(ads[i]));
  }

  pinList.appendChild(fragment);
};

renderAds();
