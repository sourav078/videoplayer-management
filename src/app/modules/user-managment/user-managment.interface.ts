export type IUserFilters = {
  searchTerm?: string;
  name?: string;
  email?: string;
  role?: string;
};

export type ICreateUser = {
  first_name: string;
  last_name?: string;
  email: string;
  password: string;

  is_admin?: boolean;
  provider?: 'credentials' | 'google' | 'facebook';
  image?: string;
  gender?: 'male' | 'female' | 'other';
  marital_status?: 'unmarried' | 'married' | 'divorced' | 'widowed';
  date_of_birth?: string;
  mobile_number: string;
  roles: string[];
  address?: {
    address_line_one: string;
    address_line_two?: string;
    area?: string;
    thana: string;
    district: string;
    zid_code?: string;
  }[];
};
