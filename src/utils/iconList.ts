import {
  Package,
  Box,
  ShoppingBag,
  Archive,
  Folder,
  FolderOpen,
  Briefcase,
  BookOpen,
  Heart,
  Star,
  Home,
  Car,
  Plane,
  Camera,
  Music,
  Gamepad2,
  Dumbbell,
  Utensils,
  Coffee,
  Gift,
  // Holiday Icons
  TreePine,
  Snowflake,
  Ghost,
  PartyPopper,
  Cake,
  Flame,
  Flower2,
  Rabbit,
  Clover,
  Sparkles,
  Zap,
  Crown,
  // Room/House Icons
  Bed,
  Bath,
  ChefHat,
  Sofa,
  Tv,
  Book,
  Shirt,
  Trees,
  Drill,
  Gamepad,
  Baby,
  Users,
  DoorOpen,
  Wind,
  Hammer,
  Wrench,
  LucideProps,
} from "lucide-react";

// Available icons for totes
export const AVAILABLE_ICONS = [
  // General/Storage
  { name: "Package", icon: Package },
  { name: "Box", icon: Box },
  { name: "ShoppingBag", icon: ShoppingBag },
  { name: "Archive", icon: Archive },
  { name: "Folder", icon: Folder },
  { name: "FolderOpen", icon: FolderOpen },
  { name: "Briefcase", icon: Briefcase },
  { name: "BookOpen", icon: BookOpen },

  // Holiday Icons
  { name: "TreePine", icon: TreePine }, // Christmas
  { name: "Snowflake", icon: Snowflake }, // Winter/Christmas
  { name: "Ghost", icon: Ghost }, // Halloween
  { name: "PartyPopper", icon: PartyPopper }, // New Year's/Celebrations
  { name: "Cake", icon: Cake }, // Birthdays
  { name: "Flame", icon: Flame }, // Hanukkah/Diwali
  { name: "Flower2", icon: Flower2 }, // Spring/Easter
  { name: "Rabbit", icon: Rabbit }, // Easter
  { name: "Clover", icon: Clover }, // St. Patrick's Day
  { name: "Sparkles", icon: Sparkles }, // New Year's/Celebrations
  { name: "Zap", icon: Zap }, // July 4th/Fireworks
  { name: "Crown", icon: Crown }, // New Year's/Celebrations
  { name: "Heart", icon: Heart }, // Valentine's Day
  { name: "Gift", icon: Gift }, // Christmas/Birthdays

  // Rooms of the House
  { name: "Bed", icon: Bed }, // Bedroom
  { name: "Bath", icon: Bath }, // Bathroom
  { name: "ChefHat", icon: ChefHat }, // Kitchen
  { name: "Sofa", icon: Sofa }, // Living Room
  { name: "Tv", icon: Tv }, // Family Room/Entertainment
  { name: "Book", icon: Book }, // Study/Library
  { name: "Shirt", icon: Shirt }, // Closet/Laundry
  { name: "Car", icon: Car }, // Garage
  { name: "Trees", icon: Trees }, // Backyard/Garden
  { name: "Drill", icon: Drill }, // Workshop/Basement
  { name: "Gamepad", icon: Gamepad }, // Game Room
  { name: "Baby", icon: Baby }, // Nursery
  { name: "Users", icon: Users }, // Dining Room
  { name: "DoorOpen", icon: DoorOpen }, // Entryway/Foyer
  { name: "Wind", icon: Wind }, // Attic
  { name: "Hammer", icon: Hammer }, // Workshop/Garage
  { name: "Wrench", icon: Wrench }, // Utility Room

  // Activities/Hobbies
  { name: "Star", icon: Star },
  { name: "Home", icon: Home },
  { name: "Plane", icon: Plane },
  { name: "Camera", icon: Camera },
  { name: "Music", icon: Music },
  { name: "Gamepad2", icon: Gamepad2 },
  { name: "Dumbbell", icon: Dumbbell },
  { name: "Utensils", icon: Utensils },
  { name: "Coffee", icon: Coffee },
];

export type IconComponent = React.ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
>;

export const ICON_MAP: Record<string, IconComponent> = {
  // General/Storage
  Package,
  Box,
  ShoppingBag,
  Archive,
  Folder,
  FolderOpen,
  Briefcase,
  BookOpen,

  // Holiday Icons
  TreePine,
  Snowflake,
  Ghost,
  PartyPopper,
  Cake,
  Flame,
  Flower2,
  Rabbit,
  Clover,
  Sparkles,
  Zap,
  Crown,
  Heart,
  Gift,

  // Rooms of the House
  Bed,
  Bath,
  ChefHat,
  Sofa,
  Tv,
  Book,
  Shirt,
  Car,
  Trees,
  Drill,
  Gamepad,
  Baby,
  Users,
  DoorOpen,
  Wind,
  Hammer,
  Wrench,

  // Activities/Hobbies
  Star,
  Home,
  Plane,
  Camera,
  Music,
  Gamepad2,
  Dumbbell,
  Utensils,
  Coffee,
};
