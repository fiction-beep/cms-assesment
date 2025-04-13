import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact, Email, EmailAddress, Phone } from '../../../../shared/models/contact.model';

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss']
})
export class ContactDetailsComponent implements OnChanges {
  @Input() selectedContact: Contact | null = null;
  @Input() emails: EmailAddress[] = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedContact'] && changes['selectedContact'].currentValue) {
      // Any additional processing when contact changes can go here
    }
  }

  /**
   * Get primary email from the list
   */
  get primaryEmail(): EmailAddress | undefined {
    // First try from the input emails (for backward compatibility)
    const inputPrimaryEmail = this.emails.find(email => email.isPrimary);
    if (inputPrimaryEmail) return inputPrimaryEmail;

    // Then try from the contact's email property (new format)
    if (this.selectedContact?.email) {
      const contactPrimaryEmail = this.selectedContact.email.find(email => email.isPrimary);
      if (contactPrimaryEmail) {
        return {
          id: '1',
          email: contactPrimaryEmail.address,
          isPrimary: true,
          contactId: this.selectedContact.id.toString()
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
    if (this.selectedContact?.email) {
      return this.selectedContact.email
        .filter(email => !email.isPrimary)
        .map((email, index) => ({
          id: (index + 2).toString(), // Start from 2 since 1 is for primary
          email: email.address,
          isPrimary: false,
          contactId: this.selectedContact!.id.toString()
        }));
    }

    return [];
  }

  /**
   * Get primary phone from the list
   */
  get primaryPhone(): string | undefined {
    if (this.selectedContact?.phone) {
      const primaryPhone = this.selectedContact.phone.find(phone => phone.isPrimary);
      if (primaryPhone) {
        return primaryPhone.number;
      } else if (this.selectedContact.phone.length > 0) {
        return this.selectedContact.phone[0].number;
      }
    }
    return undefined;
  }

  /**
   * Get secondary phones
   */
  get secondaryPhones(): string[] {
    if (!this.selectedContact?.phone) return [];

    const phones = this.selectedContact.phone;
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
    if (!this.selectedContact) return '';
    return `${this.selectedContact.firstName} ${this.selectedContact.lastName}`;
  }

  /**
   * Get dial info (messenger ID or similar)
   */
  get dialInfo(): string {
    // Generate a messenger ID based on the first and last name
    if (this.selectedContact) {
      const firstName = this.selectedContact.firstName.toLowerCase();
      const lastName = this.selectedContact.lastName.toLowerCase();
      return `${firstName.charAt(0)}.${lastName}@ymsg.com`;
    }
    return 'Not available';
  }

  /**
   * Get status class for contact status indicator
   */
  getStatusClass(status?: string): string {
    if (!status) return 'offline';

    switch (status) {
      case 'online': return 'online';
      case 'away': return 'away';
      default: return 'offline';
    }
  }
}
