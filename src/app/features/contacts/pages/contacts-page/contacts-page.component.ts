import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactListComponent } from '../../components/contact-list/contact-list.component';
import { ContactDetailsComponent } from '../../components/contact-details/contact-details.component';
import { ContactsService } from '../../../../core/services/contacts.service';
import { Contact, EmailAddress } from '../../../../shared/models/contact.model';

@Component({
  selector: 'app-contacts-page',
  standalone: true,
  imports: [CommonModule, ContactListComponent, ContactDetailsComponent],
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.scss']
})
export class ContactsPageComponent implements OnInit {
  contacts: { contact: Contact, emails: EmailAddress[] }[] = [];
  selectedContact: Contact | null = null;
  selectedEmails: EmailAddress[] = [];
  loading = true;
  error: string | null = null;

  constructor(private contactsService: ContactsService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  /**
   * Load all contacts with their emails
   */
  loadContacts(): void {
    this.loading = true;
    this.error = null;

    this.contactsService.getContactsWithEmails().subscribe({
      next: (contactsWithEmails) => {
        this.contacts = contactsWithEmails;
        this.loading = false;

        // Auto-select first contact if available
        if (this.contacts.length > 0) {
          this.selectContact(this.contacts[0].contact.id.toString());
        }
      },
      error: (err) => {
        console.error('Error loading contacts', err);
        this.error = 'Failed to load contacts. Please try again later.';
        this.loading = false;
      }
    });
  }

  /**
   * Handle contact selection
   */
  selectContact(contactId: string): void {
    // Convert string ID to number for consistent comparison
    const selectedContactId = parseInt(contactId, 10);

    const selectedContactData = this.contacts.find(item => {
      if (typeof item.contact.id === 'number') {
        return item.contact.id === selectedContactId;
      }
      // Fallback for string IDs (should not normally happen with new data model)
      return String(item.contact.id) === contactId;
    });

    if (selectedContactData) {
      this.selectedContact = selectedContactData.contact;
      this.selectedEmails = selectedContactData.emails;
    }
  }
}
