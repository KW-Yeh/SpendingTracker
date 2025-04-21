import {
  MdOutlineBalance,
  MdOutlineCatchingPokemon,
  MdOutlineCategory,
  MdOutlineChecklistRtl,
  MdOutlineCheckroom,
  MdOutlineDirectionsCar,
  MdOutlineFastfood,
  MdOutlineHealing,
  MdOutlineHome,
  MdOutlineMonetizationOn,
  MdOutlineRedeem,
  MdOutlineSchool,
} from 'react-icons/md';

export function getCategoryIcon(category: string) {
  switch (category) {
    case '🍔':
      return <MdOutlineFastfood />;
    case '👗':
      return <MdOutlineCheckroom />;
    case '🏠':
      return <MdOutlineHome />;
    case '🚗':
      return <MdOutlineDirectionsCar />;
    case '📚':
      return <MdOutlineSchool />;
    case '🎲':
      return <MdOutlineCatchingPokemon />;
    case '🧻':
      return <MdOutlineChecklistRtl />;
    case '💊':
      return <MdOutlineHealing />;
    case '📉':
      return <MdOutlineBalance />;
    case '📈':
      return <MdOutlineBalance />;
    case '💰':
      return <MdOutlineMonetizationOn />;
    case '🎁':
      return <MdOutlineRedeem />;
    case '✨':
      return <MdOutlineCategory />;
  }
}
