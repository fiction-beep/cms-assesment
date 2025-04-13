import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contact, EmailAddress } from '../../../../shared/models/contact.model';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent {
  @Input() contacts: { contact: Contact, emails: EmailAddress[] }[] = [];
  @Output() contactSelected = new EventEmitter<string>();

  searchTerm: string = '';

  /**
   * Filter contacts based on search term
   */
  get filteredContacts(): { contact: Contact, emails: EmailAddress[] }[] {
    if (!this.searchTerm.trim()) {
      return this.contacts;
    }

    const term = this.searchTerm.toLowerCase();
    return this.contacts.filter(({ contact, emails }) => {
      const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
      const jobTitle = contact.jobTitle?.toLowerCase() || '';
      const emailMatch = emails.some(e => e.email.toLowerCase().includes(term));
      const phoneMatch = contact.phone?.some(p => p.number.includes(term)) || false;

      return fullName.includes(term) ||
             jobTitle.includes(term) ||
             emailMatch ||
             phoneMatch;
    });
  }

  /**
   * Handle contact selection
   */
  selectContact(contactId: number | string): void {
    this.contactSelected.emit(contactId.toString());
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
