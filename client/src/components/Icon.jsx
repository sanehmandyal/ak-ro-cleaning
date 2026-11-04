import {
  Sparkles, Droplets, Waves, Bath, ChefHat, AppWindow, Sofa, Layers, Home, Building2, Store,
  ShieldCheck, Users, BadgeIndianRupee, Clock, Star, Wrench, Brush, SprayCan, Trash2, Wind, Leaf, ThumbsUp,
} from 'lucide-react';

export const ICONS = {
  Sparkles, Droplets, Waves, Bath, ChefHat, AppWindow, Sofa, Layers, Home, Building2, Store,
  ShieldCheck, Users, BadgeIndianRupee, Clock, Star, Wrench, Brush, SprayCan, Trash2, Wind, Leaf, ThumbsUp,
};

export default function Icon({ name, ...props }) {
  const Cmp = ICONS[name] || Sparkles;
  return <Cmp aria-hidden="true" {...props} />;
}
