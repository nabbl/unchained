export interface User {
    first_name?: string;
    last_name?: string;
    full_name?: string;
    street?: string;
    zip?: number;
    city?: string;
    full_address?: string;
    terms_accepted?: boolean;
    mobile?: string;
    email: string;
    about_me?: string;
    avatar?: string;
    cover_picture?: string;
    settlement?: any; // TODO settlement
    interests?: any; // TODO Tag[]
    allow_email_notification?: boolean;
    email_is_public?: boolean;
    mobile_is_public?: boolean;
    admin?: boolean;
    staff?: boolean;
    tenant?: boolean;
    isPasswordGenerated?: boolean;
    delete_avatar?: boolean;
    delete_cover_picture?: boolean;
  }
  