export interface AccountType {
  label: string;
  value: 'ldap' | 'local';
}

export interface AccountItem {
  mark: {text: string}[];
  accountType: AccountType | undefined;
  login: string;
  password: string | null;
  id: string;
}
export interface AccountItemValidator {
  mark: any[];
  accountType: any[];
  login: any[];
  password: any[];
  id: any[];
}
