export function displayName(first_name: string, last_name: string) {
  return `${first_name} ${last_name.toUpperCase()}`;
}

export type DateFormat =
  | 'yyyy-MM-dd'
  | 'dd/MM/yyyy'
  | 'MM/dd/yyyy'
  | 'yyyy-MM-dd HH:mm'
  | 'dd/MM/yyyy HH:mm'
  | 'full'
  | 'short'
  | string;
