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

export function getCategoryIcon(category: string, className: string = '') {
  switch (category) {
    case '🍔':
      return <MdOutlineFastfood className={className} />;
    case '👗':
      return <MdOutlineCheckroom className={className} />;
    case '🏠':
      return <MdOutlineHome className={className} />;
    case '🚗':
      return <MdOutlineDirectionsCar className={className} />;
    case '📚':
      return <MdOutlineSchool className={className} />;
    case '🎲':
      return <MdOutlineCatchingPokemon className={className} />;
    case '🧻':
      return <MdOutlineChecklistRtl className={className} />;
    case '💊':
      return <MdOutlineHealing className={className} />;
    case '📉':
      return <MdOutlineBalance className={className} />;
    case '📈':
      return <MdOutlineBalance className={className} />;
    case '💰':
      return <MdOutlineMonetizationOn className={className} />;
    case '🎁':
      return <MdOutlineRedeem className={className} />;
    case '✨':
      return <MdOutlineCategory className={className} />;
  }
}
