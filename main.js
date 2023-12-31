import races from "./data/races.js";
import classes from "./data/classes.js";

const PATH_KEY_RACE = "race";
const PATH_KEY_SUBRACE = "subRace";
const PATH_KEY_CLASS = "class";
const PATH_KEY_SUBCLASS = "subClass";

const onLoad = () => {
  loadRaces();
  loadClasses();
  loadFormFromPath();
};

const loadFormFromPath = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const targetRace = searchParams.get(PATH_KEY_RACE);
  const foundRace =
    !!targetRace && races.find((race) => race.id === targetRace);
  if (!foundRace) {
    generate();
    return;
  }
  let foundSubRace = null;
  if (foundRace.subRaces.length > 0) {
    const targetSubRace = searchParams.get(PATH_KEY_SUBRACE);
    foundSubRace =
      !!targetSubRace &&
      foundRace.subRaces.find((race) => race.id === targetSubRace);
    if (!foundSubRace) {
      generate();
      return;
    }
  }
  const targetClass = searchParams.get(PATH_KEY_CLASS);
  const foundClass =
    !!targetClass && classes.find((classItem) => classItem.id === targetClass);
  if (!foundClass) {
    generate();
    return;
  }
  const targetSubClass = searchParams.get(PATH_KEY_SUBCLASS);
  const foundSubClass =
    !!targetSubClass &&
    foundClass.subClasses.find((classItem) => classItem.id === targetSubClass);
  if (!foundSubClass) {
    generate();
    return;
  }
  writeCharacterElements(foundRace, foundSubRace, foundClass, foundSubClass);
};

const loadRaces = () => {
  document.getElementById("races-list").innerHTML = races
    .map(getRaceItem)
    .join("");
};

const getRaceItem = (race) => {
  return `<li>
            <label>
              <input type='checkbox' name='race' value='${race.id}' checked/>
              ${race.label}
            </label>
            ${getSubRaceList(race)}
          </li>`;
};

const getSubRaceList = (race) => {
  return race.subRaces.length === 0
    ? ""
    : `<ul>${race.subRaces
        .map((subRace) => `<li>${subRace.label}</li>`)
        .join("")}</ul>`;
};

const loadClasses = () => {
  document.getElementById("classes-list").innerHTML = classes
    .map(getClassItem)
    .join("");
};

const getClassItem = (classItem) => {
  return `<li>
            <label>
              <input type='checkbox' name='class' value='${
                classItem.id
              }' checked/>
              ${classItem.label}
            </label>
            ${getSubClassList(classItem)}
          </li>`;
};

const getSubClassList = (classItem) => {
  return `<ul>${classItem.subClasses
    .map((subClass) => `<li>${subClass.label}</li>`)
    .join("")}</ul>`;
};

window.generate = () => {
  const randomRace = getRandomItem(getAllAvailableRaces());
  const randomSubRace =
    randomRace.subRaces.length > 0 ? getRandomItem(randomRace.subRaces) : null;

  const randomClass = getRandomItem(getAllAvailableClasses());
  const randomSubClass = getRandomItem(randomClass.subClasses);

  writeCharacterElements(
    randomRace,
    randomSubRace,
    randomClass,
    randomSubClass
  );
};

const getAllAvailableRaces = () => {
  const allCheckedRaces = Array.from(
    document.querySelectorAll("input[name='race']:checked")
  ).map((checkbox) => checkbox.value);
  return allCheckedRaces.length > 0
    ? races.filter((race) => allCheckedRaces.includes(race.id))
    : races;
};

const getAllAvailableClasses = () => {
  const allCheckedClasses = Array.from(
    document.querySelectorAll("input[name='class']:checked")
  ).map((checkbox) => checkbox.value);
  return allCheckedClasses.length > 0
    ? classes.filter((classItem) => allCheckedClasses.includes(classItem.id))
    : classes;
};

const writeCharacterElements = (race, subRace, classItem, subClass) => {
  const raceStr = subRace
    ? `<a href='${subRace.link}'>${subRace.label}</a>`
    : `<a href='${race.link}'>${race.label}</a>`;
  const classStr = `<a href='${classItem.link}'>${classItem.label}</a> ( <a href='${subClass.link}'>${subClass.label}</a> )`;
  document.getElementById("result").innerHTML = `${raceStr} ${classStr}`;
  const iconRaceImg = document.getElementById("icon-race");
  iconRaceImg.src = race.icon;
  iconRaceImg.alt = race.label;
  document.getElementById("race-link").href = race.link;
  const iconClassImg = document.getElementById("icon-class");
  iconClassImg.src = classItem.icon;
  iconClassImg.alt = classItem.label;
  document.getElementById("class-link").href = classItem.link;
  reflectCharacterToPath(
    race.id,
    subRace && subRace.id,
    classItem.id,
    subClass.id
  );
};

const getRandomItem = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const reflectCharacterToPath = (raceId, subRaceId, classId, subClassId) => {
  let searchParams = new URLSearchParams(window.location.search);
  searchParams = handleValueInSearchParams(searchParams, PATH_KEY_RACE, raceId);
  searchParams = handleValueInSearchParams(
    searchParams,
    PATH_KEY_SUBRACE,
    subRaceId
  );
  searchParams = handleValueInSearchParams(
    searchParams,
    PATH_KEY_CLASS,
    classId
  );
  searchParams = handleValueInSearchParams(
    searchParams,
    PATH_KEY_SUBCLASS,
    subClassId
  );
  writeLocation(searchParams);
};

const handleValueInSearchParams = (searchParams, key, value) => {
  if (searchParams.get(key) && !value) {
    searchParams.delete(key);
  } else if (value) {
    searchParams.set(key, value);
  }
  return searchParams;
};

const writeLocation = (searchParams) => {
  const newurl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    "?" +
    searchParams.toString();
  window.history.replaceState({ path: newurl }, "", newurl);
};

onLoad();
