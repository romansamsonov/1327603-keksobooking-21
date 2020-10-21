'use strict';

const COUNT_ADS = 8;

const TYPES = [
  `bungalow`,
  `flat`,
  `house`,
  `palace`
];

const offerTypes = {
  bungalow: `Бунгало`,
  flat: `Квартира`,
  house: `Дом`,
  palace: `Дворец`
};

const priceTypes = {
  bungalow: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

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

const map = document.querySelector(`.map`);
const pinList = document.querySelector(`.map__pins`);
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
const adForm = document.querySelector(`.ad-form`);
const adFormFieldsets = adForm.children;
const address = adForm.querySelector(`#address`);
const type = adForm.querySelector(`#type`);
const price = adForm.querySelector(`#price`);
const roomNumber = adForm.querySelector(`#room_number`);
const capacity = adForm.querySelector(`#capacity`);
const mapFilters = document.querySelector(`.map__filters`);
const mapFiltersSelects = mapFilters.children;
const mapPin = document.querySelector(`.map__pin--main`);

const X_MAP_PIN_INACTIVE = Math.round(mapPin.offsetLeft + mapPin.offsetWidth / 2);
const Y_MAP_PIN_INACTIVE = Math.round(mapPin.offsetTop + mapPin.offsetHeight / 2);
const HEIGHT_PIN_POINTER = 20;
const X_MAP_PIN_ACTIVE = X_MAP_PIN_INACTIVE;
const Y_MAP_PIN_ACTIVE = Math.round(mapPin.offsetTop + mapPin.offsetHeight + HEIGHT_PIN_POINTER);

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
/*
let renderCard = (ad) => {
  const cardElement = cardTemplate.cloneNode(true);

  cardElement.querySelector(`.popup__title`).textContent = ad.offer.title;
  cardElement.querySelector(`.popup__text--address`).textContent = ad.offer.address;
  cardElement.querySelector(`.popup__text--price`).textContent = `${ad.offer.price}₽/ночь`;
  cardElement.querySelector(`.popup__type`).textContent = offerTypes[ad.offer.type];
  cardElement.querySelector(`.popup__text--capacity`).textContent = `${ad.offer.rooms} комнаты для ${ad.offer.guests} гостей`;
  cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`;

  let renderFeatures = () => {
    const featuresList = cardElement.querySelector(`.popup__features`);
    while (featuresList.firstElementChild) {
      featuresList.firstElementChild.remove();
    }
    let featureFragment = document.createDocumentFragment();
    for (let i = 0; i < ad.offer.features.length; i++) {
      let featureItem = document.createElement(`li`);
      featureItem.classList.add(`popup__feature`);
      featureItem.classList.add(`popup__feature--${ad.offer.features[i]}`);
      featureFragment.appendChild(featureItem);
    }
    featuresList.appendChild(featureFragment);
  };
  renderFeatures();

  cardElement.querySelector(`.popup__description`).textContent = ad.offer.description;

  let renderPhoto = () => {
    const photosList = cardElement.querySelector(`.popup__photos`);
    const photoTemplate = photosList.firstElementChild;
    while (photosList.firstElementChild) {
      photosList.firstElementChild.remove();
    }
    let photoFragment = document.createDocumentFragment();
    for (let i = 0; i < ad.offer.photos.length; i++) {
      const photoElement = photoTemplate.cloneNode(true);
      photoElement.src = ad.offer.photos[i];
      photoFragment.appendChild(photoElement);
    }
    photosList.appendChild(photoFragment);
  };
  renderPhoto();

  cardElement.querySelector(`.popup__avatar`).src = ad.author.avatar;

  map.insertBefore(cardElement, map.children[1]);
  return cardElement;
};
renderCard(ads[0]);
*/
let disableElements = (formChilds, value) => {
  for (let formChild of formChilds) {
    if (value === true) {
      formChild.setAttribute(`disabled`, `disabled`);
    } else {
      formChild.removeAttribute(`disabled`);
    }
  }
};

document.addEventListener(`DOMContentLoaded`, () => {
  disableElements(adFormFieldsets, true);
  disableElements(mapFiltersSelects, true);
  address.setAttribute(`value`, `${X_MAP_PIN_INACTIVE}, ${Y_MAP_PIN_INACTIVE}`);
});

let pageActivation = () => {
  map.classList.remove(`map--faded`);
  adForm.classList.remove(`ad-form--disabled`);
  disableElements(adFormFieldsets, false);
  disableElements(mapFiltersSelects, false);
  address.setAttribute(`value`, `${X_MAP_PIN_ACTIVE}, ${Y_MAP_PIN_ACTIVE}`);
  address.setAttribute(`disabled`, `disabled`);
};

mapPin.addEventListener(`mousedown`, (evt) => {
  if (evt.which === 1) {
    pageActivation();
    renderAds();
  }
});

mapPin.addEventListener(`keydown`, (evt) => {
  if (evt.key === `Enter`) {
    pageActivation();
    renderAds();
  }
});

type.addEventListener(`change`, () => {
  for (let i = 0; i < TYPES.length; i++) {
    if (TYPES[i] === type.value) {
      price.setAttribute(`min`, priceTypes[type.value]);
      price.setAttribute(`placeholder`, priceTypes[type.value]);
    }
  }
});

let validateRoomCapacity = () => {
  if (roomNumber.value === `100` && capacity.value !== `0`) {
    roomNumber.setCustomValidity(``);
    capacity.setCustomValidity(`Не для гостей`);
  } else if (roomNumber.value !== `100` && capacity.value === `0`) {
    roomNumber.setCustomValidity(`Нужно 100 комнат`);
    capacity.setCustomValidity(``);
  } else if (roomNumber.value < capacity.value) {
    roomNumber.setCustomValidity(`Нужно больше комнат`);
    capacity.setCustomValidity(``);
  } else {
    roomNumber.setCustomValidity(``);
    capacity.setCustomValidity(``);
  }
};

roomNumber.addEventListener(`change`, () => {
  validateRoomCapacity();
});
capacity.addEventListener(`change`, () => {
  validateRoomCapacity();
});
