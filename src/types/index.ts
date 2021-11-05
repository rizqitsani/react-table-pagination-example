import { IconType } from 'react-icons';

export type NavLinks = {
  label: string;
  href: string;
  icon: IconType;
}[];

export type DataType = {
  id: number;
  title: string;
  completed: boolean;
};
