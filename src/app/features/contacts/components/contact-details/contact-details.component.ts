import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact, Email, EmailAddress, Phone } from '../../../../shared/models/contact.model';

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss']
})
export class ContactDetailsComponent {
  @Input() contact: Contact | null = null;
  @Input() emails: EmailAddress[] = [];

  /**
   * Get primary email from the list
   */
  get primaryEmail(): EmailAddress | undefined {
    // First try from the input emails (for backward compatibility)
    const inputPrimaryEmail = this.emails.find(email => email.isPrimary);
    if (inputPrimaryEmail) return inputPrimaryEmail;

    // Then try from the contact's email property (new format)
    if (this.contact?.email) {
      const contactPrimaryEmail = this.contact.email.find(email => email.isPrimary);
      if (contactPrimaryEmail) {
        return {
          id: '1',
          email: contactPrimaryEmail.address,
          isPrimary: true,
          contactId: this.contact.id.toString()
        };
      }
    }

    return undefined;
  }

  /**
   * Get non-primary emails
   */
  get secondaryEmails(): EmailAddress[] {
    // First try from the input emails (for backward compatibility)
    const inputSecondaryEmails = this.emails.filter(email => !email.isPrimary);
    if (inputSecondaryEmails.length > 0) return inputSecondaryEmails;

    // Then try from the contact's email property (new format)
    if (this.contact?.email) {
      return this.contact.email
        .filter(email => !email.isPrimary)
        .map((email, index) => ({
          id: (index + 2).toString(), // Start from 2 since 1 is for primary
          email: email.address,
          isPrimary: false,
          contactId: this.contact!.id.toString()
        }));
    }

    return [];
  }

  /**
   * Get primary phone from the list
   */
  get primaryPhone(): string | undefined {
    if (this.contact?.phone) {
      const primaryPhone = this.contact.phone.find(phone => phone.isPrimary);
      if (primaryPhone) {
        return primaryPhone.number;
      } else if (this.contact.phone.length > 0) {
        return this.contact.phone[0].number;
      }
    }
    return undefined;
  }

  /**
   * Get secondary phones
   */
  get secondaryPhones(): string[] {
    if (!this.contact?.phone) return [];

    const phones = this.contact.phone;
    if (phones.length <= 1) return [];

    const secondaryPhones = phones.filter(phone => !phone.isPrimary);
    if (secondaryPhones.length > 0) {
      return secondaryPhones.map(phone => phone.number);
    }

    // If no phone is marked as primary, return all phones except the first one
    return phones.slice(1).map(phone => phone.number);
  }

  /**
   * Get full name of the contact
   */
  get fullName(): string {
    if (!this.contact) return '';
    return `${this.contact.firstName} ${this.contact.lastName}`;
  }

  /**
   * Get dial info from the contact
   */
  get dialInfo(): string | undefined {
    // There is no dedicated dial property in the new model
    // Let's use a fallback based on email if needed
    if (this.contact?.email && this.contact.email.length > 0) {
      const email = this.contact.email[0].address;
      // Extract username part of the email as a fallback dial
      const username = email.split('@')[0];
      return `j.${username}@ymsg.com`;
    }
    return undefined;
  }
}
