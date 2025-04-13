export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  profileImage?: string;
  bio?: string;
  email?: Email[];
  phone?: Phone[];
  meeting?: string;
  social?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    pinterest?: string;
    google?: string;
  };
  status?: 'online' | 'offline' | 'away';
}

export interface Email {
  address: string;
  isPrimary?: boolean;
}

export interface Phone {
  number: string;
  isPrimary?: boolean;
}

// Keeping old interfaces for backward compatibility
export interface EmailAddress {
  id: string;
  email: string;
  isPrimary: boolean;
  contactId: string;
}
