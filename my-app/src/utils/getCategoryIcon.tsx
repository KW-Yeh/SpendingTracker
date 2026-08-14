import type { IconType } from 'react-icons';
import {
  MdOutlineCategory,
  MdOutlineCheckroom,
  MdOutlineDirectionsCar,
  MdOutlineFastfood,
  MdOutlineHome,
  MdOutlineMedicalServices,
  MdOutlineMonetizationOn,
  MdOutlineRedeem,
  MdOutlineSchool,
  MdOutlineShoppingBasket,
  MdOutlineSportsEsports,
  MdOutlineTrendingDown,
  MdOutlineTrendingUp,
} from 'react-icons/md';

const CATEGORY_ICON_MAP: Record<string, IconType> = {
  '🍔': MdOutlineFastfood,
  '👗': MdOutlineCheckroom,
  '🏠': MdOutlineHome,
  '🚗': MdOutlineDirectionsCar,
  '📚': MdOutlineSchool,
  '🎲': MdOutlineSportsEsports,
  '🧻': MdOutlineShoppingBasket,
  '💊': MdOutlineMedicalServices,
  '📉': MdOutlineTrendingDown,
  '📈': MdOutlineTrendingUp,
  '💰': MdOutlineMonetizationOn,
  '🎁': MdOutlineRedeem,
  '✨': MdOutlineCategory,
};

export function getCategoryIcon(category: string, className: string = '') {
  // Legacy records may carry emoji outside the current option list — never render a blank slot.
  const Icon = CATEGORY_ICON_MAP[category] ?? MdOutlineCategory;
  return <Icon className={className} />;
}
